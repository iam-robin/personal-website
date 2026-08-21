import DOMPurify from "isomorphic-dompurify";

/**
 * Replies to a blog post's Mastodon toot, fetched at build time.
 *
 * The conversation lives on Mastodon; this only mirrors it. That means no
 * comment database, no moderation queue, and no client-side JS — at the cost
 * of the page being up to a day stale, which the daily rebuild bounds.
 *
 * Everything that makes a reply safe to put on the page happens in here. The
 * component receives strings that are already sanitized, and never sees a raw
 * status.
 */

const INSTANCE = "https://mastodon.social";
const HANDLE = "iamrobin";
const TIMEOUT_MS = 8_000;

/** Whole branches are added until this many replies are on the page. */
const MAX_REPLIES = 12;

/**
 * Longer than this (plain-text characters) and a reply is left on Mastodon.
 * Truncating sanitized HTML mid-string means re-balancing tags, so an
 * over-long reply is dropped and counted instead. mastodon.social caps toots
 * at 500 characters, but a federated reply from another instance has no such
 * limit and one essay would out-length the post it sits under.
 */
const MAX_REPLY_CHARS = 700;

/**
 * Accounts filtered out of every thread, by `acct` ("kwalm", or
 * "someone@another.instance"), lowercased.
 *
 * mastodon.social's own moderation already applies — suspended accounts and
 * defederated instances never reach us. What an unauthenticated fetch cannot
 * see is Robin's *personal* blocks and mutes, so this list is the stand-in for
 * them, and the only lever over what appears on his own site.
 *
 * To take a reply down: add the acct here, push, and run the "Daily rebuild"
 * workflow manually (it has a workflow_dispatch trigger).
 */
const DENIED_ACCTS = new Set<string>([]);

/** Anything else is somebody's followers-only post. See KEEP_VISIBILITY below. */
const KEEP_VISIBILITY = new Set(["public", "unlisted"]);

/** One reply, ready to render. `html` is sanitized. */
export interface MastodonReply {
    id: string;
    url: string;
    date: Date;
    /** Sanitized. Safe for set:html. */
    html: string;
    authorName: string;
    authorAcct: string;
    authorUrl: string;
    /** Robin answering in his own thread. */
    isAuthor: boolean;
    /**
     * BCP-47, and only when it differs from the page's own language — see
     * replyLanguage. null means "don't assert one".
     */
    language: string | null;
    /** Content warning. Non-null means the body belongs behind a <details>. */
    spoiler: string | null;
    /** Follow-ups, flattened to one level. See buildBranches. */
    children: MastodonReply[];
}

export interface MastodonThread {
    /** Usable even when `ok` is false — built from the id, no API involved. */
    url: string;
    /** false when the API was unreachable, slow, or answered badly. */
    ok: boolean;
    /** Top-level branches, oldest first, already capped. */
    branches: MastodonReply[];
    /** Renderable replies that didn't make the page. 0 when none. */
    hiddenCount: number;
    favourites: number | null;
    reblogs: number | null;
}

/** Only the fields actually read. */
interface MastodonAccount {
    id: string;
    acct: string;
    display_name: string;
    url: string;
    bot: boolean;
    /** Silenced by the instance's moderators. */
    limited?: boolean;
}

interface MastodonStatus {
    id: string;
    url: string | null;
    created_at: string;
    content: string;
    visibility: string;
    spoiler_text: string;
    language: string | null;
    in_reply_to_id: string | null;
    in_reply_to_account_id: string | null;
    favourites_count: number;
    reblogs_count: number;
    media_attachments: unknown[];
    account: MastodonAccount;
}

/**
 * Accepts a bare status id, an id with junk stuck to it ("…702#"), or the whole
 * toot URL copied out of the address bar — the last one is what makes the
 * publishing step a paste rather than a digit hunt. Anything unusable is null,
 * which the component treats the same as no id at all.
 */
export function normalizeStatusId(raw?: string): string | null {
    // Last id-shaped segment, not simply the last segment: a copied URL can
    // carry a "#comment" fragment after the id.
    const segments = (raw ?? "").trim().split(/[/#?]/).filter(Boolean);
    for (const segment of segments.reverse()) {
        const digits = segment.replace(/\D/g, "");
        if (/^\d{8,}$/.test(digits)) return digits;
    }
    return null;
}

/**
 * The permalink, from the id alone. No network call — which is why the
 * "reply on Mastodon" link still works on a build where the API was down.
 */
export function threadUrl(id: string): string {
    return `${INSTANCE}/@${HANDLE}/${id}`;
}

const ALLOWED_TAGS = [
    "p",
    "br",
    "a",
    "em",
    "strong",
    "del",
    "code",
    "pre",
    "blockquote",
    "ul",
    "ol",
    "li",
];

/** Tags out, entities in, whitespace collapsed — for length and empty tests. */
function plainText(html: string): string {
    return html
        .replace(/<[^>]+>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&lt;|&gt;|&quot;|&#39;|&amp;/g, "x")
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * Mastodon's HTML, made safe for this page in three passes.
 *
 * `class` is stripped outright rather than allowlisted. Mastodon carries
 * meaning in it (.invisible hides a URL's scheme, .h-card wraps a mention),
 * but this site ships Tailwind: .invisible here is `visibility:hidden`, which
 * would *reserve* the hidden prefix's width and leave a gap mid-URL — and
 * .fixed/.inset-0/.z-50 are all in the same stylesheet, so a class-carrying
 * reply could lay a full-viewport overlay over the post. Allowlisting by value
 * would need a DOMPurify hook, and hooks attach to the shared singleton that
 * the RSS feed and the postcard SVGs also sanitize through.
 */
export function sanitizeReplyHtml(content: string): string {
    // 1. Unwrap the two classes that carry meaning, while they still exist.
    //    Regex on untrusted HTML is fine *here* precisely because the result
    //    goes straight into DOMPurify below: the worst a crafted string can do
    //    is delete some of its own text or award itself an ellipsis.
    const unwrapped = content
        .replace(/<span class="invisible">.*?<\/span>/gs, "")
        .replace(/<span class="ellipsis">(.*?)<\/span>/gs, "$1…");

    // 2. `span` is deliberately not allowed. DOMPurify keeps the *text* of a
    //    disallowed element, so the h-card wrapper around a mention collapses
    //    to a plain <a href>@handle</a> — which is a shape step 3 can match.
    const clean = DOMPurify.sanitize(unwrapped, {
        ALLOWED_TAGS,
        ALLOWED_ATTR: ["href"],
        ALLOWED_URI_REGEXP: /^(?:https?:|mailto:)/i,
    });

    // 3. The markup is now DOMPurify's own output, so `<a ` can only be a real
    //    anchor — anything in a text node has had its `<` escaped.
    return (
        clean
            // Every reply opens with the handles of everyone in the thread. A
            // Mastodon client collapses that row; here it would mean every
            // single comment starting "@iamrobin".
            .replace(/^<p>(?:<a href="[^"]*">@[^<]*<\/a>|\s|&nbsp;)+/, "<p>")
            .replace(/^<p>\s*<\/p>/, "")
            // DOMPurify strips a javascript: href but keeps the element. A
            // dead <a> would still pick up the underline style, so unwrap it.
            .replace(/<a>(.*?)<\/a>/gs, "$1")
            // ugc + nofollow: the only thing a link spammer would want here.
            .replace(
                /<a /g,
                '<a target="_blank" rel="nofollow ugc noopener noreferrer" ',
            )
    );
}

/**
 * Control and bidi characters. A U+202E in a display name reverses the rest of
 * the line — including text the commenter doesn't own — and escaping doesn't
 * stop it, because the characters are legitimate content to an escaper.
 */
const BIDI_AND_ZERO_WIDTH =
    /[\u0000-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g;

/**
 * Rendered as text, so Astro handles the escaping. Custom emoji are stripped
 * rather than resolved: `account.emojis` would mean an <img> per emoji from an
 * arbitrary instance, which is the same third-party-request cost as avatars,
 * for decoration.
 */
function displayName(account: MastodonAccount): string {
    const name = account.display_name
        .replace(/:[a-zA-Z0-9_]+:/g, "")
        .replace(BIDI_AND_ZERO_WIDTH, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 60);
    return name || `@${account.acct}`;
}

/** The language of the surrounding page. */
const PAGE_LANGUAGE = "en";

/**
 * Mastodon reports the language the *poster's client* was set to, not the
 * language actually written. The real threads prove the difference: every
 * reply on the what-I-use post comes back "en", including the several written
 * entirely in German.
 *
 * So the field is a declaration, not a detection, and stamping lang="en" onto
 * a German paragraph would tell a screen reader to read it with English
 * phonemes — a confident lie where saying nothing merely inherits the page.
 * Emit it only when it disagrees with the page, where it is at least
 * deliberate on the poster's part.
 */
function replyLanguage(language: string | null): string | null {
    if (!language) return null;
    return language.split("-")[0].toLowerCase() === PAGE_LANGUAGE
        ? null
        : language;
}

async function getJson<T>(path: string): Promise<T> {
    const response = await fetch(`${INSTANCE}/api/v1${path}`, {
        headers: {
            accept: "application/json",
            // Some instances reject Node's default UA outright, and a UA with
            // a contact URL is what gets you unblocked rather than throttled.
            "user-agent": "iamrob.in build (+https://iamrob.in)",
        },
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (!response.ok) {
        throw new Error(`${response.status} ${response.statusText}`);
    }
    return (await response.json()) as T;
}

/**
 * One fetch per toot per build. Astro renders every blog page in the same
 * process, so this also covers a second consumer without a second round trip —
 * the same reason getFilms() caches in utils/movies.ts.
 */
const inflight = new Map<string, Promise<MastodonThread>>();

/**
 * After this many failures in a row the instance is treated as down for the
 * rest of the build. Without it, a cold build against an unreachable
 * mastodon.social costs the full timeout once per annotated post.
 */
const CIRCUIT_LIMIT = 3;
let consecutiveFailures = 0;

/**
 * `null` means "this post has no toot" — the component then renders nothing at
 * all, rather than an empty comment section.
 */
export function getMastodonThread(
    raw?: string,
): Promise<MastodonThread> | null {
    const id = normalizeStatusId(raw);
    if (!id) {
        if (raw) {
            console.warn(
                `[mastodon] unusable mastodonId: ${JSON.stringify(raw)}`,
            );
        }
        return null;
    }

    let thread = inflight.get(id);
    if (!thread) {
        thread = fetchThread(id);
        inflight.set(id, thread);
    }
    return thread;
}

function emptyThread(id: string): MastodonThread {
    return {
        url: threadUrl(id),
        ok: false,
        branches: [],
        hiddenCount: 0,
        favourites: null,
        reblogs: null,
    };
}

/**
 * Never throws. A Mastodon outage degrades the section to its invitation
 * state; it does not fail the deploy. (v3's helper re-threw, which left every
 * caller wrapping it in a try/catch of its own.)
 */
async function fetchThread(id: string): Promise<MastodonThread> {
    if (consecutiveFailures >= CIRCUIT_LIMIT) return emptyThread(id);

    // Two requests: /context carries the replies but not the toot itself, and
    // the root is what gives us Robin's account id (so `isAuthor` isn't a
    // hardcoded number) along with the counts. allSettled so either can fail
    // on its own.
    const [contextResult, rootResult] = await Promise.allSettled([
        getJson<{ ancestors: MastodonStatus[]; descendants: MastodonStatus[] }>(
            `/statuses/${id}/context`,
        ),
        getJson<MastodonStatus>(`/statuses/${id}`),
    ]);

    if (contextResult.status === "rejected") {
        consecutiveFailures += 1;
        const reason = String(contextResult.reason);
        // A 404 is a wrong or deleted id in frontmatter — a content bug Robin
        // can fix — rather than a bad day for the instance. Say so.
        if (reason.includes("404")) {
            console.error(
                `[mastodon] status ${id} not found — check the mastodonId in the post's frontmatter`,
            );
        } else {
            console.error(`[mastodon] thread ${id} unavailable: ${reason}`);
        }
        return emptyThread(id);
    }
    consecutiveFailures = 0;

    const root = rootResult.status === "fulfilled" ? rootResult.value : null;
    if (!root) {
        console.error(`[mastodon] status ${id} unavailable, replies only`);
    }

    const descendants = contextResult.value.descendants ?? [];

    // `ancestors` is deliberately ignored. It's empty for an announcement toot,
    // and if Robin ever links a post from mid-thread they'd be his own
    // preamble, not replies to it.

    // Falls back to the account any direct reply is replying *to*, which is
    // Robin by definition — so a failed root fetch still marks his replies.
    const authorId =
        root?.account.id ??
        descendants.find((s) => s.in_reply_to_id === id)
            ?.in_reply_to_account_id ??
        null;

    const kept = descendants.filter((status) => keep(status, authorId));
    const branches = buildBranches(kept, id, authorId);

    const placed = branches.reduce(
        (total, branch) => total + 1 + branch.children.length,
        0,
    );

    return {
        url: root?.url ?? threadUrl(id),
        ok: true,
        branches,
        hiddenCount: kept.length - placed,
        favourites: root?.favourites_count ?? null,
        reblogs: root?.reblogs_count ?? null,
    };
}

function keep(status: MastodonStatus, authorId: string | null): boolean {
    // The privacy guard. An unauthenticated /context cannot return
    // followers-only or direct replies today, so this is belt and braces — but
    // it is also what would stop a future access token from quietly publishing
    // someone's private reply to the open web. It stays a hard filter no
    // matter how the data was fetched.
    if (!KEEP_VISIBILITY.has(status.visibility)) return false;

    if (status.account.bot) return false;
    // Silenced by mastodon.social's own moderators. Free signal; take it.
    if (status.account.limited) return false;
    if (DENIED_ACCTS.has(status.account.acct.toLowerCase())) return false;

    // A self-reply whose parent is *also* Robin is the announcement carrying
    // on, and would repeat the post it sits under. A self-reply to someone
    // else is his half of a conversation, and stays.
    if (
        authorId &&
        status.account.id === authorId &&
        status.in_reply_to_account_id === authorId
    ) {
        return false;
    }

    const text = plainText(sanitizeReplyHtml(status.content));

    // Nothing to quote — a reply that was only an image, or only "@iamrobin".
    if (!text) return false;
    if (text.length > MAX_REPLY_CHARS) return false;

    return true;
}

function toReply(status: MastodonStatus, authorId: string | null): MastodonReply {
    return {
        id: status.id,
        url: status.url ?? threadUrl(status.id),
        date: new Date(status.created_at),
        html: sanitizeReplyHtml(status.content),
        authorName: displayName(status.account),
        authorAcct: status.account.acct,
        authorUrl: status.account.url,
        isAuthor: Boolean(authorId) && status.account.id === authorId,
        language: replyLanguage(status.language),
        spoiler: status.spoiler_text.trim() || null,
        children: [],
    };
}

/**
 * Grouped, not nested. Each direct reply to the toot opens a branch, and every
 * follow-up beneath it — at any depth — is flattened into that branch in time
 * order.
 *
 * Flat chronological was the first instinct and the real threads killed it:
 * with nine branches interleaved by timestamp, two unrelated sub-conversations
 * shuffle into each other. A faithful tree is no better — the reading column is
 * 42rem and the threads run four deep, so the deepest replies would have
 * nothing left to sit in. One level of indent keeps each conversation together
 * and still fits; inside a branch the authors alternate, so the back-and-forth
 * reads without further nesting.
 *
 * Branches are ordered by their opening reply and chronologically within, then
 * added whole until MAX_REPLIES — never split, because half a conversation is
 * worse than none of it.
 */
function buildBranches(
    statuses: MastodonStatus[],
    rootId: string,
    authorId: string | null,
): MastodonReply[] {
    const survivors = new Map(statuses.map((s) => [s.id, s]));

    /** The nearest ancestor still on the page, so a branch survives having a
     *  middle reply filtered out. */
    const branchRoot = (status: MastodonStatus): string => {
        let current = status;
        // Bounded by the chain length; survivors is finite and acyclic.
        for (let hops = 0; hops < 50; hops += 1) {
            const parentId = current.in_reply_to_id;
            if (!parentId || parentId === rootId) return current.id;
            const parent = survivors.get(parentId);
            if (!parent) return current.id;
            current = parent;
        }
        return current.id;
    };

    const byBranch = new Map<string, MastodonStatus[]>();
    for (const status of statuses) {
        const key = branchRoot(status);
        if (!byBranch.has(key)) byBranch.set(key, []);
        byBranch.get(key)!.push(status);
    }

    const oldestFirst = (a: MastodonStatus, b: MastodonStatus) =>
        a.created_at.localeCompare(b.created_at);

    const branches = [...byBranch.values()]
        .map((group) => [...group].sort(oldestFirst))
        .sort((a, b) => oldestFirst(a[0], b[0]));

    const result: MastodonReply[] = [];
    let count = 0;

    for (const group of branches) {
        if (count + group.length > MAX_REPLIES && result.length > 0) break;
        const [opener, ...rest] = group;
        result.push({
            ...toReply(opener, authorId),
            children: rest.map((status) => toReply(status, authorId)),
        });
        count += group.length;
        if (count >= MAX_REPLIES) break;
    }

    return result;
}

import { createHmac, timingSafeEqual } from "node:crypto";

/*
 * Invisible spam filter for the postcard form. No captcha, no IPs: every
 * check looks only at what the form itself sends. A rejected card gets the
 * normal success page, so a bot never learns which check it tripped.
 */

export const HONEYPOT_FIELD = "homepage";
export const MAX_AUTHOR = 60;
export const MAX_BODY = 270;
export const MAX_COUNTRY = 18;
const MAX_URL = 200;
const MAX_STAMP = 200_000;

// Nobody reads the form and writes a card in under four seconds.
const MIN_FILL_MS = 4_000;
// Long enough for a tab left open over a weekend, short enough to stop replays.
const MAX_FILL_MS = 7 * 24 * 60 * 60 * 1000;

const secret = () =>
    import.meta.env?.POSTCARD_FORM_SECRET ??
    import.meta.env?.ASTRO_DB_APP_TOKEN ??
    "postcards-dev-secret";

const sign = (value: string) =>
    createHmac("sha256", secret()).update(value).digest("hex");

/** A signed timestamp for the form, so the time check can't be faked. */
export function createFormToken(now = Date.now()) {
    const issued = String(now);
    return `${issued}.${sign(issued)}`;
}

function checkFormToken(token: unknown, now = Date.now()): string | null {
    if (typeof token !== "string") return "missing token";
    const [issued, signature] = token.split(".");
    if (!issued || !signature) return "malformed token";

    const expected = Buffer.from(sign(issued));
    const given = Buffer.from(signature);
    if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
        return "bad token signature";
    }

    const age = now - Number(issued);
    if (!Number.isFinite(age)) return "malformed token";
    if (age < MIN_FILL_MS) return `filled too fast (${age}ms)`;
    if (age > MAX_FILL_MS) return "token expired";
    return null;
}

// The website field is the place for a link; links inside the card are spam.
const LINK_PATTERN = /https?:\/\/|www\.|\[url|<a\s|\b[a-z0-9-]+\.(com|net|org|ru|xyz|top|info|biz|site|online|shop)\b/i;

const isHttpUrl = (value: string) => {
    try {
        const url = new URL(value);
        return url.protocol === "http:" || url.protocol === "https:";
    } catch {
        return false;
    }
};

const text = (value: FormDataEntryValue | null) =>
    typeof value === "string" ? value.trim() : "";

/** Returns why the submission looks like spam, or null if it looks human. */
export function detectSpam(formData: FormData): string | null {
    const honeypot = formData.get(HONEYPOT_FIELD);
    if (typeof honeypot === "string" && honeypot !== "") return "honeypot filled";

    const tokenProblem = checkFormToken(formData.get("form-token"));
    if (tokenProblem) return tokenProblem;

    const author = text(formData.get("author"));
    const body = text(formData.get("body"));
    const country = text(formData.get("country"));
    const websiteUrl = text(formData.get("websiteUrl"));
    const stampSvg = text(formData.get("stamp-svg"));

    // The stamp is drawn in the browser; scripts posting straight to the
    // endpoint arrive without one.
    if (!stampSvg.startsWith("<svg") || stampSvg.length > MAX_STAMP) {
        return "no stamp";
    }

    // The form's own limits, which bots don't bother to respect.
    if (author.length > MAX_AUTHOR) return "author too long";
    // Line breaks are sent as \r\n but count as one character in the textarea.
    if (body.replace(/\r\n/g, "\n").length > MAX_BODY) return "body too long";
    if (country.length > MAX_COUNTRY) return "country too long";
    if (websiteUrl && (websiteUrl.length > MAX_URL || !isHttpUrl(websiteUrl))) {
        return "invalid website";
    }

    if (LINK_PATTERN.test(author) || LINK_PATTERN.test(body) || LINK_PATTERN.test(country)) {
        return "link in text";
    }

    return null;
}

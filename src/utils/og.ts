/**
 * The per-page link preview card, drawn at build time.
 *
 * Same composition as the hand-drawn public/opengraph.png it sits next to —
 * bird top-left, a bottom-anchored block of type — only with the page's own
 * words in it. Satori lays the card out as flexbox and hands back SVG with the
 * glyphs already outlined (`embedFont`, its default), so sharp can rasterize
 * it without a single font installed on the build host.
 *
 * Only Apercu is loaded. The site card sets its second line in Fira Mono, but
 * the mono is shipped as woff2 only and satori reads ttf/otf/woff — rather
 * than carry a converted copy of a font that is already in the repo, the meta
 * line is set in Apercu and separated by weight and colour instead.
 */
import fs from "node:fs/promises";
import path from "node:path";
import satori from "satori";
import sharp from "sharp";
import { getPaper } from "./paper";

/** The size every scraper is told to expect in Layout.astro. */
const WIDTH = 1200;
const HEIGHT = 630;

/** Matches the optical margin of the hand-drawn card. */
const PADDING = 72;

/**
 * The title's measure, narrower than the 1056px the padding leaves — a title
 * set edge to edge reads as a banner rather than as a line of type, and the
 * card has height to spare for the extra line. Only the title is held to it;
 * the meta and subtitle lines are short enough to keep the full width.
 */
const TITLE_WIDTH = 860;

const INK = "#1a1919";
/** --color-ink-muted, written out: satori takes rgba(), not an eight-digit hex. */
const INK_MUTED = "rgba(26, 25, 25, 0.7)";

const FONT_DIR = path.join(process.cwd(), "public", "fonts");

/*
  Loaded once per build rather than once per card — every blog post renders in
  the same process, and the two files are ~50 KB each.
*/
let fonts: Promise<Awaited<ReturnType<typeof loadFonts>>> | null = null;

async function loadFonts() {
    const [regular, bold] = await Promise.all([
        fs.readFile(path.join(FONT_DIR, "apercu-regular-pro.woff")),
        fs.readFile(path.join(FONT_DIR, "apercu-bold-pro.woff")),
    ]);
    return [
        { name: "Apercu", data: regular, weight: 400 as const, style: "normal" as const },
        { name: "Apercu", data: bold, weight: 700 as const, style: "normal" as const },
    ];
}

/**
 * The robin, as an <img>: satori renders SVG data URIs but not inline <svg>
 * children. Paths are the favicon's; the eye is knocked out in the paper
 * colour instead of the favicon's fixed off-white so it disappears into the
 * stock the card is printed on.
 */
function birdDataUri(paper: string): string {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-3 0 145 167" fill="none">
<path fill="${INK}" d="M32.0769 105.96L0 138.037L16.0384 148.73L53.4615 120.217L32.0769 105.96Z"/>
<path fill="${INK}" d="M71.282 143.384C99.8238 143.384 122.961 120.246 122.961 91.7041C122.961 63.1623 99.8238 40.0247 71.282 40.0247C42.7402 40.0247 19.6025 63.1623 19.6025 91.7041C19.6025 120.246 42.7402 143.384 71.282 143.384Z"/>
<path fill="${INK}" d="M90.8845 84.5759C108.6 84.5759 122.961 70.2146 122.961 52.499C122.961 34.7834 108.6 20.4221 90.8845 20.4221C73.1689 20.4221 58.8076 34.7834 58.8076 52.499C58.8076 70.2146 73.1689 84.5759 90.8845 84.5759Z"/>
<path fill="${INK}" d="M80.1926 102.396C100.861 102.396 117.616 88.0349 117.616 70.3193C117.616 52.6037 100.861 38.2424 80.1926 38.2424C59.5244 38.2424 42.7695 52.6037 42.7695 70.3193C42.7695 88.0349 59.5244 102.396 80.1926 102.396Z"/>
<path fill="${INK}" d="M119.397 43.1926L139 53.39L119.397 63.5873V43.1926Z"/>
<path fill="${paper}" d="M96.2307 64.9733C106.073 64.9733 114.051 56.9948 114.051 47.1528C114.051 37.3108 106.073 29.3323 96.2307 29.3323C86.3887 29.3323 78.4102 37.3108 78.4102 47.1528C78.4102 56.9948 86.3887 64.9733 96.2307 64.9733Z"/>
<path fill="${INK}" d="M96.2306 55.172C100.66 55.172 104.25 51.5817 104.25 47.1528C104.25 42.7239 100.66 39.1335 96.2306 39.1335C91.8018 39.1335 88.2114 42.7239 88.2114 47.1528C88.2114 51.5817 91.8018 55.172 96.2306 55.172Z"/>
<path stroke="${INK}" stroke-width="4.68" stroke-linecap="round" d="M64.5498 135.859L64.5498 161.6"/>
<path stroke="${INK}" stroke-width="4.68" stroke-linecap="round" d="M89.3008 135.859L89.3008 161.6"/>
</svg>`;
    return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** Satori takes a React element shape; this is the whole of it we need. */
const h = (
    type: string,
    style: Record<string, unknown>,
    children?: unknown,
) => ({ type, props: { style, children } });

/**
 * Cut long text rather than clamping lines in CSS: satori's line clamp needs
 * the text measured twice, and a card only has room for so many words anyway.
 */
function clamp(text: string, max: number): string {
    if (text.length <= max) return text;
    return `${text.slice(0, max - 1).replace(/[\s,;:–—-]+$/, "")}…`;
}

export interface OgCard {
    title: string;
    /** The line under the title. Usually the post's subtitle. */
    subtitle?: string;
    /** The small line above it — section, date, category. */
    meta?: string;
    /** The page the card stands for; decides which paper stock it prints on. */
    pathname: string;
}

export async function renderOgCard({
    title,
    subtitle,
    meta,
    pathname,
}: OgCard): Promise<Buffer> {
    const paper = getPaper(pathname);
    const clampedTitle = clamp(title, 90);

    /*
      Three steps rather than a formula: the card holds three comfortable lines
      at 68px, and dropping a step is what keeps a long title from touching the
      bird above it.
    */
    const titleSize =
        clampedTitle.length <= 34 ? 76 : clampedTitle.length <= 64 ? 68 : 56;

    const card = h(
        "div",
        {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: WIDTH,
            height: HEIGHT,
            padding: PADDING,
            backgroundColor: paper.hex,
            color: INK,
            fontFamily: "Apercu",
        },
        [
            {
                type: "img",
                props: {
                    src: birdDataUri(paper.hex),
                    width: 74,
                    height: 86,
                    style: { width: 74, height: 86 },
                },
            },
            h("div", { display: "flex", flexDirection: "column" }, [
                meta &&
                    h(
                        "div",
                        {
                            fontSize: 26,
                            color: INK_MUTED,
                            marginBottom: 20,
                            letterSpacing: "0.01em",
                        },
                        clamp(meta, 60),
                    ),
                h(
                    "div",
                    {
                        fontSize: titleSize,
                        fontWeight: 700,
                        lineHeight: 1.1,
                        letterSpacing: "-0.02em",
                        maxWidth: TITLE_WIDTH,
                    },
                    clampedTitle,
                ),
                subtitle &&
                    h(
                        "div",
                        {
                            fontSize: 32,
                            color: INK_MUTED,
                            lineHeight: 1.3,
                            marginTop: 18,
                        },
                        clamp(subtitle, 80),
                    ),
            ].filter(Boolean)),
        ],
    );

    const svg = await satori(card as never, {
        width: WIDTH,
        height: HEIGHT,
        fonts: await (fonts ??= loadFonts()),
    });

    return await sharp(Buffer.from(svg)).png().toBuffer();
}

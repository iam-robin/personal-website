/**
 * Per-section paper stock, plus the surface and inset derived from it.
 * Tinted stocks share L 91.5% and C 0.038 (the highest C that clears the whole
 * hue wheel in sRGB). Hexes because theme-color can't read CSS variables.
 */

/** Keep in sync with --color-ink. */
const INK = "#1a1919";

const SURFACE_WHITE = 0.42;
const INSET_INK = 0.1;
const WHITE = "#ffffff";

const srgbToLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const linearToSrgb = (c: number) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

/** hexToOklab reads fixed offsets, so short hexes would give NaN. */
export function normaliseHex(hex: string): string {
    const raw = hex.trim().replace(/^#/, "");
    const full =
        raw.length === 3
            ? raw
                  .split("")
                  .map((c) => c + c)
                  .join("")
            : raw;
    return `#${full.toLowerCase()}`;
}

export function hexToOklab(hex: string): [number, number, number] {
    const [r, g, b] = [1, 3, 5].map((i) =>
        srgbToLinear(parseInt(hex.slice(i, i + 2), 16) / 255),
    );
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    return [
        0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
        1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
        0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
    ];
}

/** Unclamped, so callers can tell in-gamut from not. */
function oklabToSrgb([L, a, b]: [number, number, number]): [
    number,
    number,
    number,
] {
    const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
    const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
    const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
    return [
        4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
    ].map(linearToSrgb) as [number, number, number];
}

function srgbToHex(rgb: [number, number, number]): string {
    return (
        "#" +
        rgb
            .map((c) =>
                Math.round(Math.min(1, Math.max(0, c)) * 255)
                    .toString(16)
                    .padStart(2, "0"),
            )
            .join("")
    );
}

function oklabToHex(lab: [number, number, number]): string {
    return srgbToHex(oklabToSrgb(lab));
}

/** Chroma-clamped, not channel-clamped, so the hue doesn't shift. */
export function oklchToHex(L: number, C: number, hue: number): string {
    const rad = (hue * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    for (let c = C; c > 0; c -= 0.003) {
        const rgb = oklabToSrgb([L, c * cos, c * sin]);
        if (rgb.every((v) => v >= -0.001 && v <= 1.001)) return srgbToHex(rgb);
    }

    return srgbToHex(oklabToSrgb([L, 0, 0]));
}

/**
 * Same as CSS color-mix(in oklab), computed here because Lightning CSS
 * constant-folds color-mix at build time.
 */
function mixOklab(hex: string, over: string, amount: number): string {
    const a = hexToOklab(hex);
    const b = hexToOklab(over);
    return oklabToHex([
        b[0] * amount + a[0] * (1 - amount),
        b[1] * amount + a[1] * (1 - amount),
        b[2] * amount + a[2] * (1 - amount),
    ]);
}

export interface Paper {
    hex: string;
    oklch: string;
    name: string;
}

export interface ResolvedPaper extends Paper {
    surface: string;
    inset: string;
    folderFront: string;
    folderBack: string;
}

function folderShades(hex: string): Pick<ResolvedPaper, "folderFront" | "folderBack"> {
    const [, a, b] = hexToOklab(hex);
    const hue = Math.atan2(b, a) * 180 / Math.PI;
    const chroma = Math.hypot(a, b) * 1.8;
    return {
        folderFront: oklchToHex(0.75, chroma, hue),
        folderBack: oklchToHex(0.68, chroma, hue),
    };
}

const stocks = {
    /** Neutral stock for home, 404, and pages whose content is colourful already. */
    home: { hex: "#eae8e3", oklch: "oklch(93.12% 0.007 88.6)", name: "Blank" },
    work: { hex: "#f2e0c8", oklch: "oklch(91.5% 0.038 75)", name: "Sand" },
    projects: { hex: "#fbdbd2", oklch: "oklch(91.5% 0.038 35)", name: "Clay" },
    blog: {
        hex: "#d7e3fd",
        oklch: "oklch(91.5% 0.038 265)",
        name: "Periwinkle",
    },
    /** One stock for the whole shelf family. */
    shelf: { hex: "#ebdcf6", oklch: "oklch(91.5% 0.038 310)", name: "Lilac" },

    meta: { hex: "#dbe4ed", oklch: "oklch(91.5% 0.016 250)", name: "Slate" },
} as const satisfies Record<string, Paper>;

export type PaperKey = keyof typeof stocks;

/** Adding a section means adding one hex; surface and inset follow. */
export const papers = Object.fromEntries(
    Object.entries(stocks).map(([key, stock]) => [
        key,
        {
            ...stock,
            surface: mixOklab(stock.hex, WHITE, SURFACE_WHITE),
            inset: mixOklab(stock.hex, INK, INSET_INK),
            ...folderShades(stock.hex),
        },
    ]),
) as Record<PaperKey, ResolvedPaper>;

const SECTIONS: Record<string, PaperKey> = {
    work: "work",
    projects: "projects",
    blog: "blog",

    shelf: "shelf",
    bookmarks: "shelf",
    music: "shelf",
    series: "shelf",
    movies: "shelf",

    changelog: "meta",
    colophon: "meta",
    legal: "meta",
};

/** Item pages here fall back to Blank; only the index gets the tint. */
const ARTICLE_SECTIONS = new Set(["blog", "projects"]);

/** Filtered index pages keep the section's stock. */
const INDEX_VARIANTS = new Set(["category", "tag", "country"]);

export function getPaperKey(pathname: string): PaperKey {
    // Trim both ends, or a leading empty segment sends every page home.
    const segments = pathname
        .replace(/^\/+|\/+$/g, "")
        .split("/")
        .filter(Boolean);
    const [section, second] = segments;

    if (
        segments.length > 1 &&
        ARTICLE_SECTIONS.has(section) &&
        !INDEX_VARIANTS.has(second)
    ) {
        return "home";
    }

    return SECTIONS[section] ?? "home";
}

export function getPaper(pathname: string): ResolvedPaper {
    return papers[getPaperKey(pathname)];
}

/**
 * Per-section paper stock. This file changes exactly one of the palette's
 * three tokens — the paper — per top-level section, and the surface, every
 * ink/NN wash, the code chip and the logo knockout follow it for free.
 *
 * The tinted stocks share oklch L 91.5% and C 0.038, differing only in hue, so
 * no section reads louder than another. Those numbers aren't free: chroma is
 * capped by the sRGB gamut, and L 91.5% is where C 0.041 first clears the
 * whole hue wheel — at the homepage's own L (93.12%) the ceiling is 0.033.
 *
 * Hexes rather than oklch() literals because <meta name="theme-color"> takes a
 * literal string and can't read a CSS variable.
 */

/** Kept in sync with --color-ink by hand; it is the one value that never moves. */
const INK = "#1a1919";

/** How much ink goes over the paper to make the card surface. See mixOklab. */
const SURFACE_INK = 0.1;

const srgbToLinear = (c: number) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
const linearToSrgb = (c: number) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;

function hexToOklab(hex: string): [number, number, number] {
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

/** The three sRGB channels, unclamped — so callers can tell in-gamut from not. */
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

/**
 * oklch → hex, chroma-clamped rather than channel-clamped. The requested C is
 * out of the sRGB gamut at many hues; clipping the channels there would shift
 * the hue and flatten the colour, so instead the chroma is walked down until
 * the whole triple fits. Same trick the stocks above were cut by hand with —
 * this just does it at runtime, for the postcard stamps.
 */
export function oklchToHex(L: number, C: number, hue: number): string {
    const rad = (hue * Math.PI) / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    for (let c = C; c > 0; c -= 0.003) {
        const rgb = oklabToSrgb([L, c * cos, c * sin]);
        // A hair of tolerance: the round-trip lands a touch outside on colours
        // that are, for our purposes, exactly on the boundary.
        if (rgb.every((v) => v >= -0.001 && v <= 1.001)) return srgbToHex(rgb);
    }

    return srgbToHex(oklabToSrgb([L, 0, 0]));
}

/**
 * The card surface: `amount` of ink over the stock, in oklab. Same result as
 * CSS `color-mix(in oklab, …)`, computed here because Lightning CSS
 * constant-folds that function at build time and would freeze every page's
 * surface at the default stock.
 *
 * 10% holds the paper→surface lightness step steady (0.072 blank, 0.070 on a
 * tint), so a card looks equally raised in every room.
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
    /** The oklch it was cut from, so the next one can be cut to match. */
    oklch: string;
    /** Shown on /colophon. */
    name: string;
}

export interface ResolvedPaper extends Paper {
    /** Cards, code chips, the world map's land — ink 10% over the stock. */
    surface: string;
}

const stocks = {
    /**
     * The neutral stock. Colour means you've gone somewhere, so the homepage
     * and /404 stay blank — and so do /garden and /postcards, whose content
     * already arrives full of colour of its own.
     */
    home: { hex: "#eae8e3", oklch: "oklch(93.12% 0.007 88.6)", name: "Blank" },

    work: { hex: "#f2e0c8", oklch: "oklch(91.5% 0.038 75)", name: "Sand" },
    projects: { hex: "#fbdbd2", oklch: "oklch(91.5% 0.038 35)", name: "Clay" },
    blog: { hex: "#d7e3fd", oklch: "oklch(91.5% 0.038 265)", name: "Periwinkle" },
    bookmarks: { hex: "#ebdcf6", oklch: "oklch(91.5% 0.038 310)", name: "Lilac" },
    shelf: { hex: "#c9ece4", oklch: "oklch(91.5% 0.038 180)", name: "Aqua" },

    /** Half chroma: the quietest room, and it keeps slate off periwinkle. */
    meta: { hex: "#dbe4ed", oklch: "oklch(91.5% 0.016 250)", name: "Slate" },
} as const satisfies Record<string, Paper>;

export type PaperKey = keyof typeof stocks;

/** Adding a section means adding one hex above — the surface follows. */
export const papers = Object.fromEntries(
    Object.entries(stocks).map(([key, stock]) => [
        key,
        { ...stock, surface: mixOklab(stock.hex, INK, SURFACE_INK) },
    ]),
) as Record<PaperKey, ResolvedPaper>;

/**
 * First URL segment → stock, which covers every nested route with no special
 * cases. The media logs share one stock: they're one shelf, not four sections.
 * `garden` and `postcards` are absent on purpose — see `home` above.
 */
const SECTIONS: Record<string, PaperKey> = {
    work: "work",
    projects: "projects",
    blog: "blog",
    bookmarks: "bookmarks",

    books: "shelf",
    movies: "shelf",
    music: "shelf",
    series: "shelf",

    changelog: "meta",
    colophon: "meta",
    legal: "meta",
};

export function getPaperKey(pathname: string): PaperKey {
    // Both ends: the same route arrives as "/work" or "/work/", and a leading
    // empty segment would send every page to `home`.
    const segment = pathname.replace(/^\/+|\/+$/g, "").split("/")[0];

    return SECTIONS[segment] ?? "home";
}

export function getPaper(pathname: string): ResolvedPaper {
    return papers[getPaperKey(pathname)];
}

import colors from "../styles/theme/colors.css?raw";
import typography from "../styles/theme/typography.css?raw";
import layout from "../styles/theme/layout.css?raw";
import shadows from "../styles/theme/shadows.css?raw";
import transitions from "../styles/theme/transitions.css?raw";

export interface DesignToken {
    name: string;
    value: string;
    /** Earlier declarations, e.g. the vi fallback before the cqi type scale. */
    fallbacks: string[];
    source: string;
}

/** Build-time catalogue of our flat @theme blocks, not a second token set.
 * Only @theme declarations belong here: body overrides and @font-face have
 * different jobs. Wildcard resets such as --text-*: initial are not tokens.
 * This deliberately reads our known CSS format, not arbitrary CSS syntax.
 */
function readTheme(css: string, source: string): DesignToken[] {
    const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
    const tokens = new Map<string, DesignToken>();
    for (const block of clean.matchAll(/@theme(?:\s+[\w-]+)*\s*\{([^}]*)\}/g)) {
        for (const declaration of block[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
            const [, name, raw] = declaration;
            const value = raw.trim().replace(/\s+/g, " ");
            const previous = tokens.get(name);
            tokens.set(name, {
                name,
                value,
                fallbacks: previous ? [...previous.fallbacks, previous.value] : [],
                source,
            });
        }
    }
    if (!tokens.size) throw new Error(`No theme tokens found in ${source}`);
    return [...tokens.values()];
}

export const tokenSources = [
    { name: "Colours", path: "src/styles/theme/colors.css", css: colors },
    { name: "Typography", path: "src/styles/theme/typography.css", css: typography },
    { name: "Layout", path: "src/styles/theme/layout.css", css: layout },
    { name: "Shadows", path: "src/styles/theme/shadows.css", css: shadows },
    { name: "Motion", path: "src/styles/theme/transitions.css", css: transitions },
].map((source) => ({ ...source, tokens: readTheme(source.css, source.path) }));

export const fontFaces = [...typography.replace(/\/\*[\s\S]*?\*\//g, "").matchAll(/@font-face\s*\{([^}]*)\}/g)].map(([, block]) => {
    const family = block.match(/font-family:\s*["']([^"']+)["']/)?.[1] ?? "";
    const weight = block.match(/font-weight:\s*([^;]+);/)?.[1].trim() ?? "normal";
    return { family, weight: weight === "normal" ? "400" : weight === "bold" ? "700" : weight };
});

export function loadedWeights(token: DesignToken): string {
    const family = token.value.match(/^["']([^"']+)["']/)?.[1];
    return [...new Set(fontFaces.filter((face) => face.family === family).map((face) => face.weight))].join(" · ");
}

export const designTokens = tokenSources.flatMap((source) => source.tokens);
export const paletteTokens = designTokens.filter((t) => t.name.startsWith("--color-"));
export const fontTokens = designTokens.filter((t) => t.name.startsWith("--font-"));
export const typeTokens = designTokens.filter((t) => /^--text-[\w]+$/.test(t.name));
export const leadingTokens = designTokens.filter((t) => t.name.startsWith("--leading-"));
export const spacingTokens = designTokens.filter((t) => t.name.startsWith("--spacing-"));
export const containerTokens = designTokens.filter((t) => t.name.startsWith("--container-"));
export const shadowTokens = designTokens.filter((t) => t.name.startsWith("--shadow-"));
export const easingTokens = designTokens.filter((t) => t.name.startsWith("--ease-"));

/** Scoped to the specimens so Tailwind cannot prune a token that is only
 * referenced by dynamic markup. The values still come straight from source.
 * Colour defaults are excluded: Layout's per-page paper overrides stay live.
 */
export const specimenTokens = designTokens
    .filter((t) => !t.name.startsWith("--color-"))
    .map((t) => `${t.name}:${t.value}`)
    .join(";");

export function easingPath(value: string): string {
    // Our three spring curves use explicit value/percentage stops.
    return [...value.matchAll(/(-?\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)%/g)]
        .map(([, progress, percentage], index) => {
            const x = 12 + Number(percentage) * 2.96;
            const y = 106 - Number(progress) * 72;
            return `${index ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
        })
        .join(" ");
}

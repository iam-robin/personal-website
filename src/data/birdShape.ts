/**
 * The robin, as data — so the logo (Bird.astro) and the postcard stamp
 * (utils/stamps/birdStamp.ts) draw the same bird from one source.
 *
 * The angry mood is deliberately absent: its brows are cut with a <mask id>,
 * and the stamp generator must emit id-free markup because a postcards page
 * renders dozens of stamps at once. It stays inline in Bird.astro.
 */

export const BIRD_VIEWBOX = { w: 139, h: 162 } as const;

export interface BirdPart {
    d: string;
    /**
     * The eye white is the one part painted in the background colour rather
     * than the bird's — which is what makes the eye read as a ring in every
     * mood and every colourway.
     */
    role: "ink" | "void";
    /** Stroked instead of filled (legs, the shut eye, the jump marks). */
    strokeWidth?: number;
    /** Hooks Bird.astro's hover animation. Stamps drop it. */
    class?: string;
}

export interface BirdMood {
    parts: readonly BirdPart[];
    /** Aligned on the resting bird's body centre — the framing stamps use. */
    transform?: string;
    /** What Bird.astro emits. Same as `transform`, except the happy bird hops. */
    logoTransform?: string;
    /** Extent of the drawn bird after `transform`, for the portrait framing. */
    bbox: { x: number; y: number; w: number; h: number };
    /**
     * The close-up framing. Each is wider than it needs to be on the right so
     * the beak — which ends at x≈139 — is never clipped, and `smitten` reaches
     * above y=0 so the heart survives.
     */
    closeup: { x: number; y: number; w: number; h: number };
}

export type BirdMoodKey = "resting" | "happy" | "smitten";

export const BIRD_MOODS: Record<BirdMoodKey, BirdMood> = {
    resting: {
        bbox: { x: 0, y: 20.4, w: 139, h: 141.2 },
        closeup: { x: 50, y: 8, w: 96, h: 96 },
        parts: [
            {
                role: "ink",
                class: "bird-tail",
                d: "M32.0769 105.96L0 138.037L16.0384 148.73L53.4615 120.217L32.0769 105.96Z",
            },
            {
                role: "ink",
                d: "M71.282 143.384C99.8238 143.384 122.961 120.246 122.961 91.7041C122.961 63.1623 99.8238 40.0247 71.282 40.0247C42.7402 40.0247 19.6025 63.1623 19.6025 91.7041C19.6025 120.246 42.7402 143.384 71.282 143.384Z",
            },
            {
                role: "ink",
                d: "M90.8845 84.5759C108.6 84.5759 122.961 70.2146 122.961 52.499C122.961 34.7834 108.6 20.4221 90.8845 20.4221C73.1689 20.4221 58.8076 34.7834 58.8076 52.499C58.8076 70.2146 73.1689 84.5759 90.8845 84.5759Z",
            },
            {
                role: "ink",
                d: "M80.1926 102.396C100.861 102.396 117.616 88.0349 117.616 70.3193C117.616 52.6037 100.861 38.2424 80.1926 38.2424C59.5244 38.2424 42.7695 52.6037 42.7695 70.3193C42.7695 88.0349 59.5244 102.396 80.1926 102.396Z",
            },
            {
                role: "ink",
                d: "M119.397 43.1926L139 53.39L119.397 63.5873V43.1926Z",
            },
            {
                role: "void",
                d: "M96.2307 64.9733C106.073 64.9733 114.051 56.9948 114.051 47.1528C114.051 37.3108 106.073 29.3323 96.2307 29.3323C86.3887 29.3323 78.4102 37.3108 78.4102 47.1528C78.4102 56.9948 86.3887 64.9733 96.2307 64.9733Z",
            },
            {
                role: "ink",
                class: "bird-pupil",
                d: "M96.2306 55.172C100.66 55.172 104.25 51.5817 104.25 47.1528C104.25 42.7239 100.66 39.1335 96.2306 39.1335C91.8018 39.1335 88.2114 42.7239 88.2114 47.1528C88.2114 51.5817 91.8018 55.172 96.2306 55.172Z",
            },
            {
                role: "ink",
                strokeWidth: 4.68,
                d: "M64.5498 135.859L64.5498 161.6",
            },
            {
                role: "ink",
                strokeWidth: 4.68,
                d: "M89.3008 135.859L89.3008 161.6",
            },
        ],
    },

    /**
     * The export is drawn ~5% smaller than the resting state; the scale matches
     * the two body sizes. `transform` aligns on the body centre; the logo adds
     * a jump offset (+12 right, −20 up) on top, so the bird looks like it hops
     * up and to the right when clicked. A stamp wants it standing still.
     */
    happy: {
        transform: "translate(-10.01 2.6) scale(1.0539)",
        logoTransform: "translate(1.99 -17.4) scale(1.0539)",
        bbox: { x: -7, y: 2.6, w: 144, h: 155 },
        closeup: { x: 50, y: 0, w: 96, h: 96 },
        parts: [
            {
                role: "ink",
                d: "M47.1408 78.2916L2.86354 54.477L11.485 40.1284L64.375 63.5384L47.1408 78.2916Z",
            },
            {
                role: "ink",
                d: "M77.1306 133.585C104.213 133.585 126.168 111.63 126.168 84.5474C126.168 57.4648 104.213 35.51 77.1306 35.51C50.048 35.51 28.0933 57.4648 28.0933 84.5474C28.0933 111.63 50.048 133.585 77.1306 133.585Z",
            },
            {
                role: "ink",
                d: "M95.7304 76.0924C111.606 76.0924 124.476 63.2224 124.476 47.3464C124.476 31.4704 111.606 18.6003 95.7304 18.6003C79.8544 18.6003 66.9844 31.4704 66.9844 47.3464C66.9844 63.2224 79.8544 76.0924 95.7304 76.0924Z",
            },
            {
                role: "ink",
                d: "M120.955 45.291L139.38 52.5409L117.184 54.8758L120.955 45.291Z",
            },
            {
                role: "ink",
                d: "M116.386 40.0713L138.684 39.0914L121.536 48.9914L116.386 40.0713Z",
            },
            {
                role: "ink",
                d: "M85.585 93.0021C105.197 93.0021 121.095 80.1321 121.095 64.2561C121.095 48.3801 105.197 35.51 85.585 35.51C65.9735 35.51 50.0752 48.3801 50.0752 64.2561C50.0752 80.1321 65.9735 93.0021 85.585 93.0021Z",
            },
            {
                role: "void",
                d: "M99.3862 61.1714C109.88 61.1714 118.386 52.6648 118.386 42.1714C118.386 31.678 109.88 23.1714 99.3862 23.1714C88.8928 23.1714 80.3862 31.678 80.3862 42.1714C80.3862 52.6648 88.8928 61.1714 99.3862 61.1714Z",
            },
            {
                role: "ink",
                d: "M100.804 52.4193C106.407 52.4193 110.95 47.8769 110.95 42.2736C110.95 36.6703 106.407 32.1279 100.804 32.1279C95.2006 32.1279 90.6582 36.6703 90.6582 42.2736C90.6582 47.8769 95.2006 52.4193 100.804 52.4193Z",
            },
            {
                role: "ink",
                d: "M69.3307 128.198C69.9064 126.969 71.307 126.47 72.4584 127.084C73.6097 127.698 74.0774 129.193 73.5021 130.422L66.3291 145.736C65.7535 146.965 64.3529 147.464 63.2015 146.85C62.0501 146.235 61.5825 144.74 62.1577 143.511L69.3307 128.198Z",
            },
            {
                role: "ink",
                d: "M93.0045 126.621C93.5802 125.29 94.9808 124.749 96.1322 125.414C97.2836 126.08 97.7512 127.7 97.176 129.031L90.003 145.621C89.4273 146.952 88.0267 147.493 86.8753 146.828C85.7239 146.162 85.2563 144.542 85.8316 143.211L93.0045 126.621Z",
            },
            {
                role: "ink",
                strokeWidth: 4,
                d: "M82.2032 11.8368L78.8213 1.69116",
            },
            {
                role: "ink",
                strokeWidth: 4,
                d: "M100.804 10.1457L102.495 0",
            },
            {
                role: "ink",
                strokeWidth: 4,
                d: "M117.713 16.9096L124.477 8.45483",
            },
        ],
    },

    /**
     * Easter egg: the bird has just eaten a crumb (see BirdFeeder). Eyes shut,
     * heart overhead. Drawn larger than the resting state; the scale matches
     * the two body radii and the translate aligns on the body centre, which
     * also lands the feet on the same baseline.
     */
    smitten: {
        transform: "translate(-1.78 0.88) scale(0.69611)",
        bbox: { x: -1.8, y: 0.9, w: 140.8, h: 160.3 },
        closeup: { x: 48, y: -10, w: 100, h: 100 },
        parts: [
            {
                role: "ink",
                d: "M56.32 115.12L0 63.92L17.92 46L87.04 99.76L56.32 115.12Z",
            },
            {
                role: "ink",
                d: "M104.96 204.72C145.961 204.72 179.2 171.482 179.2 130.48C179.2 89.4784 145.961 56.24 104.96 56.24C63.9581 56.24 30.7197 89.4784 30.7197 130.48C30.7197 171.482 63.9581 204.72 104.96 204.72Z",
            },
            {
                role: "ink",
                d: "M133.12 117.68C157.155 117.68 176.64 98.1956 176.64 74.1601C176.64 50.1247 157.155 30.6401 133.12 30.6401C109.084 30.6401 89.5996 50.1247 89.5996 74.1601C89.5996 98.1956 109.084 117.68 133.12 117.68Z",
            },
            {
                role: "ink",
                d: "M117.76 143.28C147.451 143.28 171.52 123.795 171.52 99.76C171.52 75.7246 147.451 56.24 117.76 56.24C88.0692 56.24 64 75.7246 64 99.76C64 123.795 88.0692 143.28 117.76 143.28Z",
            },
            {
                role: "ink",
                d: "M174.08 69.04L202.24 75.44L174.08 81.84V69.04Z",
            },
            {
                role: "void",
                d: "M140.8 92.0801C154.939 92.0801 166.4 80.6186 166.4 66.4801C166.4 52.3416 154.939 40.8801 140.8 40.8801C126.662 40.8801 115.2 52.3416 115.2 66.4801C115.2 80.6186 126.662 92.0801 140.8 92.0801Z",
            },
            {
                role: "ink",
                strokeWidth: 7.168,
                d: "M125.44 61.3601C135.68 75.0134 145.92 75.0134 156.16 61.3601",
            },
            {
                role: "ink",
                strokeWidth: 6.656,
                d: "M94.7197 202.16V230.32",
            },
            {
                role: "ink",
                strokeWidth: 6.656,
                d: "M130.56 202.16V230.32",
            },
            {
                role: "ink",
                d: "M169.76 20.48C175.415 20.48 180 15.8954 180 10.24C180 4.5846 175.415 0 169.76 0C164.104 0 159.52 4.5846 159.52 10.24C159.52 15.8954 164.104 20.48 169.76 20.48Z",
            },
            {
                role: "ink",
                d: "M190.239 20.48C195.894 20.48 200.479 15.8954 200.479 10.24C200.479 4.5846 195.894 0 190.239 0C184.584 0 179.999 4.5846 179.999 10.24C179.999 15.8954 184.584 20.48 190.239 20.48Z",
            },
            {
                role: "ink",
                d: "M159.52 12.8H200.48L180 40.96L159.52 12.8Z",
            },
        ],
    },
};

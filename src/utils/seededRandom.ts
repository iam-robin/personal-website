/**
 * A deterministic PRNG seeded from a string — FNV-1a seed, mulberry32 stream.
 *
 * Hand-placed values (a postcard's lean, its offsets) want to look random but
 * must survive a rebuild in the same spot, which `Math.random()` wouldn't.
 * Seed from the item's stable identity instead.
 */
export function createSeededRandom(seedSource: string): () => number {
    let seed = 2166136261;
    for (let i = 0; i < seedSource.length; i++) {
        seed = Math.imul(seed ^ seedSource.charCodeAt(i), 16777619);
    }
    return () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

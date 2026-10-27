/**
 * Deterministic PRNG from a string (FNV-1a seed, mulberry32), so "random"
 * layouts survive a rebuild.
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

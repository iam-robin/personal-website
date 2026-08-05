import type { ImageMetadata } from "astro";

// Fan images shown for a project on hover — stacked in the homepage hero,
// cursor-following on /projects. Poster filenames are number-prefixed to
// control the fan order.
const posterModules = import.meta.glob<{ default: ImageMetadata }>(
    "../assets/projects/matchprint/*.png",
    { eager: true },
);
const matchprintPosters = Object.keys(posterModules)
    .sort()
    .map((key) => posterModules[key].default);

// A hand-picked set of prints, in fan order.
const FAN_PHOTO_IDS = ["12", "11", "10", "02", "03"];
const photoModules = import.meta.glob<{ default: ImageMetadata }>(
    "../assets/photos/*.{jpg,jpeg,png}",
    { eager: true },
);
const fanPhotos = FAN_PHOTO_IDS.map(
    (id) => photoModules[`../assets/photos/${id}.jpg`].default,
);

// handcoded.art has the project id "geeenerated".
const artModules = import.meta.glob<{ default: ImageMetadata }>(
    "../assets/projects/handcoded/*.webp",
    { eager: true },
);
const handcodedArt = Object.keys(artModules)
    .sort()
    .map((key) => artModules[key].default);

const fansByProject: Record<string, ImageMetadata[]> = {
    matchprint: matchprintPosters,
    "robins-photos": fanPhotos,
    geeenerated: handcodedArt,
};

export function getFanImages(projectId: string): ImageMetadata[] | null {
    return fansByProject[projectId] ?? null;
}

// Fallback for projects without a curated fan: the first image in the
// project's markdown body. Gifs are excluded — the image pipeline would
// strip their animation.
const projectAssetModules = import.meta.glob<{ default: ImageMetadata }>(
    "../assets/projects/**/*.{png,jpg,jpeg,webp}",
    { eager: true },
);

export function getFirstBodyImage(
    body: string | undefined,
): ImageMetadata | null {
    if (!body) return null;
    // Markdown paths are relative to src/content/projects/, glob keys to
    // src/utils/ — both resolve to src/assets/….
    const matches = body.matchAll(/!\[[^\]]*\]\((\.\.\/\.\.\/assets\/[^)\s]+)\)/g);
    for (const match of matches) {
        const key = match[1].replace(/^\.\.\/\.\.\//, "../");
        const image = projectAssetModules[key]?.default;
        if (image) return image;
    }
    return null;
}

import type { ImageMetadata } from "astro";

// The fan prints, in fan order. Imported one by one on purpose: an eager glob
// over the folder emits *every* photo into the build, including the seven no
// page renders — ~74MB of untouched camera JPEGs in dist/.
import photo12 from "../assets/photos/12.jpg";
import photo11 from "../assets/photos/11.jpg";
import photo10 from "../assets/photos/10.jpg";
import photo02 from "../assets/photos/02.jpg";
import photo03 from "../assets/photos/03.jpg";

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

const fanPhotos = [photo12, photo11, photo10, photo02, photo03];

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

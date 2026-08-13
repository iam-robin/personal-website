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

// The 365 folder holds nothing but its fan, so an eager glob is safe here —
// unlike ../assets/photos, where most of the folder never renders.
const dailyModules = import.meta.glob<{ default: ImageMetadata }>(
    "../assets/projects/365/*.{jpg,jpeg,webp}",
    { eager: true },
);
const dailyPhotos = Object.keys(dailyModules)
    .sort()
    .map((key) => dailyModules[key].default);

const fansByProject: Record<string, ImageMetadata[]> = {
    matchprint: matchprintPosters,
    "robins-photos": fanPhotos,
    geeenerated: handcodedArt,
    "365": dailyPhotos,
};

/** Photo fans print square; drawn and rendered work keeps a slight rounding. */
export const isPhotoFan = (projectId: string): boolean =>
    projectId === "robins-photos" || projectId === "365";

export function getFanImages(projectId: string): ImageMetadata[] | null {
    // An empty array would still read as "has a fan" and render a bare box —
    // the glob-backed fans are empty until their folder is filled.
    const fan = fansByProject[projectId];
    return fan?.length ? fan : null;
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

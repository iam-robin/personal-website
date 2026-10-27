import type { ImageMetadata } from "astro";

// Imported one by one: an eager glob would emit every photo in the folder
// (~74MB) into the build.
import photo12 from "../assets/photos/12.jpg";
import photo11 from "../assets/photos/11.jpg";
import photo10 from "../assets/photos/10.jpg";
import photo02 from "../assets/photos/02.jpg";
import photo03 from "../assets/photos/03.jpg";
import canvasFlowerField from "../assets/projects/one-canvas-many-hands/01-flower-field-framed.webp";
import canvasBirchForest from "../assets/projects/one-canvas-many-hands/04-birch-forest-framed.webp";
import canvasWaterLilies from "../assets/projects/one-canvas-many-hands/05-water-lilies-framed.webp";

// Poster filenames are number-prefixed to set the fan order.
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

// This folder holds only the fan, so an eager glob is fine.
const dailyModules = import.meta.glob<{ default: ImageMetadata }>(
    "../assets/projects/365/*.{jpg,jpeg,webp}",
    { eager: true },
);
const dailyPhotos = Object.keys(dailyModules)
    .sort()
    .map((key) => dailyModules[key].default);

const fansByProject: Record<string, ImageMetadata[]> = {
    "one-canvas-many-hands": [
        canvasBirchForest,
        canvasFlowerField,
        canvasWaterLilies,
    ],
    matchprint: matchprintPosters,
    "robins-photos": fanPhotos,
    geeenerated: handcodedArt,
    "365": dailyPhotos,
};

export function getFanImages(projectId: string): ImageMetadata[] | null {
    // Empty globbed fans would still render a bare box.
    const fan = fansByProject[projectId];
    return fan?.length ? fan : null;
}

// Fallback: the first image in the project's markdown. No gifs, the image
// pipeline would strip their animation.
const projectAssetModules = import.meta.glob<{ default: ImageMetadata }>(
    "../assets/projects/**/*.{png,jpg,jpeg,webp}",
    { eager: true },
);

export function getFirstBodyImage(
    body: string | undefined,
): ImageMetadata | null {
    if (!body) return null;
    const matches = body.matchAll(/!\[[^\]]*\]\((\.\.\/\.\.\/assets\/[^)\s]+)\)/g);
    for (const match of matches) {
        const key = match[1].replace(/^\.\.\/\.\.\//, "../");
        const image = projectAssetModules[key]?.default;
        if (image) return image;
    }
    return null;
}

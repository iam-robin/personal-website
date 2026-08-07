import {
    BIRD_MOODS,
    type BirdMoodKey,
    type BirdPart,
} from "../../data/birdShape";
import { oklchToHex } from "../paper";

/** Matches the p5 shapes stamp's canvas, so both drop into the same box. */
const FRAME = 132;

const BIRD_TONE = { l: 0.46, c: 0.19 };
const GROUND_TONE = { l: 0.84, c: 0.13 };
const GROUND_TONE_PALE = { l: 0.9, c: 0.08 };
const PALE_GROUND_CHANCE = 0.45;

const MOODS: BirdMoodKey[] = ["resting", "resting", "happy", "smitten"];

type Layout = "portrait" | "closeup" | "tile22" | "tile21" | "tile12";
const LAYOUTS: Layout[] = [
    "portrait",
    "portrait",
    "closeup",
    "closeup",
    "tile22",
    "tile21",
    "tile12",
];

interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
}

const pick = <T>(items: readonly T[]): T =>
    items[Math.floor(Math.random() * items.length)];

const between = (min: number, max: number) => min + Math.random() * (max - min);

const n = (value: number) => Number(value.toFixed(3)).toString();

function paint(
    parts: readonly BirdPart[],
    transform: string | undefined,
    ink: string,
    ground: string,
): string {
    const paths = parts
        .map((part) =>
            part.strokeWidth
                ? `<path d="${part.d}" fill="none" stroke="${ink}" stroke-width="${part.strokeWidth}" stroke-linecap="round"/>`
                : `<path d="${part.d}" fill="${part.role === "void" ? ground : ink}"/>`,
        )
        .join("");

    return transform ? `<g transform="${transform}">${paths}</g>` : paths;
}

/** Map a window in the bird's 139×162 space onto a box in stamp space. */
function fit(win: Box, box: Box): string {
    const scale = Math.min(box.w / win.w, box.h / win.h);
    const x = box.x + (box.w - win.w * scale) / 2 - win.x * scale;
    const y = box.y + (box.h - win.h * scale) / 2 - win.y * scale;
    return `translate(${n(x)} ${n(y)}) scale(${n(scale)})`;
}

/** The whole bird, centred, with air around it and a slight tilt. */
function portrait(bird: string, box: Box): string {
    const side = Math.max(box.w, box.h) / between(0.62, 0.8);
    const win = {
        x: box.x + box.w / 2 - side / 2 + between(-5, 5),
        y: box.y + box.h / 2 - side / 2 + between(-5, 5),
        w: side,
        h: side,
    };
    const tilt = n(between(-4, 4));
    const half = FRAME / 2;

    return `<g transform="rotate(${tilt} ${half} ${half})"><g transform="${fit(win, { x: 0, y: 0, w: FRAME, h: FRAME })}">${bird}</g></g>`;
}

/**
 * Head-and-shoulders, body and tail running off the left and bottom. The beak
 * must never go with them, so the jitter only slides the window right or grows
 * it — moving left or tightening would pull the right edge in past x≈139.
 */
function closeup(bird: string, window: Box): string {
    const grow = between(1, 1.08);
    const win = {
        x: window.x + between(0, 5),
        y: window.y + between(-4, 4),
        w: window.w * grow,
        h: window.h * grow,
    };

    return `<g transform="${fit(win, { x: 0, y: 0, w: FRAME, h: FRAME })}">${bird}</g>`;
}

/** A grid of birds, flipped on alternating columns and rows. */
function tiled(bird: string, box: Box, cols: number, rows: number): string {
    const cellW = FRAME / cols;
    const cellH = FRAME / rows;
    const side = Math.max(box.w, box.h) / 0.84;
    const win = {
        x: box.x + box.w / 2 - side / 2,
        y: box.y + box.h / 2 - side / 2,
        w: side,
        h: side,
    };
    const cell = `<g transform="${fit(win, { x: 0, y: 0, w: cellW, h: cellH })}">${bird}</g>`;

    let out = "";
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Flipped cells are placed off their far edge, so the mirrored copy
            // lands back inside its own cell.
            const flipX = col % 2 === 1;
            const flipY = row % 2 === 1;
            const x = (flipX ? col + 1 : col) * cellW;
            const y = (flipY ? row + 1 : row) * cellH;
            // The first cell needs no placing at all — skip the identity
            // wrapper rather than storing it on every postcard forever.
            out +=
                !flipX && !flipY && x === 0 && y === 0
                    ? cell
                    : `<g transform="translate(${n(x)} ${n(y)}) scale(${flipX ? -1 : 1} ${flipY ? -1 : 1})">${cell}</g>`;
        }
    }
    return out;
}

export function generateBirdStamp(): string {
    const hue = Math.random() * 360;
    const ink = oklchToHex(BIRD_TONE.l, BIRD_TONE.c, hue);
    const groundTone =
        Math.random() < PALE_GROUND_CHANCE ? GROUND_TONE_PALE : GROUND_TONE;
    const ground = oklchToHex(groundTone.l, groundTone.c, hue);

    const moodKey = pick(MOODS);
    const mood = BIRD_MOODS[moodKey];
    const bird = paint(mood.parts, mood.transform, ink, ground);
    const layout = pick(LAYOUTS);

    let art: string;
    switch (layout) {
        case "closeup":
            art = closeup(bird, mood.closeup);
            break;
        case "tile22":
            art = tiled(bird, mood.bbox, 2, 2);
            break;
        case "tile21":
            art = tiled(bird, mood.bbox, 2, 1);
            break;
        case "tile12":
            art = tiled(bird, mood.bbox, 1, 2);
            break;
        default:
            art = portrait(bird, mood.bbox);
    }

    // The 2×2 is already symmetric on both axes, so flipping it changes nothing.
    const body =
        layout !== "tile22" && Math.random() < 0.3
            ? `<g transform="translate(${FRAME} 0) scale(-1 1)">${art}</g>`
            : art;

    return (
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${FRAME} ${FRAME}" width="${FRAME}" height="${FRAME}">` +
        `<rect x="0" y="0" width="${FRAME}" height="${FRAME}" fill="${ground}"/>` +
        body +
        `</svg>`
    );
}

/** Bakes the robin onto the home paper: transparent PNG icons render on black on iOS. */
import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = new URL("..", import.meta.url).pathname;
const PUBLIC = join(ROOT, "public");

const { default: sharp } = await import(
    pathToFileURL(join(ROOT, "node_modules/sharp/dist/index.mjs")).href
);

const PAPER = "#eae8e3"; // stocks.home in src/utils/paper.ts
const INK = "#1a1919"; // --color-ink

// Bird paths from favicon.svg. The padded viewBox leaves ~15% margin for iOS's mask.
const bird = readFileSync(join(PUBLIC, "favicon.svg"), "utf8")
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<style>[\s\S]*?<\/style>/, "")
    .replace(/<\/svg>\s*$/, "")
    .trim();

const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-30 -10 200 200">
  <rect x="-30" y="-10" width="200" height="200" fill="${PAPER}" />
  <g fill="${INK}" stroke="${INK}">
    ${bird}
  </g>
  <style>
    .eye { fill: ${PAPER}; }
    .leg { stroke: ${INK}; }
  </style>
</svg>`;

const render = (size) =>
    sharp(Buffer.from(icon), { density: 384 })
        .resize(size, size)
        .png({ compressionLevel: 9 })
        .toBuffer();

const targets = [
    ["android-chrome-512x512.png", 512],
    ["android-chrome-192x192.png", 192],
    ["apple-touch-icon.png", 180],
    ["favicon-32x32.png", 32],
    ["favicon-16x16.png", 16],
];

for (const [name, size] of targets) {
    writeFileSync(join(PUBLIC, name), await render(size));
    console.log(`${name} (${size}x${size})`);
}

/** PNG payloads in an ICO container, 16 and 32px. */
const entries = await Promise.all([16, 32].map(async (s) => ({ s, png: await render(s) })));

const HEADER = 6;
const ENTRY = 16;
let offset = HEADER + ENTRY * entries.length;

const dir = Buffer.alloc(HEADER);
dir.writeUInt16LE(0, 0); // reserved
dir.writeUInt16LE(1, 2); // type: icon
dir.writeUInt16LE(entries.length, 4);

const table = [];
for (const { s, png } of entries) {
    const e = Buffer.alloc(ENTRY);
    e.writeUInt8(s, 0); // width
    e.writeUInt8(s, 1); // height
    e.writeUInt8(0, 2); // palette size (0 = truecolour)
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    table.push(e);
}

writeFileSync(
    join(PUBLIC, "favicon.ico"),
    Buffer.concat([dir, ...table, ...entries.map((e) => e.png)]),
);
console.log("favicon.ico (16 + 32)");

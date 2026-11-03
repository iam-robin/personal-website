#!/usr/bin/env node
/*
 * Screenshots of the running dev server, for checking visual changes by eye.
 *
 *   npm run shots -- <path> [<path> …] [options]
 *
 *   npm run shots -- /
 *   npm run shots -- / --full --widths=1440,420
 *   npm run shots -- /lab/project-cards --each=.direction --selector=.stage
 *   npm run shots -- /work --hover=".some-card"
 *
 * Options
 *   --widths=1440,820,390  Viewport widths: desktop, tablet, phone (default)
 *   --height=900           Viewport height
 *   --full                 Capture the full page instead of the viewport
 *   --selector=<css>       Capture only this element (the first match)
 *   --each=<css>           One shot per match; with --selector, captures the
 *                          --selector element inside each match
 *   --hover=<css>          Hover this element before capturing
 *   --dark                 Emulate prefers-color-scheme: dark
 *   --wait=<ms>            Extra wait after load, for animations (default 300)
 *   --port=<n>             Dev server port (default: first of 4321–4325 that answers)
 *   --out=<dir>            Output directory (default /tmp/shots)
 *
 * Chromium runs with --single-process: the nono sandbox denies the Mach
 * service its normal multi-process start registers. Don't remove the flag.
 *
 * Uses Playwright's own headless shell if it's installed, otherwise the
 * newest one in ~/Library/Caches/ms-playwright
 * (`npx playwright-core install chromium-headless-shell` for the exact one).
 */

import { existsSync, mkdirSync, readdirSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import { chromium } from "playwright-core";

const args = process.argv.slice(2);
const paths = args.filter((arg) => !arg.startsWith("--"));
const flags = Object.fromEntries(
    args
        .filter((arg) => arg.startsWith("--"))
        .map((arg) => {
            const [key, ...value] = arg.slice(2).split("=");
            return [key, value.length ? value.join("=") : true];
        }),
);

if (paths.length === 0 || flags.help) {
    console.log("Usage: npm run shots -- <path> [<path> …] [--full] [--widths=1440,820,390]");
    console.log("Options are documented at the top of scripts/shots.mjs");
    process.exit(paths.length === 0 && !flags.help ? 1 : 0);
}

const widths = String(flags.widths ?? "1440,820,390")
    .split(",")
    .map(Number)
    .filter(Boolean);
const height = Number(flags.height ?? 900);
const wait = Number(flags.wait ?? 300);
const outDir = String(flags.out ?? "/tmp/shots");

async function findServer() {
    const ports = flags.port ? [Number(flags.port)] : [4321, 4322, 4323, 4324, 4325];
    for (const port of ports) {
        try {
            const response = await fetch(`http://localhost:${port}/`, {
                signal: AbortSignal.timeout(3000),
            });
            if (response.ok || response.status < 500) return `http://localhost:${port}`;
        } catch {
            // Nothing on this port; try the next one.
        }
    }
    throw new Error(
        `No dev server on ${ports.join(", ")}. Start one with \`astro dev --background\`.`,
    );
}

function findBrowser() {
    const exact = chromium.executablePath();
    if (existsSync(exact)) return exact;

    const cache = join(homedir(), "Library/Caches/ms-playwright");
    if (!existsSync(cache)) return undefined;

    const shells = readdirSync(cache)
        .filter((dir) => dir.startsWith("chromium_headless_shell-"))
        .sort((a, b) => Number(b.split("-").pop()) - Number(a.split("-").pop()));

    for (const dir of shells) {
        const root = join(cache, dir);
        const platformDir = readdirSync(root).find((d) => d.startsWith("chrome-headless-shell"));
        const binary = platformDir && join(root, platformDir, "chrome-headless-shell");
        if (binary && existsSync(binary)) return binary;
    }
    return undefined;
}

const slug = (value) =>
    value.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9]+/gi, "-") || "home";

const base = await findServer();
const executablePath = findBrowser();
if (!executablePath) {
    console.error("No Chromium found. Run `npx playwright-core install chromium-headless-shell`.");
    process.exit(1);
}

mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
    executablePath,
    args: ["--single-process"],
});

/* --single-process can't survive closing a page or context: one page,
   resized for each width. */
const page = await browser.newPage({
    viewport: { width: widths[0], height },
    deviceScaleFactor: 2,
    colorScheme: flags.dark ? "dark" : "light",
    reducedMotion: "no-preference",
});

const written = [];

try {
    for (const path of paths) {
        for (const width of widths) {
            await page.setViewportSize({ width, height });
            await page.goto(new URL(path, base).href, { waitUntil: "networkidle" });
            await page.evaluate(() => document.fonts.ready);

            if (flags.hover) {
                await page.hover(String(flags.hover));
            }
            await page.waitForTimeout(wait);

            const name = `${slug(path)}${flags.dark ? "-dark" : ""}-${width}`;

            if (flags.each) {
                const items = page.locator(String(flags.each));
                const count = await items.count();
                if (count === 0) console.warn(`No match for --each=${flags.each} on ${path}`);

                for (let i = 0; i < count; i++) {
                    const item = items.nth(i);
                    const target = flags.selector
                        ? item.locator(String(flags.selector)).first()
                        : item;
                    const file = join(outDir, `${name}-${i + 1}.png`);
                    await target.screenshot({ path: file });
                    written.push(file);
                }
            } else if (flags.selector) {
                const file = join(outDir, `${name}.png`);
                await page.locator(String(flags.selector)).first().screenshot({ path: file });
                written.push(file);
            } else {
                const file = join(outDir, `${name}.png`);
                await page.screenshot({ path: file, fullPage: Boolean(flags.full) });
                written.push(file);
            }
        }
    }
} finally {
    await browser.close();
}

console.log(written.join("\n"));

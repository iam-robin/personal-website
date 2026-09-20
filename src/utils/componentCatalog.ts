import { posix } from "node:path";
import { componentNotes, componentPreviews } from "../data/componentLab";

// Raw imports run at build time. Component code never goes into the browser's
// catalogue script, and discovering a file does not execute its data fetching.
const components = import.meta.glob<string>("../components/**/*.astro", {
    query: "?raw", import: "default", eager: true,
});
const consumers = import.meta.glob<string>("../{components,layouts,pages}/**/*.{astro,mdx}", {
    query: "?raw", import: "default", eager: true,
});
const sourcePath = (path: string) => posix.normalize(`src/utils/${path}`);
const references = new Map<string, Set<string>>();
for (const [path, source] of Object.entries(consumers)) {
    const importer = sourcePath(path);
    // Direct relative imports only, not an assertion about runtime usage.
    // Exclude lab examples so adding a specimen can't make an unused component
    // look like a production dependency.
    if (importer.includes("/lab/") || importer === "src/layouts/LabLayout.astro") continue;
    for (const match of source.matchAll(/\bimport\s+[\s\S]*?\sfrom\s*["']([^"']+\.astro)["']/g)) {
        if (!match[1].startsWith(".")) continue;
        const target = posix.normalize(posix.join(posix.dirname(importer), match[1]));
        if (!references.has(target)) references.set(target, new Set());
        references.get(target)!.add(importer);
    }
}

const groupNames: Record<string, string> = {
    ui: "Shared UI", identity: "Bird & section shell", home: "Homepage",
    projects: "Projects", blog: "Blog", garden: "Garden", books: "Books",
    bookmarks: "Bookmarks", movies: "Movies", series: "Series", shelf: "Shelf",
    postcards: "Postcards", work: "Work", lab: "Lab helpers",
};
const order = Object.keys(groupNames);
const helpers = new Set(["BirdParts", "InkDefs", "WorldMapSvg"]);

export const componentCatalog = Object.entries(components).map(([path]) => {
    const source = sourcePath(path);
    const relative = source.replace("src/components/", "");
    const name = posix.basename(relative, ".astro");
    const group = relative.includes("/") ? relative.split("/")[0] : "identity";
    const id = relative.replace(/\.astro$/, "").replaceAll("/", "-").toLowerCase();
    const notes = componentNotes[name];
    const preview = componentPreviews[name];
    return {
        id, name, group, source, relative,
        description: notes?.description ?? "Component discovered in the source tree. No catalogue note yet.",
        href: notes?.href, note: notes?.note, preview,
        kind: helpers.has(name) ? "Internal helper" : group === "lab" ? "Lab only" : preview ? "Live preview" : "In context",
        references: [...(references.get(source) ?? [])].sort(),
    };
}).sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group) || a.name.localeCompare(b.name));

export const componentGroups = [...new Set(componentCatalog.map((entry) => entry.group))].map((id) => ({
    id,
    name: groupNames[id] ?? id,
    entries: componentCatalog.filter((entry) => entry.group === id),
}));

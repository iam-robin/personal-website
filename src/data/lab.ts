/** Shared lab destinations. Previews are deliberately not navigation entries. */
export const labSections = [
    { id: "overview", href: "/lab", name: "Overview", purpose: "Start here", description: "A guide to my website's reference pages and experiments." },
    { id: "tokens", href: "/lab/tokens", name: "Design tokens", purpose: "Reference", description: "Inspect the colours, type, spacing and motion I use across the site." },
    { id: "components", href: "/lab/components", name: "Components", purpose: "Reference", description: "Find a component, try its preview and see where I use it." },
] as const;

export type LabSection = (typeof labSections)[number]["id"];

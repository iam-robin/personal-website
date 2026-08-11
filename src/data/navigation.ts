/**
 * The primary navigation items, shared by the inline top-bar <Nav> (md and
 * up) and the bottom <MobileMenu> (below md). Deliberately small: rank,
 * not inventory — see AGENTS.md "Site Structure".
 */
export interface NavItem {
    label: string;
    href: string;
    external?: boolean;
}

export const navItems: NavItem[] = [
    { label: "Work", href: "/work" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Garden", href: "/garden" },
    { label: "Shelf", href: "/shelf" },
    { label: "Postcards", href: "/postcards" },
];

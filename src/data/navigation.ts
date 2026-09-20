/**
 * The primary navigation items, shared by the inline top-bar <Nav> (md and
 * up) and the bottom <MobileMenu> (below md). Deliberately small: rank,
 * not inventory — see AGENTS.md "Site Structure".
 */
export interface NavLink {
    label: string;
    href: string;
    external?: boolean;
    children?: never;
}

export type NavItem = NavLink | {
    label: string;
    href?: never;
    external?: never;
    children: NavLink[];
};

export const navItems: NavItem[] = [
    { label: "Work", href: "/work" },
    { label: "Projects", href: "/projects" },
    { label: "Blog", href: "/blog" },
    { label: "Garden", href: "/garden" },
    {
        label: "Shelf",
        children: [
            { label: "Books", href: "/books" },
            { label: "Series", href: "/series" },
            { label: "Movies", href: "/movies" },
            { label: "Bookmarks", href: "/bookmarks" },
        ],
    },
    { label: "Postcards", href: "/postcards" },
];

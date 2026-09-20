/** Link destinations shared by contact rows, the footer and structured data. */
export interface SiteLink {
    label: string;
    href: string;
    /** Mastodon profile verification. */
    me?: boolean;
}

export interface ContactLink extends SiteLink {
    handle: string;
    /** Name of the hand-drawn InkMark glyph. */
    icon: string;
}

export const contactLinks: Record<"email" | "github" | "mastodon" | "bluesky", ContactLink> = {
    email: {
        label: "Email",
        handle: "hey@iamrob.in",
        href: "mailto:hey@iamrob.in",
        icon: "email",
    },
    github: {
        label: "GitHub",
        handle: "@iam-robin",
        href: "https://github.com/iam-robin",
        icon: "github",
    },
    mastodon: {
        label: "Mastodon",
        handle: "@iamrobin",
        href: "https://mastodon.social/@iamrobin",
        me: true,
        icon: "mastodon",
    },
    bluesky: {
        label: "Bluesky",
        handle: "@iam-robin.bsky.social",
        href: "https://bsky.app/profile/iamrob.in",
        icon: "bluesky",
    },
};

/** Display order for contact rows and the footer's Elsewhere column. */
export const contactChannels: readonly ContactLink[] = Object.values(contactLinks);

export const siteLinks: readonly SiteLink[] = [
    { label: "Changelog", href: "/changelog" },
    { label: "Legal notice", href: "/legal" },
    { label: "Colophon", href: "/colophon" },
];

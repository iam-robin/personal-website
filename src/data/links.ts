export interface SiteLink {
    label: string;
    href: string;
    /** Mastodon profile verification. */
    me?: boolean;
}

export interface ContactLink extends SiteLink {
    handle: string;
    /** Phosphor icon (Bold weight), as an astro-icon name. */
    icon: string;
}

export const contactLinks: Record<"email" | "github" | "mastodon" | "bluesky", ContactLink> = {
    email: {
        label: "Email",
        handle: "hey@iamrob.in",
        href: "mailto:hey@iamrob.in",
        icon: "ph:envelope-simple-bold",
    },
    github: {
        label: "GitHub",
        handle: "@iam-robin",
        href: "https://github.com/iam-robin",
        icon: "ph:github-logo-bold",
    },
    mastodon: {
        label: "Mastodon",
        handle: "@iamrobin",
        href: "https://mastodon.social/@iamrobin",
        me: true,
        icon: "ph:mastodon-logo-bold",
    },
    bluesky: {
        label: "Bluesky",
        handle: "@iam-robin.bsky.social",
        href: "https://bsky.app/profile/iamrob.in",
        icon: "ph:butterfly-bold",
    },
};

export const contactChannels: readonly ContactLink[] = Object.values(contactLinks);

export const siteLinks: readonly SiteLink[] = [
    { label: "Changelog", href: "/changelog" },
    { label: "Legal notice", href: "/legal" },
    { label: "Colophon", href: "/colophon" },
];

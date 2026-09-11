const SITE_URL = "https://iamrob.in";
const PERSON_ID = `${SITE_URL}/#person`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export const personSchema = {
    "@type": "Person",
    "@id": PERSON_ID,
    name: "Robin Spielmann",
    url: SITE_URL,
    image: `${SITE_URL}/opengraph.png`,
    jobTitle: "Design Engineer",
    worksFor: {
        "@type": "Organization",
        name: "Freelance",
    },
    address: {
        "@type": "PostalAddress",
        addressLocality: "Munich",
        addressCountry: "DE",
    },
    sameAs: [
        "https://github.com/iam-robin",
        "https://mastodon.social/@iamrobin",
        "https://bsky.app/profile/iamrob.in",
    ],
};

export const websiteSchema = {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: "iamrobin",
    url: SITE_URL,
    description:
        "Robin Spielmann's personal website, with projects, writing, photos and postcards.",
    author: { "@id": PERSON_ID },
    inLanguage: "en",
};

export function graphSchema(items: unknown[]) {
    return {
        "@context": "https://schema.org",
        "@graph": items,
    };
}

export function profilePageSchema(url: string, description: string) {
    return {
        "@type": "ProfilePage",
        "@id": `${url}#profile`,
        url,
        name: "Frontend Design Engineer in Munich — Robin Spielmann",
        description,
        about: { "@id": PERSON_ID },
        mainEntity: { "@id": PERSON_ID },
        isPartOf: { "@id": WEBSITE_ID },
        inLanguage: "en",
    };
}

export function blogPostingSchema({
    url,
    title,
    description,
    image,
    datePublished,
    keywords,
}: {
    url: string;
    title: string;
    description?: string;
    image: string;
    datePublished: Date;
    keywords?: string[];
}) {
    return {
        "@type": "BlogPosting",
        "@id": `${url}#article`,
        url,
        headline: title,
        description,
        image,
        datePublished: datePublished.toISOString(),
        dateModified: datePublished.toISOString(),
        author: { "@id": PERSON_ID },
        publisher: { "@id": PERSON_ID },
        isPartOf: { "@id": WEBSITE_ID },
        mainEntityOfPage: url,
        keywords,
        inLanguage: "en",
    };
}

export function creativeWorkSchema({
    url,
    title,
    description,
    keywords,
    dateCreated,
}: {
    url: string;
    title: string;
    description: string;
    keywords?: string[];
    dateCreated?: string;
}) {
    return {
        "@type": "CreativeWork",
        "@id": `${url}#creative-work`,
        url,
        name: title,
        description,
        creator: { "@id": PERSON_ID },
        author: { "@id": PERSON_ID },
        isPartOf: { "@id": WEBSITE_ID },
        keywords,
        dateCreated,
        inLanguage: "en",
    };
}

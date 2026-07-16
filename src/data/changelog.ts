/**
 * A version history of this website, newest first. Each release is a small
 * milestone — a new section, a rebuild, a bit of polish. Major versions
 * (x.0.0) get a filled badge; everything else stays quiet.
 *
 * `body` is plain text; `bodyHtml` is used for the few entries that need an
 * inline link. Dates are ISO strings, rendered via `timeSince` at build time.
 *
 * Shared between the changelog page and the colophon's "last updated" line —
 * this is the single source of truth, so keep it newest-first.
 */
export interface Entry {
    version: string;
    title: string;
    date: string;
    body?: string;
    bodyHtml?: string;
}

export const changelog: Entry[] = [
    {
        version: "4.0.0",
        title: "🐦 A fresh start",
        date: "2026-07-15",
        body: "A ground-up rebuild. v3 had grown a little busy, so I started over with a clearer idea: keep the personal and the professional side by side without splitting who I am. Work lives on its own page now, the playful bits gather on the home page and About, and the whole thing is lighter and calmer. Rebuilt on Astro and Tailwind, still fed straight from my Obsidian vault — and there's a little robin watching over it all.",
    },
    {
        version: "3.5.0",
        title: "🧽 Polish & simplify",
        date: "2026-01-26",
        body: "Simplified the codebase by removing React entirely — now pure Astro. Added page transitions for smoother navigation, proper dark mode support, and a refined hero animation. Books and TV series data now live in Obsidian alongside my notes. Detail page layouts got cleaned up too.",
    },
    {
        version: "3.4.0",
        title: "💌 Postcards",
        date: "2025-06-25",
        body: "Launched a fun little postcard feature! I wanted a simple, personal way for visitors to say hello and leave a small trace on the site. It's like a digital guestbook — but a bit more playful and meaningful. Every postcard gets a quick review before being displayed, to keep things friendly and spam-free.",
    },
    {
        version: "3.3.0",
        title: "✍️ Blog",
        date: "2025-04-10",
        body: "Excited to finally launch my blog! A dedicated space for longer-form writing and insights on topics I'm passionate about. Unlike my Digital Garden, which holds evolving notes, the blog is for more polished, complete articles that I've spent time refining.",
    },
    {
        version: "3.2.0",
        title: "📷 365 project",
        date: "2025-01-21",
        body: "Another section! I'm capturing and sharing one photo each day for a year — and collecting them on a new subpage here.",
    },
    {
        version: "3.1.0",
        title: "🌿 Digital Garden",
        date: "2025-01-01",
        bodyHtml: `New section! My Digital Garden is an evolving collection of thoughts, ideas, and knowledge, synced straight from my <a href="https://obsidian.md/" target="_blank" rel="noopener noreferrer">Obsidian</a> vault. A space for curiosity and exploration — a living archive of what I'm into. Because it's wired to my notes, it stays up to date on its own. Dive in and see what's growing.`,
    },
    {
        version: "3.0.0",
        title: "🧑‍🚀 Astro and a new layout",
        date: "2024-07-04",
        bodyHtml: `Rebuilt with <a href="https://astro.build/" target="_blank" rel="noopener noreferrer">Astro</a> — and you know what? I really enjoyed the development experience. This update brought a fresh layout, a new content-focused structure, and cute little interactions that make the site feel personal. It's also much easier for me to add new content now.`,
    },
    {
        version: "2.2.0",
        title: "🌈 Themes",
        date: "2023-04-23",
        body: "I couldn't decide whether I preferred a blue or a gray background for the site. The solution: a theme switcher.",
    },
    {
        version: "2.1.0",
        title: "🔖 Bookmarks",
        date: "2023-02-24",
        body: "Added a new page listing all the articles, websites, videos, and other things I've bookmarked. The data updates automatically from my Raindrop.io account.",
    },
    {
        version: "2.0.0",
        title: "💅 New layout",
        date: "2023-01-31",
        body: "New layout! The navigation moved from the top to the right side of the site, alongside a collapsible sidebar. There's also a dark mode now, so you don't have to wear sunglasses at night anymore.",
    },
    {
        version: "1.2.0",
        title: "📚 Literal integration",
        date: "2022-12-19",
        body: "My reading list now comes straight from the wonderful platform literal.club — I was clearly too lazy to keep my reading stats up to date in Notion.",
    },
    {
        version: "1.1.0",
        title: "🎸 Music overview",
        date: "2022-06-26",
        body: "Alongside the books I've read, there's now an overview of my favourite music under the media tab. The data comes from my Spotify account and updates automatically whenever I add a new favourite album.",
    },
    {
        version: "1.0.0",
        title: "🚀 Hello world",
        date: "2022-06-19",
        body: "The site went live! It shipped with everything I'd planned for the first release: an overview of my side projects, a reading list, and a photo gallery. The reading list and gallery were powered by Notion, the whole thing built on Next.js. You could navigate it with a command bar, and yes — it had a dark theme.",
    },
    {
        version: "0.0.0",
        title: "👨🏼‍💻 Initial commit",
        date: "2022-03-17",
        body: "The idea for a personal website with a bit more depth is born, and the rough project structure — Next.js, TypeScript, Tailwind — is set up.",
    },
];

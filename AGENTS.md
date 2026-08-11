## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.

## Documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

## Writing Style & Tone

When writing copy for this website (section descriptions, labels, UI text):

- **First-person and conversational** — write as "I", like talking to a friend
- **Honest and self-aware** — acknowledge both ambitions and reality
- **Warm and inviting** — draw the reader in, make them feel welcome
- **Short, varied sentences** — mix punchy lines with longer ones for natural rhythm
- **No corporate speak or filler** — every sentence should feel genuine and personal
- **English** — all site copy is in English

## Development Principles

- The website should be static wherever possible. Only use client-side JavaScript
  when there is no other solution.
- Keep the design uncluttered — v4 exists because v3 got too busy. When in doubt,
  leave it out.
- Reuse ideas and code from v3 (`../iamrobin-personal-website`) where they fit,
  but don't copy clutter.

## Data Architecture

All personal data (books, series, bookmarks, garden notes, timeline) comes from
the Obsidian export repo `iam-robin/obsidian-personal-website-data`, mounted as
a git submodule at `data/`. It is consumed exclusively through Astro content
collections defined in `src/content.config.ts` — use `getCollection('books')`
etc. Do NOT add sync scripts or fetch the data from GitHub at build time
(v3 did both; v4 deliberately has one consumption path).

- `npm run dev` updates the submodule to the latest data automatically
- Book/bookmark cover images live in `data/output/book-covers/` and
  `data/output/bookmark-covers/`; import them via `import.meta.glob` +
  `astro:assets` when needed (series covers are remote TMDB URLs)
- Blog posts and projects are NOT in the submodule — they'll be local
  content collections (ported from v3 later)

## Site Structure

v4 separates personal and professional without splitting Robin's identity:

- `/` — the personal "living room": hero, side projects, blog, photography,
  postcards. Work-ish teasers first, playful ones further down.
- `/work` — the professional page and **application entry point** (shared
  directly in job applications): positioning, role & skills, clients worked
  with (names only, no client case studies — portfolio projects are side
  projects), selected side projects, CV/contact.
- `/shelf` — the hub for the media logs: books, series, bookmarks (movies and
  music once the Obsidian export covers them). An index and nothing more —
  the logs carry their own content. There is deliberately **no `/about`**:
  it would compete with `/work` for "the page where Robin explains himself",
  and a recruiter clicking it would land in a reading list. The hub is named
  after what it holds instead.
- Top navigation is deliberately small (rank, not inventory):
  Work · Projects · Blog · Garden · Shelf · Postcards. Every item is a
  distinct *kind* — professional case, portfolio, writing, notes,
  collections, participation — so no two compete for the same click.
  The individual media logs keep their own URLs but are reached through
  Shelf, not the nav.
- Postcards stays out of Shelf and keeps its nav slot: it's the one page a
  visitor can add to, and a participation loop buried two clicks deep stops
  being a loop. It belongs with contact (see `ContactSection`), not with the
  archives.
- Photos are not in Shelf either — `robins-photos` is a featured project with
  its own hero fan, and duplicating it would dilute both.

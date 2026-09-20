# Browser lab

Open `/lab` for an overview of the site's references.

- `/lab/tokens`: design-token reference.
- `/lab/components`: component inventory and previews.

All lab pages use `src/layouts/LabLayout.astro` for their header, sticky
navigation, page title, content margins and footer. Destinations and their
purpose labels live in `src/data/lab.ts`; `LabSections.astro` renders them.
On narrow screens the same navigation becomes a sticky row or two-row grid.
The reference pages also pass section links to the layout's native
"Jump to a section" disclosure. Navigation works without JavaScript.

## Design token reference

`/lab/tokens` reads the custom `@theme` blocks from `src/styles/theme/*.css`
through `src/utils/designTokens.ts`, and imports the section stocks from
`src/utils/paper.ts`. It is an overview, not an editor. It does not invent a
second palette or count Tailwind's built-in defaults as custom tokens.

Specimens mirror the parsed non-colour declarations into a local scope so
Tailwind cannot prune tokens only referenced by dynamic sample markup. The
fluid type control changes a real query container; pixel readouts use computed
styles. Easing plots come from the actual `linear()` stops, with optional
900ms previews that respect reduced motion. Source declarations preserve the
viewport fallbacks that precede the container-based type scale.

## Component catalogue

`/lab/components` inventories every `.astro` file under `src/components` at build
time through `src/utils/componentCatalog.ts`. New component files appear
automatically, even before someone writes a catalogue note for them.

- `src/data/componentLab.ts`: descriptions, context links and preview dimensions.
- `src/pages/lab/components/index.astro`: grouped inventory and native disclosures.
- `src/pages/lab/components/preview/[component].astro`: actual components with
  slot examples or published collection data. Register a preview in
  `componentPreviews`, then add its required props or slot recipe here.
- `src/scripts/componentCatalog.ts`: optional search, area filtering and deep links.

Search state lives in `?q=bird&area=identity`. A component anchor, such as
`#ui-button`, opens that row. Without JavaScript, all categories and native
`details` remain available. Previews use lazy-loaded iframes with real viewport
breakpoints; the mobile menu preview is capped at 390px. Links to standalone
previews make it possible to inspect other widths.

Direct-import references come from components, layouts and pages, excluding the
lab. They do not count dynamic usage and are not an unused-code detector. Raw
source is read at build time, not shipped to the browser as catalogue data.

Page-dependent compositions and invisible SVG helpers remain listed without
fake standalone examples. The lab doesn't add postcard database requests or
Mastodon thread requests. Isolated components use the lab's default paper;
context links show the destination page's paper and surrounding layout.

## Shared link data

`src/data/links.ts` owns contact labels, handles, destinations and glyph names,
plus the footer's site links. `ContactSection` and `FooterColumns` read the same
contact list. The work-page email button, lab link example and Person schema
also use these definitions. The footer's Explore column reuses `navItems` from
`src/data/navigation.ts`.

## Publication

The lab deploys with the website. `/lab` and its previews have `noindex` and are
excluded from the sitemap and main navigation. They are **not private**:
anyone who knows the URL can open them. Do not put secrets or unpublished client
work here.

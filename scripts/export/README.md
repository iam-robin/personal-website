# Obsidian Export

Exports books, series and the digital garden from the Obsidian vault
(`/Users/robin/Documents/Obsidian/Notes`) into the website's `data/` folder,
which `src/content.config.ts` reads. The vault is the source; `data/` is
generated, but committed so the build server doesn't need the vault.

## Usage

```bash
npm run export
```

## Output

Written to `data/` in the repo root:

-   `books.json` - Books from the vault folder `books/`
-   `series.json` - TV series from the vault folder `series/`
-   `digital-garden.json` - Garden notes from the vault folder `garden/`
-   `book-covers/`, `series-covers/` - cover images

## Book Covers

Covers live in the Obsidian vault under `attachments/book-cover/`; each book note points to its file in the `cover` field. `export-books.mjs` takes care of the rest:

- **URL in `cover`** (the Book Search plugin puts the Google Books cover URL there, or pasted by hand): downloaded into the vault, resized, and the note's `cover` is rewritten to the local path. Google Books URLs are fetched with `fife=w1000`, i.e. the same cover at 1000px instead of the 128px thumbnail. Existing local covers are never replaced.
- **Copy to the website**: the cover is copied to `data/book-covers/` (slugified file name) whenever its content changed. `books.json` holds `"cover": "book-covers/<file>.jpg"`.
- **Spine colour**: if the note has no `spine_color`, the cover's dominant colour is used. The website picks a readable text colour itself.

To change a cover, either overwrite the image file in the vault (same name) or paste a new image URL into `cover`, then run the export.

**Series** work the same way: poster URLs in `cover` are downloaded to `attachments/series-cover/`, the note is rewritten to the local path, and the file is published to `data/series-covers/` (`series.json` then holds `"cover": "series-covers/<file>.jpg"`). If a download fails, the remote URL stays in `series.json` until the next try. No spine colours for series.

## Daily automatic export

`scripts/export/auto-export.sh` runs the export and, if anything in `data/` changed, commits and pushes it (only `data/`, nothing else). It commits straight to `main`, so it refuses to run when another branch is checked out or `main` has unpushed commits. On failure it shows a macOS notification; the log is `~/Library/Logs/obsidian-export.log`.

It runs every morning at 5:30 via launchd (`~/Library/LaunchAgents/in.iamrob.obsidian-export.plist`). launchd jobs can't read `~/Documents`, so the job opens a tiny applet, `~/Applications/Obsidian-Export.app` (built with `osacompile`), which has its own Documents permission and runs the script. Missed runs (Mac asleep) happen on wake. The "Daily rebuild" GitHub Action deploys at 6:00.

Run it by hand any time with `scripts/export/auto-export.sh`. The "Obsidian-Export" shortcut in the Shortcuts app runs it with `--deploy`, which additionally triggers the "Daily rebuild" workflow (via `gh`) after a push, so changes go live within minutes.

## Adding New Data Types

1. Create `export-[type].mjs` (copy from `export-books.mjs`)
2. Update `KEY_MAP` for your frontmatter fields
3. Point `findMarkdownFiles()` at the vault folder
4. Import and call from `export-all.mjs`

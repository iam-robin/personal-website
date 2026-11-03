#!/usr/bin/env node

import {
  findMarkdownFiles,
  parseMarkdownFile,
  translateKeys,
  normalizeStatus,
  writeOutput,
  getLastUpdated,
} from './lib/utils.mjs';
import { ensureLocalCover, publishCover, writeCoverToNote } from './lib/covers.mjs';

// Map vault frontmatter keys to the JSON keys the website consumes
const KEY_MAP = {
  'title': 'title',
  'season': 'season',
  'rating': 'rating',
  'cover': 'cover',
  'finished': 'finished',
  'added': 'added',
  'favorite': 'favorite'
};

async function exportSeries() {
  console.log('Exporting series...');

  const files = await findMarkdownFiles('series/*.md');
  const series = [];

  for (const filePath of files) {
    try {
      const { data } = await parseMarkdownFile(filePath);

      // Translate keys and clean wikilinks
      const show = translateKeys(data, KEY_MAP);

      // Handle status separately (normalize to array)
      show.status = normalizeStatus(data.status);

      // Parse rating as number if possible
      if (show.rating) {
        const parsed = parseFloat(show.rating);
        show.rating = isNaN(parsed) ? show.rating : parsed;
      }

      // Parse season as number if possible
      if (show.season) {
        const parsed = parseInt(show.season, 10);
        show.season = isNaN(parsed) ? show.season : parsed;
      }

      // Cover: download the poster into the vault once, then publish the
      // local copy. If the download fails, keep the remote URL for now.
      if (show.cover) {
        try {
          const name = [show.title, show.season].filter(Boolean).join(' ');
          const { path, changed } = await ensureLocalCover(data.cover, name, 'series');
          if (changed) await writeCoverToNote(filePath, path);
          if (path) show.cover = await publishCover(path, 'series');
        } catch (err) {
          console.warn(`  Warning: Could not localise cover for ${show.title}: ${err.message}`);
        }
      }

      series.push(show);
    } catch (err) {
      console.error(`  Error processing ${filePath}: ${err.message}`);
    }
  }

  // Group by status
  const aktiv = [];
  const merkliste = [];
  const pausiert = [];
  const abgeschlossen = {};

  for (const show of series) {
    const status = show.status?.[0] || '';

    if (status === 'Aktiv') {
      aktiv.push(show);
    } else if (status === 'Merkliste') {
      merkliste.push(show);
    } else if (status === 'Pausiert') {
      pausiert.push(show);
    } else if (status === 'Abgeschlossen') {
      // Extract year from finished date
      const finishedDate = show.finished ? new Date(show.finished) : null;
      const year = finishedDate ? String(finishedDate.getFullYear()) : 'unknown';

      if (!abgeschlossen[year]) {
        abgeschlossen[year] = [];
      }
      abgeschlossen[year].push(show);
    }
  }

  // Sort each array by finished date (most recent first)
  const sortByFinished = (a, b) => {
    const aDate = a.finished ? String(a.finished) : '';
    const bDate = b.finished ? String(b.finished) : '';
    if (!aDate && !bDate) return 0;
    if (!aDate) return 1;
    if (!bDate) return -1;
    return bDate.localeCompare(aDate);
  };

  aktiv.sort(sortByFinished);
  merkliste.sort(sortByFinished);
  pausiert.sort(sortByFinished);

  // Sort within each year
  for (const year of Object.keys(abgeschlossen)) {
    abgeschlossen[year].sort(sortByFinished);
  }

  // Sort years descending (most recent first)
  const sortedAbgeschlossen = {};
  Object.keys(abgeschlossen)
    .sort((a, b) => b.localeCompare(a))
    .forEach(year => {
      sortedAbgeschlossen[year] = abgeschlossen[year];
    });

  const dataForComparison = {
    aktiv,
    merkliste,
    pausiert,
    abgeschlossen: sortedAbgeschlossen,
  };

  const output = {
    lastUpdated: await getLastUpdated("series.json", dataForComparison),
    count: series.length,
    ...dataForComparison,
  };

  const outputPath = await writeOutput('series.json', output);

  console.log(`  Exported ${series.length} series to ${outputPath}`);
  console.log(`    - Aktiv: ${aktiv.length}`);
  console.log(`    - Merkliste: ${merkliste.length}`);
  console.log(`    - Pausiert: ${pausiert.length}`);
  console.log(`    - Abgeschlossen: ${Object.keys(sortedAbgeschlossen).length} years`);
  return output;
}

// Run if called directly
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1].split('/').pop());
if (isMainModule || process.argv[1]?.endsWith('export-series.mjs')) {
  exportSeries().catch(console.error);
}

export { exportSeries };

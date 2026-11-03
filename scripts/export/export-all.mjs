#!/usr/bin/env node

import { exportBooks } from './export-books.mjs';
import { exportSeries } from './export-series.mjs';
import { exportDigitalGarden } from './export-digital-garden.mjs';

async function exportAll() {
  console.log('=== Obsidian Data Export ===\n');

  const results = {};

  try {
    results.books = await exportBooks();
  } catch (err) {
    console.error('Failed to export books:', err.message);
  }

  try {
    results.series = await exportSeries();
  } catch (err) {
    console.error('Failed to export series:', err.message);
  }

  try {
    results.digitalGarden = await exportDigitalGarden();
  } catch (err) {
    console.error('Failed to export Digital Garden:', err.message);
  }

  // Summary
  console.log('\n=== Export Complete ===');
  console.log(`Books: ${results.books?.count ?? 0} items`);
  console.log(`Series: ${results.series?.count ?? 0} items`);
  console.log(`Digital Garden: ${results.digitalGarden?.count ?? 0} items`);
  console.log(`\nOutput: data/`);
}

exportAll().catch(console.error);

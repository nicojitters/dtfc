#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const SCRIPTS_DIR = new URL('../src/content/scripts/', import.meta.url).pathname;
const FOLGER_RE = /https:\/\/www\.folger\.edu\/[^\s)]+/g;

const files = readdirSync(SCRIPTS_DIR).filter((f) => f.endsWith('.mdx'));

let checked = 0;
let failed = 0;
const failures = [];

for (const file of files) {
  const src = readFileSync(join(SCRIPTS_DIR, file), 'utf-8');
  const urls = [...src.matchAll(FOLGER_RE)].map((m) => m[0]);
  for (const url of urls) {
    checked++;
    try {
      const res = await fetch(url, { redirect: 'follow' });
      if (!res.ok) {
        failed++;
        failures.push(`${file}: ${url} → HTTP ${res.status}`);
      }
    } catch (e) {
      failed++;
      failures.push(`${file}: ${url} → fetch error: ${e.message}`);
    }
  }
}

console.log(`Checked ${checked} Folger URL(s); ${failed} failure(s).`);
for (const f of failures) console.log(`  ${f}`);
if (failed > 0) {
  console.log(`\nAdvisory only — not blocking build. Update or ticket the URLs.`);
}
process.exit(0);

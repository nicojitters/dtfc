import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import fg from 'fast-glob';

/**
 * Vision-spec-prohibited phrases and source typos. Editing this list is the
 * only supported way to tune the guardrail.
 *
 * Each entry: { phrase, regex, reason }
 *   - phrase: canonical human-readable string (used in error output)
 *   - regex: MUST have the `g` flag; MAY have `i`
 *   - reason: short explanation shown in the error output
 */
export const PATTERNS = [
  {
    phrase: 'Great Change',
    regex: /great change/gi,
    reason: 'Rejected slide-3 phrasing (Pua: dates the work; site copy stays timeless)',
  },
  {
    phrase: 'traditional work and ways',
    regex: /traditional work and ways/gi,
    reason: 'Rejected slide-3 phrasing (same rationale)',
  },
  {
    phrase: 'RESILIENCEl',
    regex: /RESILIENCEl/g,
    reason: 'Source typo — canonical spelling is RESILIENCE',
  },
  {
    phrase: "Childrens' Theatre",
    regex: /Childrens['']\s+Theatre/g,
    reason: "Wrong-apostrophe form from slides — canonical is \"Children's Theatre\"",
  },
  {
    phrase: 'THIS (crazy) time',
    regex: /\bTHIS\s+\(crazy\)\s+time\b/gi,
    reason: 'Explicitly rejected by Pua',
  },
];

/**
 * Scan `text` (originating from `file`) for prohibited phrases.
 * Returns [] when clean.
 */
export function findViolations(text, file) {
  const hits = [];
  for (const { phrase, regex, reason } of PATTERNS) {
    const rx = new RegExp(regex.source, regex.flags); // fresh instance per call (regex state)
    let match;
    while ((match = rx.exec(text)) !== null) {
      const before = text.slice(0, match.index);
      const line = before.split('\n').length;
      const lastNewline = before.lastIndexOf('\n');
      const col = match.index - (lastNewline + 1) + 1;
      hits.push({ file, line, col, phrase, reason });
    }
  }
  return hits;
}

/**
 * Scan the repo. Called when the script runs directly.
 */
async function main() {
  const patterns = [
    'src/**/*.{astro,mdx,md,ts,tsx,js,jsx}',
    'src/content/**/*.mdx',
    'src/data/**/*.ts',
    'public/**/*.svg',
  ];
  // Explicitly EXCLUDE the design / plan docs — they legitimately contain the
  // forbidden phrases for reference.
  const ignore = [
    'docs/**',
    'node_modules/**',
    '.astro/**',
    'dist/**',
  ];
  const files = await fg(patterns, { ignore, absolute: false });
  const allHits = [];
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const hits = findViolations(text, relative(process.cwd(), file));
    allHits.push(...hits);
  }
  if (allHits.length > 0) {
    console.error('\nProhibited-text guardrail failed. Occurrences:\n');
    for (const h of allHits) {
      console.error(`  ${h.file}:${h.line}:${h.col}  "${h.phrase}"  — ${h.reason}`);
    }
    console.error('\nEdit the offending files, or update PATTERNS in scripts/check-prohibited-text.mjs.\n');
    process.exit(1);
  }
  console.log(`✓ Checked ${files.length} file(s) for prohibited text; all clean.`);
}

// Run main() only when invoked directly, not when imported by the test.
const invokedDirectly = import.meta.url === `file://${process.argv[1]}`;
if (invokedDirectly) {
  main();
}

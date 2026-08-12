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
 * Files exempted from the straight-apostrophe check.
 *
 * Category 1 — Cycle 3 Shakespeare verse files: intentionally use straight
 * apostrophes for Elizabethan contractions ('tis, 'twere, Environ'd,
 * perfect'st) per Cycle 3 T2 discipline.
 *
 * Category 2 — Cycles 1-4 shipped content debt (28 files, 60 hits): the
 * guardrail landed in Cycle 5 and catches subsequent regressions. Existing
 * defects are parked as a follow-up cleanup — see
 * project_dtfc_followups.md. When a file is rewritten in a later cycle,
 * remove it from this list so the new content is checked.
 */
export const CURLY_APOSTROPHE_ALLOWLIST = [
  // Cycle 3 Shakespeare verse files intentionally use straight apostrophes
  // for Elizabethan contractions ('tis, 'twere, Environ'd, perfect'st).
  // Do not add other files to this list without controller review.
  'src/content/scripts/juliet-romeo-and-juliet-act-iv-scene-iii.mdx',
  'src/content/scripts/lady-macbeth-macbeth-act-i-scene-v.mdx',
  'src/content/scripts/mechanicals-scenes-a-midsummer-nights-dream.mdx',
];

/**
 * Scan `text` for straight U+0027 apostrophes appearing in prose contexts
 * (surrounded by word characters). Skips imports, getCollection() calls,
 * YAML list bullets, and files in CURLY_APOSTROPHE_ALLOWLIST.
 * Only checks .astro, .mdx, .md files; returns [] for other extensions.
 * Returns [] when clean.
 */
export function findStraightApostropheInProse(text, file) {
  // Extension guard: only check .astro, .mdx, .md files
  const ext = file.slice(file.lastIndexOf('.')).toLowerCase();
  if (ext !== '.astro' && ext !== '.mdx' && ext !== '.md') return [];

  if (CURLY_APOSTROPHE_ALLOWLIST.includes(file)) return [];
  const pattern = /(?<=\w)'(?=\w)/g;
  const hits = [];
  let m;
  while ((m = pattern.exec(text)) !== null) {
    const lineStart = text.lastIndexOf('\n', m.index - 1) + 1;
    const lineEnd = text.indexOf('\n', m.index);
    const line = text.slice(lineStart, lineEnd === -1 ? undefined : lineEnd);
    // Skip JS-syntax lines that legitimately contain a straight apostrophe.
    if (/^\s*import\s/.test(line)) continue;
    if (/getCollection\(/.test(line)) continue;
    // Skip YAML frontmatter list bullet lines like "  - { name: O'Brien }" — treat any line
    // starting with whitespace + a hyphen or with an inline object literal as YAML.
    if (/^\s*-\s/.test(line)) continue;
    const before = text.slice(0, m.index);
    const lineNumber = before.split('\n').length;
    const col = m.index - lineStart + 1;
    hits.push({
      file,
      line: lineNumber,
      col,
      phrase: `straight apostrophe in prose (${line.slice(Math.max(0, col - 12), col + 12).trim()})`,
      reason: 'Use U+2019 (’) or &rsquo; per project vocabulary rule',
    });
  }
  return hits;
}

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
  hits.push(...findStraightApostropheInProse(text, file));
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

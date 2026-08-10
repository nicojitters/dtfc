import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import { parse as parseYaml } from 'yaml';
import fg from 'fast-glob';

const CONCEPT_REF = /<Concept\s+id=(?:"([^"]+)"|'([^']+)')/g;
const KNOWN = new Set();
const REFS = [];

// Collect known slugs from concept frontmatter.
for (const file of await fg('src/content/concepts/**/*.{md,mdx}')) {
  const src = readFileSync(file, 'utf8');
  const match = src.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    console.error(`No frontmatter in ${file}`);
    process.exit(1);
  }
  const data = parseYaml(match[1]);
  if (!data?.slug) {
    console.error(`Missing slug in ${file}`);
    process.exit(1);
  }
  KNOWN.add(data.slug);
}

// Collect all references.
for (const file of await fg(['src/**/*.astro', 'src/**/*.mdx'])) {
  const src = readFileSync(file, 'utf8');
  let match;
  const lines = src.split('\n');
  while ((match = CONCEPT_REF.exec(src)) !== null) {
    const id = match[1] ?? match[2];
    const beforeMatch = src.slice(0, match.index);
    const line = beforeMatch.split('\n').length;
    REFS.push({ file: relative(process.cwd(), file), id, line });
  }
}

// Validate.
const unknown = REFS.filter((r) => !KNOWN.has(r.id));
if (unknown.length > 0) {
  console.error('\nUnknown <Concept> references:\n');
  for (const r of unknown) {
    console.error(`  ${r.file}:${r.line}  <Concept id="${r.id}" />`);
  }
  console.error(`\nKnown slugs: ${[...KNOWN].sort().join(', ')}\n`);
  process.exit(1);
}

console.log(`✓ Checked ${REFS.length} <Concept> reference(s); all resolve.`);

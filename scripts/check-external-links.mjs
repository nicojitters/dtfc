/**
 * On-demand link-rot check for archival essays.
 *
 * Scoped to `src/content/essays/*.mdx` files whose frontmatter includes
 * `archival: true` (per vision spec §3 Doc #7 and Cycle 9 T11). Extracts
 * external http/https URLs from each and issues a HEAD request. Prints a
 * per-URL status line; exits 0 always (advisory only) so a transient
 * network failure never breaks CI.
 *
 * NOT wired into `pnpm build` — network flakiness would break offline dev
 * and CI reliability. Run manually with `pnpm check:links` when reviewing
 * archival essays before a merge, or on a schedule.
 */

import { readFileSync } from 'node:fs';
import { relative } from 'node:path';
import fg from 'fast-glob';

const URL_RE = /https?:\/\/[^\s)"'<>]+/g;
const TIMEOUT_MS = 10_000;

function extractExternalUrls(text) {
  const found = new Set();
  let m;
  while ((m = URL_RE.exec(text)) !== null) {
    let url = m[0].replace(/[.,;:!?)\]]+$/, ''); // strip trailing punctuation
    if (url.includes('localhost') || url.includes('127.0.0.1')) continue;
    found.add(url);
  }
  return Array.from(found);
}

async function checkUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { method: 'HEAD', signal: controller.signal, redirect: 'follow' });
    return { url, ok: res.ok, status: res.status };
  } catch (err) {
    return { url, ok: false, error: String(err?.message ?? err) };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const files = await fg('src/content/essays/*.mdx');
  const targets = [];
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    if (!/^\s*archival:\s*true\s*$/m.test(text)) continue;
    const urls = extractExternalUrls(text);
    if (urls.length === 0) continue;
    targets.push({ file, urls });
  }

  if (targets.length === 0) {
    console.log('✓ No external URLs found in archival essays.');
    return;
  }

  console.log(`Checking external URLs in ${targets.length} archival essay(s)…\n`);
  let warnings = 0;
  for (const { file, urls } of targets) {
    const rel = relative(process.cwd(), file);
    for (const url of urls) {
      const r = await checkUrl(url);
      if (r.ok) {
        console.log(`  ✓ ${rel}: ${url} (${r.status})`);
      } else {
        warnings++;
        console.warn(`  ⚠ ${rel}: ${url} — ${r.error ?? `HTTP ${r.status}`}`);
      }
    }
  }
  console.log(`\nDone. ${warnings} warning(s); advisory only — exit 0.`);
}

main();

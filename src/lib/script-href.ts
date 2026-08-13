import type { CollectionEntry } from 'astro:content';

const CHILDRENS_LIBRARIES = new Set(['childrens-plays', 'teaching-modules']);

/**
 * Canonical URL for a script entry. Detail pages live under the section
 * that owns the library:
 *   Shakespeare libraries (soliloquies, scenes, themes, cuttings,
 *   childrens-shakespeare) -> /shakespeare/scripts/<slug>/
 *   Children's Theatre libraries (childrens-plays, teaching-modules)
 *   -> /childrens-theatre/scripts/<slug>/
 *
 * The 'childrens-shakespeare' library stays under /shakespeare/ because
 * Cycle 3 built its detail pages there; the Children's Theatre section
 * cross-links to those URLs via /childrens-theatre/shakespeare-for-children/.
 *
 * Always import this helper — never hardcode script detail URLs.
 */
export function scriptHref(entry: CollectionEntry<'scripts'>): string {
  const slug = entry.id.replace(/\.mdx?$/, '');
  if (entry.data.nennoUnit) {
    return `/shakespeare/scenes/dtfc/${slug}/`;
  }
  if (CHILDRENS_LIBRARIES.has(entry.data.library)) {
    return `/childrens-theatre/scripts/${slug}/`;
  }
  return `/shakespeare/scripts/${slug}/`;
}

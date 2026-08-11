/**
 * Groups consecutive items into pairs. Trailing single item survives as a
 * one-element array. Used by SideBySideText to pair Original/Colloquial
 * children for the side-by-side layout.
 */
export function pairChildren<T>(items: T[]): T[][] {
  const pairs: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    pairs.push(items.slice(i, i + 2));
  }
  return pairs;
}

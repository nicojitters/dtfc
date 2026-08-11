import { describe, it, expect } from 'vitest';
import { pairChildren } from '@/lib/pair-children';

describe('pairChildren', () => {
  it('groups a four-item array into two pairs', () => {
    expect(pairChildren(['a', 'b', 'c', 'd'])).toEqual([
      ['a', 'b'],
      ['c', 'd'],
    ]);
  });

  it('handles a single pair', () => {
    expect(pairChildren(['x', 'y'])).toEqual([['x', 'y']]);
  });

  it('handles an odd count with a trailing single', () => {
    expect(pairChildren(['a', 'b', 'c'])).toEqual([['a', 'b'], ['c']]);
  });

  it('handles a single trailing element only', () => {
    expect(pairChildren(['solo'])).toEqual([['solo']]);
  });

  it('returns an empty array for empty input', () => {
    expect(pairChildren([])).toEqual([]);
  });

  it('works with objects', () => {
    const items = [{ n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }];
    expect(pairChildren(items)).toEqual([
      [{ n: 1 }, { n: 2 }],
      [{ n: 3 }, { n: 4 }],
    ]);
  });
});

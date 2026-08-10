import { describe, it, expect } from 'vitest';
import { iconPath } from '../../src/lib/icons';

describe('iconPath', () => {
  it('returns the placeholder when the icon file is missing', () => {
    expect(iconPath('definitely-not-a-real-icon')).toBe('/icons/placeholder.svg');
  });

  it('returns the actual icon when the file exists', () => {
    expect(iconPath('placeholder')).toBe('/icons/placeholder.svg');
  });
});

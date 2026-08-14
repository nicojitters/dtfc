import { describe, it, expect } from 'vitest';
import { scriptHref } from '@/lib/script-href';

const mk = (slug: string, data: Record<string, unknown>) =>
  ({ id: `${slug}.mdx`, slug, data } as never);

describe('scriptHref — Nenno precedence (Cycle 12)', () => {
  it('routes nennoUnit:true entries to /shakespeare/scenes/dtfc/<slug>/', () => {
    const entry = mk('nurse-juliet-rj-nenno', {
      library: 'scenes',
      nennoUnit: true,
    });
    expect(scriptHref(entry)).toBe('/shakespeare/scenes/dtfc/nurse-juliet-rj-nenno/');
  });

  it('nennoUnit precedence beats childrens-shakespeare library', () => {
    const entry = mk('special-nenno', {
      library: 'childrens-shakespeare',
      nennoUnit: true,
    });
    expect(scriptHref(entry)).toBe('/shakespeare/scenes/dtfc/special-nenno/');
  });

  it('non-Nenno scenes entries still route to /shakespeare/scripts/', () => {
    const entry = mk('fairy-robin-msnd', { library: 'scenes' });
    expect(scriptHref(entry)).toBe('/shakespeare/scripts/fairy-robin-msnd/');
  });

  it("Children's Theatre libraries still route to /childrens-theatre/scripts/", () => {
    const entry = mk('the-treasure-inside', { library: 'childrens-plays' });
    expect(scriptHref(entry)).toBe('/childrens-theatre/scripts/the-treasure-inside/');
  });
});

import { describe, it, expect } from 'vitest';
import { getCollection } from 'astro:content';

describe('DtfcSceneUnit — schema completeness (Cycle 12)', () => {
  it('every nennoUnit entry has required wrapper fields', async () => {
    const all = await getCollection('scripts');
    const entries = all.filter((e) => Boolean(e.data.nennoUnit));
    for (const e of entries) {
      expect(e.data.chanceCasting, `${e.id}: chanceCasting`).toBeTruthy();
      expect(e.data.characterOneLiners, `${e.id}: characterOneLiners`).toBeTruthy();
      expect(
        e.data.competencyReflection?.length,
        `${e.id}: competencyReflection non-empty`,
      ).toBeGreaterThan(0);
    }
  });

  it('Hamlet/Horatio entry (if present) does NOT reuse Falstaff description', async () => {
    const entries = await getCollection('scripts');
    const horatio = entries.find((e) => e.id === 'hamlet-horatio-nenno' || e.id === 'hamlet-horatio-nenno.mdx');
    if (!horatio) return; // authored in Task 8; skip if not yet present
    const bodyText = horatio.body ?? '';
    const oneLinerText = JSON.stringify(horatio.data.characterOneLiners ?? {});
    expect(bodyText).not.toContain('Prince Hal alter-father');
    expect(oneLinerText).not.toContain('Prince Hal alter-father');
    expect(bodyText).not.toContain('Large Person in every way');
    expect(oneLinerText).not.toContain('Large Person in every way');
  });
});

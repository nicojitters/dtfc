import { describe, it, expect } from 'vitest';
import { scriptsSchema } from '@/lib/content-schemas';

describe('scriptsSchema Cycle 12 additions', () => {
  it('accepts all new Nenno fields on a valid entry', () => {
    const parsed = scriptsSchema.parse({
      title: 'Test Scene',
      library: 'scenes',
      play: 'Test Play',
      nennoUnit: true,
      chanceCasting: 'Draw from a hat.',
      pronunciations: { Juliet: 'Ju-lee-et' },
      characterOneLiners: { Juliet: 'Young, quick, determined.' },
      competencyReflection: ['What did you notice?', 'What surprised you?'],
      evaluationRitual: 'liked-wonder',
      sceneNotes: 'Splits well into two halves.',
      difficultyTag: 'intermediate',
    });
    expect(parsed.nennoUnit).toBe(true);
    expect(parsed.evaluationRitual).toBe('liked-wonder');
  });

  it('accepts soliloquy filter fields', () => {
    const parsed = scriptsSchema.parse({
      title: 'Test Soliloquy',
      library: 'soliloquies',
      play: 'Test Play',
      register: 'grief',
      speakerGender: 'female',
      actScene: { act: 'IV', scene: 'iii' },
    });
    expect(parsed.register).toBe('grief');
    expect(parsed.actScene?.act).toBe('IV');
  });

  it('accepts draft flag with default false', () => {
    const parsed = scriptsSchema.parse({
      title: 'Test',
      library: 'scenes',
      play: 'Test Play',
    });
    expect(parsed.draft).toBe(false);
  });

  it('rejects invalid register enum', () => {
    expect(() =>
      scriptsSchema.parse({
        title: 'Test',
        library: 'soliloquies',
        play: 'Test Play',
        register: 'joyful', // not in enum
      }),
    ).toThrow();
  });

  it('rejects competencyReflection > 5 items', () => {
    expect(() =>
      scriptsSchema.parse({
        title: 'Test',
        library: 'scenes',
        play: 'Test Play',
        competencyReflection: ['a', 'b', 'c', 'd', 'e', 'f'], // 6 items
      }),
    ).toThrow();
  });
});

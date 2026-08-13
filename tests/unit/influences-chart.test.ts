import { describe, expect, it } from 'vitest';
import { INFLUENCES_CHART } from '@/data/influences-chart';

describe('INFLUENCES_CHART', () => {
  it('has 5 tradition columns per vision spec §3 Doc #4', () => {
    expect(INFLUENCES_CHART.columns).toHaveLength(5);
  });

  it('has 11 theatre-convention rows per vision spec §3 Doc #4', () => {
    expect(INFLUENCES_CHART.rows).toHaveLength(11);
  });

  it('every row has 5 values (one per column)', () => {
    for (const row of INFLUENCES_CHART.rows) {
      expect(row.values).toHaveLength(5);
    }
  });

  it('covers the 5 spec-required tradition keys', () => {
    const keys = INFLUENCES_CHART.columns.map((c) => c.key);
    expect(keys).toEqual(['asian', 'shakespeare', 'poor', 'games', 'dtfc']);
  });

  it('covers the 11 spec-required convention labels in source order', () => {
    const labels = INFLUENCES_CHART.rows.map((r) => r.label);
    expect(labels).toEqual([
      'Audience',
      'Audience Participation',
      'Stage',
      'Stage Access',
      'Movement',
      'Props',
      'Speech',
      'Music',
      'Themes',
      'Plots',
      'Role Types / Characters',
    ]);
  });

  it('preserves the empty Stage Access × Theatre Games cell from source', () => {
    const stageAccess = INFLUENCES_CHART.rows.find((r) => r.label === 'Stage Access');
    expect(stageAccess).toBeDefined();
    // Column index 3 = 'games' per the columns array order.
    expect(stageAccess!.values[3]).toBe('');
  });
});

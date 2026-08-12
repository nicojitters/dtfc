import raw from '../data/timeline.json';
import { timelineSchema, type TimelineEvent } from '@/lib/content-schemas';

/**
 * Timeline events parsed and validated at import time. Any drift between
 * timeline.json and timelineSchema throws at build time.
 */
export const TIMELINE_EVENTS: TimelineEvent[] = timelineSchema.parse(raw);

/**
 * Parse a leading 4-digit year (19xx or 20xx) from a date string. Returns
 * null if none found — the caller decides how to handle unparseable dates.
 */
export function parseYear(date: string): number | null {
  const m = date.match(/\b(19|20)\d{2}\b/);
  return m ? Number(m[0]) : null;
}

/**
 * Group events by decade (1971 -> 1970, 1985 -> 1980, ...). Returns
 * `{ decade, events }` sorted by decade ascending. Events with unparseable
 * dates (e.g., "197?", season-only) are collected into a trailing group
 * with `decade: null` labelled "Undated / Approximate" by the renderer.
 * Silent-skip was Cycle 5 behavior; changed in Cycle 9 T13 per vision
 * spec §5 item 3 (fuzzy dates must display, never disappear).
 */
export function groupByDecade(
  events: TimelineEvent[],
): Array<{ decade: number | null; events: TimelineEvent[] }> {
  const decades = new Map<number, TimelineEvent[]>();
  const undated: TimelineEvent[] = [];
  for (const e of events) {
    const year = parseYear(e.date);
    if (year == null) {
      undated.push(e);
      continue;
    }
    const decade = Math.floor(year / 10) * 10;
    if (!decades.has(decade)) decades.set(decade, []);
    decades.get(decade)!.push(e);
  }
  const groups: Array<{ decade: number | null; events: TimelineEvent[] }> = [
    ...decades.entries(),
  ]
    .sort(([a], [b]) => a - b)
    .map(([decade, events]) => ({ decade, events }));
  if (undated.length > 0) groups.push({ decade: null, events: undated });
  return groups;
}

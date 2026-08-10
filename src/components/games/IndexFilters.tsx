import {
  COMPETENCIES,
  COHESIONS,
  STRUCTURES,
  COMPETENCY_LABELS,
  COMPETENCY_SUBSETS,
} from '@/lib/types';
import type { FilterState } from '@/lib/gameFilter';
import type { Competency, Cohesion, Structure } from '@/lib/types';

interface Props {
  state: FilterState;
  onChange(s: FilterState): void;
  onReset(): void;
}

function toggleIn<T>(arr: T[], value: T): T[] {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

export function IndexFilters({ state, onChange, onReset }: Props) {
  const availableSubsets = state.competencies.length
    ? state.competencies.flatMap((c) => COMPETENCY_SUBSETS[c])
    : Object.values(COMPETENCY_SUBSETS).flat();
  const uniqueSubsets = Array.from(new Set(availableSubsets));

  return (
    <div class="space-y-6">
      <fieldset>
        <legend class="text-ink-700 text-sm font-medium">Competency</legend>
        <div class="mt-2 flex flex-wrap gap-2">
          {COMPETENCIES.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() =>
                onChange({
                  ...state,
                  competencies: toggleIn(state.competencies, c) as Competency[],
                })
              }
              class={`rounded-[var(--radius-chip)] border px-3 py-1 text-sm ${
                state.competencies.includes(c)
                  ? 'border-clay-500 bg-clay-500 text-ivory-50'
                  : 'border-ivory-200 text-ink-700 hover:border-clay-500 bg-white'
              }`}
              aria-pressed={state.competencies.includes(c)}
            >
              {COMPETENCY_LABELS[c]}
            </button>
          ))}
        </div>
      </fieldset>

      {uniqueSubsets.length > 0 && (
        <label class="block">
          <span class="text-ink-700 text-sm font-medium">Subset</span>
          <select
            class="border-ivory-200 mt-1 w-full rounded border bg-white px-3 py-2 text-base"
            value={state.subset ?? ''}
            onInput={(ev) =>
              onChange({ ...state, subset: (ev.target as HTMLSelectElement).value || null })
            }
          >
            <option value="">Any subset</option>
            {uniqueSubsets.map((s) => (
              <option value={s} key={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      )}

      <fieldset>
        <legend class="text-ink-700 text-sm font-medium">Cohesion</legend>
        <div class="mt-2 flex flex-wrap gap-2">
          {COHESIONS.map((c) => (
            <button
              type="button"
              key={c}
              onClick={() =>
                onChange({ ...state, cohesions: toggleIn(state.cohesions, c) as Cohesion[] })
              }
              class={`rounded-[var(--radius-chip)] border px-3 py-1 text-sm capitalize ${
                state.cohesions.includes(c)
                  ? 'text-ivory-50 border-teal-600 bg-teal-600'
                  : 'border-ivory-200 text-ink-700 bg-white hover:border-teal-600'
              }`}
              aria-pressed={state.cohesions.includes(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend class="text-ink-700 text-sm font-medium">Structure</legend>
        <div class="mt-2 flex flex-wrap gap-2">
          {STRUCTURES.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() =>
                onChange({ ...state, structures: toggleIn(state.structures, s) as Structure[] })
              }
              class={`rounded-[var(--radius-chip)] border px-3 py-1 text-sm capitalize ${
                state.structures.includes(s)
                  ? 'border-mustard-600 bg-mustard-400 text-ink-900'
                  : 'border-ivory-200 text-ink-700 hover:border-mustard-400 bg-white'
              }`}
              aria-pressed={state.structures.includes(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </fieldset>

      <label class="block">
        <span class="text-ink-700 text-sm font-medium">Intent</span>
        <input
          type="search"
          value={state.intent}
          onInput={(ev) => onChange({ ...state, intent: (ev.target as HTMLInputElement).value })}
          placeholder="e.g. physical readiness"
          class="border-ivory-200 mt-1 w-full rounded border bg-white px-3 py-2 text-base"
        />
      </label>

      <label class="block">
        <span class="text-ink-700 text-sm font-medium">Game name</span>
        <input
          type="search"
          value={state.name}
          onInput={(ev) => onChange({ ...state, name: (ev.target as HTMLInputElement).value })}
          placeholder="e.g. puppets"
          class="border-ivory-200 mt-1 w-full rounded border bg-white px-3 py-2 text-base"
        />
      </label>

      <button type="button" onClick={onReset} class="text-clay-500 text-sm underline">
        Reset filters
      </button>
    </div>
  );
}

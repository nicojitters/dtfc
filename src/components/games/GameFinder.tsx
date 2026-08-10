import { useEffect, useState } from 'preact/hooks';
import {
  EMPTY_STATE,
  filterGames,
  queryToState,
  stateToQuery,
  type FilterState,
  type GameLite,
} from '@/lib/gameFilter';
import { COMPETENCY_LABELS } from '@/lib/types';
import { IndexFilters } from './IndexFilters';

interface Props {
  games: GameLite[];
}

export default function GameFinder({ games }: Props) {
  const [state, setState] = useState<FilterState>(EMPTY_STATE);

  // Hydrate from URL on mount.
  useEffect(() => {
    setState(queryToState(new URLSearchParams(window.location.search)));
  }, []);

  // Reflect state back to URL without navigating.
  useEffect(() => {
    const q = stateToQuery(state);
    const url = new URL(window.location.href);
    url.search = q;
    window.history.replaceState({}, '', url.toString());
  }, [state]);

  const results = filterGames(games, state);

  return (
    <div class="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside class="rounded-[var(--radius-card)] bg-white p-5 shadow-[var(--shadow-soft)]">
        <IndexFilters state={state} onChange={setState} onReset={() => setState(EMPTY_STATE)} />
      </aside>

      <div>
        <div class="flex items-center justify-between" aria-live="polite">
          <p class="text-ink-500 text-sm">
            Showing <strong>{results.length}</strong> of {games.length} games
          </p>
        </div>

        <ul class="mt-4 grid gap-4 sm:grid-cols-2">
          {results.map((game) => (
            <li key={game.slug}>
              <a
                href={`/theatre-games/${game.slug}/`}
                class="border-ivory-200 hover:border-clay-500 block h-full rounded-[var(--radius-card)] border bg-white p-5 no-underline transition hover:shadow-[var(--shadow-soft)]"
              >
                <div class="flex flex-wrap items-center gap-2">
                  <span class="bg-clay-100 text-clay-700 rounded-[var(--radius-chip)] px-3 py-0.5 text-xs">
                    {COMPETENCY_LABELS[game.competency]}
                  </span>
                  {game.subset && (
                    <span class="rounded-[var(--radius-chip)] bg-teal-100 px-3 py-0.5 text-xs text-teal-800">
                      {game.subset}
                    </span>
                  )}
                  <span class="bg-mustard-200 text-ink-700 rounded-[var(--radius-chip)] px-3 py-0.5 text-xs">
                    {game.cohesion} cohesion
                  </span>
                  <span class="bg-ivory-200 text-ink-700 rounded-[var(--radius-chip)] px-3 py-0.5 text-xs">
                    {game.structure}
                  </span>
                </div>
                <h3 class="font-display mt-3 text-xl">{game.name}</h3>
                <p class="text-ink-500 mt-1 text-sm">{game.intent}</p>
                {game.sample && (
                  <p class="text-ink-300 mt-2 text-xs">Sample — pending final import</p>
                )}
              </a>
            </li>
          ))}
        </ul>

        {results.length === 0 && (
          <p class="border-ivory-200 bg-ivory-50 text-ink-500 mt-8 rounded-[var(--radius-card)] border border-dashed p-6 text-center text-sm">
            No games match. Try loosening a filter or resetting.
          </p>
        )}
      </div>
    </div>
  );
}

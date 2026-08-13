/** @jsxImportSource preact */
import { useState, useEffect } from 'preact/hooks';

interface Props {
  plays: string[];
}

interface Filters {
  plays: string[];
  genders: string[];
  registers: string[];
}

const ALL_GENDERS = ['female', 'male', 'nonbinary'];
const ALL_REGISTERS = ['comic', 'dramatic', 'villain', 'grief'];

function readFromUrl(): Filters {
  if (typeof window === 'undefined') return { plays: [], genders: [], registers: [] };
  const p = new URLSearchParams(window.location.search);
  return {
    plays: p.get('play')?.split(',').filter(Boolean) ?? [],
    genders: p.get('gender')?.split(',').filter(Boolean) ?? [],
    registers: p.get('register')?.split(',').filter(Boolean) ?? [],
  };
}

function writeToUrl(f: Filters) {
  const p = new URLSearchParams();
  if (f.plays.length) p.set('play', f.plays.join(','));
  if (f.genders.length) p.set('gender', f.genders.join(','));
  if (f.registers.length) p.set('register', f.registers.join(','));
  const qs = p.toString();
  window.history.replaceState(null, '', `${window.location.pathname}${qs ? '?' + qs : ''}`);
}

function toggle(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

export default function SoliloquyFilters({ plays }: Props) {
  const [f, setF] = useState<Filters>(() => readFromUrl());

  useEffect(() => {
    document.querySelectorAll<HTMLElement>('[data-soliloquy-card]').forEach((card) => {
      const p = card.getAttribute('data-play') ?? '';
      const g = card.getAttribute('data-gender') ?? '';
      const r = card.getAttribute('data-register') ?? '';
      const show =
        (f.plays.length === 0 || f.plays.includes(p)) &&
        (f.genders.length === 0 || f.genders.includes(g)) &&
        (f.registers.length === 0 || f.registers.includes(r));
      card.style.display = show ? '' : 'none';
    });
    writeToUrl(f);
  }, [f]);

  return (
    <div class="my-6 p-4 border border-ivory-200 rounded-[var(--radius-card)] bg-ivory-50">
      <p class="text-xs uppercase tracking-wider text-ink-500 mb-2">Filter soliloquies</p>
      <Strip
        label="Play"
        values={plays}
        selected={f.plays}
        onToggle={(v) => setF({ ...f, plays: toggle(f.plays, v) })}
      />
      <Strip
        label="Character gender"
        values={ALL_GENDERS}
        selected={f.genders}
        onToggle={(v) => setF({ ...f, genders: toggle(f.genders, v) })}
      />
      <Strip
        label="Register"
        values={ALL_REGISTERS}
        selected={f.registers}
        onToggle={(v) => setF({ ...f, registers: toggle(f.registers, v) })}
      />
      {f.plays.length + f.genders.length + f.registers.length > 0 && (
        <button
          type="button"
          class="text-sm underline mt-2 text-clay-500 hover:text-clay-700"
          onClick={() => setF({ plays: [], genders: [], registers: [] })}
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}

function Strip({
  label,
  values,
  selected,
  onToggle,
}: {
  label: string;
  values: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) {
  if (values.length === 0) return null;
  return (
    <div class="my-2">
      <span class="text-sm mr-2 text-ink-700">{label}:</span>
      {values.map((v) => (
        <button
          key={v}
          type="button"
          class={`inline-block text-xs px-3 py-1 mr-1 mb-1 rounded-[var(--radius-chip)] border transition ${
            selected.includes(v)
              ? 'bg-clay-500 text-white border-clay-500'
              : 'bg-ivory-50 border-ivory-200 text-ink-700 hover:border-clay-300'
          }`}
          onClick={() => onToggle(v)}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

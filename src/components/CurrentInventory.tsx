import { useState, useDeferredValue, useMemo } from 'react';

interface Tree {
  common: string;
  scientific: string;
  date: string;
  location: string;
  notes?: string;
  youtube?: string;
}

interface Props {
  items: Tree[];
}

function TreeDetail({ tree, onBack }: { tree: Tree; onBack: () => void }) {
  return (
    <div className="flex h-full flex-col px-6 py-4">
      <button
        onClick={onBack}
        className="text-stone-border hover:text-amber cursor-pointer self-start border-0 bg-transparent p-0 font-[inherit] text-xs tracking-wider transition-colors"
      >
        ◂ BACK
      </button>

      <div className="mt-4">
        <div className="gold text-sm tracking-widest">{tree.common.toUpperCase()}</div>
        <div className="text-stone-border mt-1 text-xs italic">{tree.scientific}</div>
      </div>

      <div className="mt-4 text-xs">
        <span className="text-stone-border">DATE</span> {tree.date} ·{' '}
        <span className="text-stone-border">LOCATION</span> {tree.location}
      </div>

      {tree.notes && (
        <div className="stone-scroll mt-3 flex-1 overflow-y-auto text-sm leading-[1.8]">
          {tree.notes.split('\n\n').map((paragraph, i) => (
            <p key={i} className={i > 0 ? 'mt-2' : ''}>
              {paragraph}
            </p>
          ))}
        </div>
      )}

      {tree.youtube && (
        <a
          href={tree.youtube}
          target="_blank"
          rel="noopener noreferrer"
          className="gold mt-3 inline-block text-xs tracking-wider underline decoration-dotted underline-offset-4 transition-opacity hover:opacity-75"
        >
          Watch on YouTube ▸
        </a>
      )}
    </div>
  );
}

export function CurrentInventory({ items }: Props) {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState<Tree | null>(null);
  const deferredQuery = useDeferredValue(query);

  const filtered = useMemo(() => {
    if (!deferredQuery) return items;
    const q = deferredQuery.toLowerCase();
    return items.filter(
      (t) => t.common.toLowerCase().includes(q) || t.scientific.toLowerCase().includes(q),
    );
  }, [items, deferredQuery]);

  return (
    <section>
      <div className="border-stone-groove text-stone-border border-b py-3 text-center text-sm tracking-widest">
        ─── CURRENT INVENTORY ───
      </div>

      <div className="h-[360px]">
        {selected ? (
          <TreeDetail tree={selected} onBack={() => setSelected(null)} />
        ) : (
          <>
            <div className="border-stone-groove border-b px-6 py-3">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="SEARCH TREES..."
                className="text-parchment placeholder-stone-border w-full bg-transparent text-xs tracking-wider outline-none"
              />
            </div>
            <div className="stone-scroll h-[320px] overflow-y-auto px-6 pt-2 pb-4">
              {filtered.map((tree) => (
                <button
                  key={tree.common}
                  onClick={() => setSelected(tree)}
                  className="text-parchment hover:text-amber flex w-full cursor-pointer items-baseline gap-2 border-0 bg-transparent py-2 text-left font-[inherit] [font-size:inherit] transition-colors"
                >
                  <span className="shrink-0 text-sm">{tree.common.toUpperCase()}</span>
                  <span className="border-stone-groove mb-[3px] min-w-2 flex-1 border-b-2 border-dotted" />
                  <span className="text-stone-border shrink-0 text-xs italic">
                    {tree.scientific}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

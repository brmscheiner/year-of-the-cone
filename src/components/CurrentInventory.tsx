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
        className="dim hover:text-amber cursor-pointer self-start text-xs tracking-wider transition-colors"
        style={{ background: 'none', border: 'none', fontFamily: 'inherit', padding: 0 }}
      >
        ◂ BACK
      </button>

      <div className="mt-4">
        <div className="gold text-sm tracking-widest">{tree.common.toUpperCase()}</div>
        <div className="dim mt-1 text-xs italic">{tree.scientific}</div>
      </div>

      <div className="mt-4 text-xs">
        <span className="dim">DATE</span> {tree.date} · <span className="dim">LOCATION</span>{' '}
        {tree.location}
      </div>

      {tree.notes && (
        <div
          className="stone-scroll mt-3 flex-1 overflow-y-auto text-sm"
          style={{ lineHeight: '1.8' }}
        >
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

      <div style={{ height: '360px' }}>
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
            <div
              className="stone-scroll overflow-y-auto px-6 pt-2 pb-4"
              style={{ height: '320px' }}
            >
              {filtered.map((tree) => (
                <button
                  key={tree.common}
                  onClick={() => setSelected(tree)}
                  className="stat-row text-parchment hover:text-amber w-full cursor-pointer text-left transition-colors"
                  style={{
                    background: 'none',
                    border: 'none',
                    fontFamily: 'inherit',
                    fontSize: 'inherit',
                    padding: '0.5rem 0',
                  }}
                >
                  <span className="shrink-0 text-sm">{tree.common.toUpperCase()}</span>
                  <span className="dot-leader" />
                  <span className="dim shrink-0 text-xs italic">{tree.scientific}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

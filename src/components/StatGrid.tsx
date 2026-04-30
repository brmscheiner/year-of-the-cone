import { StatCounter } from './StatCounter';

interface CounterItem {
  label: string;
  value: number;
  icon?: string;
}

interface Props {
  items: CounterItem[];
}

export function StatGrid({ items }: Props) {
  return (
    <section>
      <div className="border-stone-groove text-stone-border border-b py-3 text-center text-sm tracking-widest">
        ─── ADVENTURE LOG ───
      </div>
      <div className="border-stone-groove grid grid-cols-2 border-t border-l sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <div key={item.label} className="border-stone-groove border-r border-b">
            <StatCounter {...item} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}

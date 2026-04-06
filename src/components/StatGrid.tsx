import { StatCounter } from './StatCounter';

interface CounterItem {
  label: string;
  value: number;
  icon: string;
}

interface Props {
  items: CounterItem[];
}

export function StatGrid({ items }: Props) {
  return (
    <section className="mx-auto max-w-4xl px-4">
      <div className="mb-6 text-center text-[9px] tracking-widest text-gray-600">
        ── PLAYER STATS ──
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((item, i) => (
          <StatCounter key={item.label} {...item} index={i} />
        ))}
      </div>
    </section>
  );
}

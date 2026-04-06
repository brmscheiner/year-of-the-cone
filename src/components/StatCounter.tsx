interface Props {
  label: string;
  value: number;
  icon: string;
  index?: number;
}

const PANEL_CLASSES = ['stone-panel', 'stone-panel-blood', 'stone-panel-moss'];
const VALUE_CLASSES = ['glow-amber', 'glow-blood', 'glow-moss'];

export function StatCounter({ label, value, icon, index = 0 }: Props) {
  const panelClass = PANEL_CLASSES[index % PANEL_CLASSES.length];
  const valueClass = VALUE_CLASSES[index % VALUE_CLASSES.length];

  return (
    <div
      className={`${panelClass} count-in flex flex-col items-center gap-3 px-4 py-6`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <span className="text-3xl leading-none" role="img" aria-label={label}>
        {icon}
      </span>
      <span className={`${valueClass} text-2xl leading-none tracking-wider`}>
        {value.toLocaleString()}
      </span>
      <span className="text-center text-[8px] leading-relaxed tracking-widest text-[#7a6a52]">
        {label.toUpperCase()}
      </span>
    </div>
  );
}

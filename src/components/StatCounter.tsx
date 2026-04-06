interface Props {
  label: string;
  value: number;
  icon: string;
  index?: number;
}

// Cycle through neon border colors for visual variety
const BORDER_CLASSES = ['pixel-border', 'pixel-border-cyan', 'pixel-border-magenta'];
const VALUE_CLASSES = ['glow-green', 'glow-cyan', 'glow-magenta'];

export function StatCounter({ label, value, icon, index = 0 }: Props) {
  const borderClass = BORDER_CLASSES[index % BORDER_CLASSES.length];
  const valueClass = VALUE_CLASSES[index % VALUE_CLASSES.length];

  return (
    <div
      className={`${borderClass} count-in flex flex-col items-center gap-3 bg-[#0a0a1e] px-4 py-6`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <span className="text-3xl leading-none" role="img" aria-label={label}>
        {icon}
      </span>
      <span className={`${valueClass} text-2xl leading-none tracking-wider`}>
        {value.toLocaleString()}
      </span>
      <span className="text-center text-[8px] leading-relaxed tracking-widest text-gray-400">
        {label.toUpperCase()}
      </span>
    </div>
  );
}

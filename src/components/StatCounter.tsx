interface Props {
  label: string;
  value: number;
  icon?: string;
  index?: number;
}

export function StatCounter({ label, value, icon, index = 0 }: Props) {
  return (
    <div
      className="count-in flex flex-col items-center gap-2 px-4 py-6"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {icon && (
        <span className="text-2xl leading-none" role="img" aria-label={label}>
          {icon}
        </span>
      )}
      <span className="glow-amber text-xl leading-none tracking-wider">
        {value.toLocaleString()}
      </span>
      <span className="text-stone-border text-center text-sm leading-relaxed tracking-widest">
        {label.toUpperCase()}
      </span>
    </div>
  );
}

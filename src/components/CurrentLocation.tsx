interface Props {
  location: string;
  country: string;
}

export function CurrentLocation({ location, country }: Props) {
  return (
    <div className="stone-panel mx-auto mb-10 max-w-xl px-6 py-4 text-center">
      <div className="text-stone-border mb-2 text-sm tracking-widest">◈ CURRENT LOCATION ◈</div>
      <div className="flex items-center justify-center gap-3">
        <span className="glow-amber text-sm tracking-wider">
          {location.toUpperCase()}, {country.toUpperCase()}
        </span>
        <span className="blink text-amber-dim text-sm">_</span>
      </div>
    </div>
  );
}

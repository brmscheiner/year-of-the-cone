interface Props {
  location: string;
  country: string;
}

export function CurrentLocation({ location, country }: Props) {
  return (
    <div className="pixel-border-cyan mx-auto mb-10 max-w-xl bg-[#0a0a1e] px-6 py-4 text-center">
      <div className="mb-2 text-[9px] tracking-widest text-gray-500">CURRENT LOCATION</div>
      <div className="flex items-center justify-center gap-3">
        <span className="glow-cyan text-[13px] tracking-wider">
          {location.toUpperCase()}, {country.toUpperCase()}
        </span>
        <span className="blink glow-cyan text-[13px]">_</span>
      </div>
    </div>
  );
}

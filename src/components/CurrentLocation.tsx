interface Props {
  location: string;
  country: string;
}

export function CurrentLocation({ location, country }: Props) {
  return (
    <div className="stone-panel mx-auto mb-10 max-w-xl px-6 py-4 text-center">
      <div className="mb-2 text-[9px] tracking-widest text-[#5c4a2a]">◈ CURRENT LOCATION ◈</div>
      <div className="flex items-center justify-center gap-3">
        <span className="glow-amber text-[13px] tracking-wider">
          {location.toUpperCase()}, {country.toUpperCase()}
        </span>
        <span className="blink text-[13px] text-[#8b6914]">_</span>
      </div>
    </div>
  );
}

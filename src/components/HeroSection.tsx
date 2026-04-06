interface Props {
  title: string;
  tagline: string;
  travelerName: string;
}

export function HeroSection({ title, tagline, travelerName }: Props) {
  return (
    <header className="relative flex flex-col items-center justify-center px-4 py-16 text-center">
      {/* Status bar */}
      <div className="mb-8 flex items-center gap-4 text-[9px] text-[#7a6a52]">
        <span className="glow-amber">⚔ ADVENTURER</span>
        <span>·</span>
        <span>{travelerName.toUpperCase()}</span>
        <span>·</span>
        <span className="blink glow-blood">● QUEST ACTIVE</span>
      </div>

      {/* Title */}
      <h1
        className="glow-amber flicker mb-8 text-xl leading-relaxed tracking-widest sm:text-2xl md:text-3xl"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        {title}
      </h1>

      {/* Divider */}
      <div className="mb-6 flex items-center gap-3 text-[#5c4a2a]">
        <span>{'─'.repeat(6)}</span>
        <span className="text-[11px] text-[#8b6914]">✦</span>
        <span>{'─'.repeat(6)}</span>
      </div>

      {/* Tagline */}
      <p
        className="text-[11px] leading-loose tracking-widest text-[#7a6a52]"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        {tagline}
      </p>
    </header>
  );
}

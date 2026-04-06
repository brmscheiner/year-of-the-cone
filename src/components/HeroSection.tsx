interface Props {
  title: string;
  tagline: string;
  travelerName: string;
}

export function HeroSection({ title, tagline, travelerName }: Props) {
  return (
    <header className="relative flex flex-col items-center justify-center px-4 py-16 text-center">
      {/* Top bar */}
      <div className="mb-8 flex items-center gap-4 text-[10px] text-gray-500">
        <span className="glow-green">■ PLAYER 1</span>
        <span>·</span>
        <span>{travelerName.toUpperCase()}</span>
        <span>·</span>
        <span className="blink glow-cyan">● LIVE</span>
      </div>

      {/* Main title */}
      <h1
        className="glow-green mb-6 text-xl leading-relaxed tracking-widest sm:text-2xl md:text-3xl"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        {title}
      </h1>

      {/* Decorative divider */}
      <div className="mb-6 flex items-center gap-2 text-[10px] text-gray-600">
        {'▶'.repeat(3)}
        <span className="glow-magenta px-4 text-[11px]">INSERT COIN TO CONTINUE</span>
        {'◀'.repeat(3)}
      </div>

      {/* Tagline */}
      <p
        className="text-[11px] leading-loose tracking-widest text-gray-400"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        {tagline}
      </p>
    </header>
  );
}

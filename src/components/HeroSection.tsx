interface Props {
  title: string;
  tagline: string;
  travelerName: string;
}

export function HeroSection({ title, tagline, travelerName }: Props) {
  return (
    <header className="relative flex flex-col items-center justify-center px-4 py-16 text-center">
      {/* Status bar */}
      <div className="text-parchment-dim mb-8 flex items-center gap-4 text-sm">
        <span className="glow-amber">⚔ ADVENTURER</span>
        <span>·</span>
        <span>{travelerName.toUpperCase()}</span>
        <span>·</span>
        <span className="blink glow-blood">● QUEST ACTIVE</span>
      </div>

      {/* Title */}
      <h1 className="glow-amber flicker font-pixel mb-8 text-xl leading-relaxed tracking-widest sm:text-2xl md:text-3xl">
        {title}
      </h1>

      {/* Divider */}
      <div className="text-stone-border mb-6 flex items-center gap-3">
        <span>{'─'.repeat(6)}</span>
        <span className="text-amber-dim text-sm">✦</span>
        <span>{'─'.repeat(6)}</span>
      </div>

      {/* Tagline */}
      <p className="text-parchment-dim font-pixel text-sm leading-loose tracking-widest">
        <a
          href="https://www.caseyclapp.com/yearofthecone"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-parchment transition-colors"
        >
          {tagline}
        </a>
      </p>
    </header>
  );
}

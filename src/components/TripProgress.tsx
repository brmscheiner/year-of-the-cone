'use client';

interface Props {
  startDate: string;
  totalDays?: number;
}

export function TripProgress({ startDate, totalDays = 365 }: Props) {
  const start = new Date(startDate);
  const now = new Date();
  const elapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const currentDay = Math.min(Math.max(elapsed + 1, 1), totalDays);
  const fillPct = ((currentDay - 1) / totalDays) * 100;
  const fillWidth = `${fillPct}%`;

  return (
    <div className="stone-panel mx-auto mb-12 max-w-2xl px-6 py-6">
      <div className="mb-3 flex items-center justify-between text-[9px] text-[#5c4a2a]">
        <span>⏳ DAYS SURVIVED</span>
        <span className="glow-amber">
          {currentDay} / {totalDays}
        </span>
      </div>

      {/* Bar track */}
      <div
        className="relative mb-3 h-5 w-full bg-[#080608]"
        style={{ border: '2px solid #2a1f0e' }}
      >
        {/* Fill */}
        <div
          className="ember-pulse absolute inset-y-0 left-0 bg-[#8b6914] transition-all duration-1000"
          style={{ width: fillWidth, minWidth: fillPct > 0 ? '4px' : '0' }}
        />
        {/* Quarter marks */}
        {[25, 50, 75].map((tick) => (
          <div
            key={tick}
            className="absolute inset-y-0 w-px bg-[#2a1f0e]"
            style={{ left: `${tick}%` }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-[9px]">
        <span className="text-[#3a2a14]">DAY 1</span>
        <span className="text-[#5c4a2a]">{fillPct.toFixed(1)}% OF QUEST COMPLETE</span>
        <span className="text-[#3a2a14]">DAY {totalDays}</span>
      </div>
    </div>
  );
}

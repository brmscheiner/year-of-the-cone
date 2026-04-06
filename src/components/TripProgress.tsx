'use client';

interface Props {
  startDate: string;
  totalDays?: number;
}

export function TripProgress({ startDate, totalDays = 365 }: Props) {
  const start = new Date(startDate);
  const now = new Date();
  const elapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const days = Math.min(Math.max(elapsed, 0), totalDays);
  const pct = ((days / totalDays) * 100).toFixed(1);
  const fillWidth = `${(days / totalDays) * 100}%`;

  return (
    <div className="pixel-border mx-auto mb-12 max-w-2xl bg-[#0a0a1e] px-6 py-6">
      <div className="mb-3 flex items-center justify-between text-[9px] text-gray-500">
        <span>ADVENTURE PROGRESS</span>
        <span className="glow-green">{pct}% COMPLETE</span>
      </div>

      {/* Bar track */}
      <div
        className="relative mb-3 h-6 w-full bg-[#050510]"
        style={{ border: '2px solid #1a1a3e' }}
      >
        {/* Fill */}
        <div
          className="progress-glow absolute inset-y-0 left-0 bg-[#00f5ff] transition-all duration-1000"
          style={{ width: fillWidth }}
        />
        {/* Tick marks */}
        {[25, 50, 75].map((tick) => (
          <div
            key={tick}
            className="absolute inset-y-0 w-px bg-[#050510] opacity-60"
            style={{ left: `${tick}%` }}
          />
        ))}
      </div>

      <div className="flex items-center justify-between text-[9px]">
        <span className="text-gray-600">DAY 0</span>
        <span className="glow-cyan text-[11px]">
          DAY {days} / {totalDays}
        </span>
        <span className="text-gray-600">DAY {totalDays}</span>
      </div>
    </div>
  );
}

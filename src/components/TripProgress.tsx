interface Props {
  startDate: string;
  totalDays?: number;
  coneCount?: number;
  totalCones?: number;
}

export function TripProgress({
  startDate,
  totalDays = 365,
  coneCount = 0,
  totalCones = 111,
}: Props) {
  // Parse as local midnight to avoid UTC offset shifting the day count
  const [y, m, d] = startDate.split('-').map(Number);
  const start = new Date(y, m - 1, d);
  const now = new Date();
  const elapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const currentDay = Math.min(Math.max(elapsed + 1, 1), totalDays);
  const fillPct = ((currentDay - 1) / totalDays) * 100;
  const fillWidth = `${fillPct}%`;

  const coneFillPct = (coneCount / totalCones) * 100;

  return (
    <div className="flex flex-col gap-6 pt-4">
      {/* Cone Count */}
      <div>
        <div className="text-stone-border mb-3 flex items-center justify-between text-sm">
          <span>🌲 CONE COUNT</span>
          <span className="glow-amber">
            {coneCount} / {totalCones}
          </span>
        </div>
        <div className="border-stone-groove bg-stone-void relative mb-3 h-5 w-full border-2">
          <div
            className="ember-pulse bg-amber-dim absolute inset-y-0 left-0 transition-all duration-1000"
            style={{ width: `${coneFillPct}%`, minWidth: coneCount > 0 ? '4px' : '0' }}
          />
          {[25, 50, 75].map((tick) => (
            <div
              key={tick}
              className="bg-stone-groove absolute inset-y-0 w-px"
              style={{ left: `${tick}%` }}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-muted">0</span>
          <span className="text-stone-border">{coneFillPct.toFixed(1)}% COMPLETE</span>
          <span className="text-stone-muted">{totalCones} CONES</span>
        </div>
      </div>

      <hr className="border-stone-groove border-t" />

      {/* Days Survived */}
      <div>
        <div className="text-stone-border mb-3 flex items-center justify-between text-sm">
          <span>⏳ DAYS SURVIVED</span>
          <span className="glow-amber">
            {currentDay} / {totalDays}
          </span>
        </div>

        {/* Bar track */}
        <div className="border-stone-groove bg-stone-void relative mb-3 h-5 w-full border-2">
          {/* Fill */}
          <div
            className="ember-pulse bg-amber-dim absolute inset-y-0 left-0 transition-all duration-1000"
            style={{ width: fillWidth, minWidth: currentDay > 1 ? '4px' : '0' }}
          />
          {/* Quarter marks */}
          {[25, 50, 75].map((tick) => (
            <div
              key={tick}
              className="bg-stone-groove absolute inset-y-0 w-px"
              style={{ left: `${tick}%` }}
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-muted">DAY 1</span>
          <span className="text-stone-border">{fillPct.toFixed(1)}% COMPLETE</span>
          <span className="text-stone-muted">DAY {totalDays}</span>
        </div>
      </div>
    </div>
  );
}

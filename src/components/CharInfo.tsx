import type { ReactNode } from 'react';

interface Props {
  travelerName: string;
  location: string;
  country: string;
  startDate: string;
  totalDays?: number;
}

export function CharInfo({ travelerName, location, country, startDate, totalDays = 365 }: Props) {
  const [y, m, d] = startDate.split('-').map(Number);
  const start = new Date(y, m - 1, d);
  const now = new Date();
  const elapsed = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  const currentDay = Math.min(Math.max(elapsed + 1, 1), totalDays);

  const rows: { label: string; value: ReactNode; valueClass?: string }[] = [
    { label: 'NAME', value: travelerName.toUpperCase(), valueClass: 'gold' },
    { label: 'LOCATION', value: `${location.toUpperCase()}, ${country.toUpperCase()}` },
    {
      label: 'STATUS',
      value: (
        <span className="flex items-center gap-2">
          ACTIVE <span className="blink blood">●</span>
        </span>
      ),
    },
    { label: 'QUEST DAY', value: `${currentDay} / ${totalDays}`, valueClass: 'gold' },
  ];

  return (
    <div className="flex flex-col justify-center">
      {rows.map(({ label, value, valueClass }) => (
        <div key={label} className="stat-row">
          <span className="dim shrink-0 text-sm">{label}</span>
          <span className="dot-leader" />
          <span className={`shrink-0 text-base ${valueClass ?? ''}`}>{value}</span>
        </div>
      ))}
    </div>
  );
}

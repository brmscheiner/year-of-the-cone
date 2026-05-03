import { useState, useEffect, useRef, type ReactNode } from 'react';

interface Props {
  travelerName: string;
  location: string;
  country: string;
  startDate: string;
  totalDays?: number;
}

const SKILLS = [
  { label: 'TREE IDENTIFICATION', value: 90 },
  { label: 'NAVIGATION', value: 80 },
  { label: 'ENDURANCE', value: 70 },
  { label: 'FORAGING', value: 40 },
  { label: 'UKULELE', value: 10 },
  { label: 'CAMP COOKING', value: 80 },
  { label: 'PHOTOGRAPHY', value: 60 },
];

function SkillBar({ score }: { score: number }) {
  const filled = Math.round(score / 10);
  const color = score >= 80 ? '#2e7d32' : score >= 50 ? '#e07b2a' : '#c0392b';
  return (
    <span style={{ letterSpacing: '0.1em', fontSize: '0.75rem', color }}>
      {'█'.repeat(filled)}
      <span className="dim">{'░'.repeat(10 - filled)}</span>
    </span>
  );
}

function CharDialog({ travelerName, onClose }: { travelerName: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: 'rgba(0,0,0,0.7)' }}
    >
      <div
        ref={ref}
        className="stone-panel relative mx-4 w-full max-w-2xl overflow-hidden"
        style={{ fontFamily: '"Press Start 2P", monospace' }}
      >
        {/* Header */}
        <div className="border-stone-groove flex items-center justify-between border-b px-5 py-1">
          <span className="gold text-sm tracking-widest">{travelerName.toUpperCase()}</span>
          <button
            onClick={onClose}
            className="dim cursor-pointer p-3 text-base transition-colors hover:text-white"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 gap-0 md:grid-cols-[1fr_1fr]">
          {/* Col 1: portrait */}
          <div className="border-stone-groove flex items-center justify-center border-b p-6 md:border-r md:border-b-0">
            <img
              src="/images/casey.jpg"
              alt="Casey"
              style={{
                width: 175,
                height: 275,
                objectFit: 'cover',
                border: '2px solid var(--color-stone-groove)',
              }}
            />
          </div>

          {/* Col 2: skills */}
          <div className="flex flex-col justify-center px-5 py-8">
            <div className="dim mb-3 tracking-widest" style={{ fontSize: '0.65rem' }}>
              SKILL SHEET
            </div>
            {SKILLS.map(({ label, value }) => (
              <div
                key={label}
                className="stat-row"
                style={{ paddingTop: '0.4rem', paddingBottom: '0.4rem' }}
              >
                <span className="dim shrink-0" style={{ fontSize: '0.65rem' }}>
                  {label}
                </span>
                <span className="dot-leader" />
                <SkillBar score={value} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function CharInfo({ travelerName, location, country }: Props) {
  const [open, setOpen] = useState(false);

  const rows: { label: string; value: ReactNode; valueClass?: string }[] = [
    {
      label: 'NAME',
      value: (
        <button
          onClick={() => setOpen(true)}
          className="gold cursor-pointer underline decoration-dotted underline-offset-4 transition-opacity hover:opacity-75"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
            fontFamily: 'inherit',
            fontSize: 'inherit',
          }}
        >
          {travelerName.toUpperCase()}
        </button>
      ),
    },
    { label: 'LOCATION', value: `${location.toUpperCase()}, ${country.toUpperCase()}` },
    {
      label: 'STATUS',
      value: (
        <span className="flex items-center gap-2">
          ACTIVE <span className="blink blood">●</span>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col justify-center">
        {rows.map(({ label, value, valueClass }) => (
          <div key={label} className="stat-row">
            <span className="dim shrink-0 text-sm">{label}</span>
            <span className="dot-leader" />
            <span className={`shrink-0 text-base ${valueClass ?? ''}`}>{value}</span>
          </div>
        ))}
      </div>

      {open && <CharDialog travelerName={travelerName} onClose={() => setOpen(false)} />}
    </>
  );
}

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { SuggestionBox } from './SuggestionBox';

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
  const colorClass =
    score >= 80 ? 'text-[#2e7d32]' : score >= 50 ? 'text-[#e07b2a]' : 'text-[#cc3333]';
  return (
    <span className={`text-xs tracking-wider ${colorClass}`}>
      {'█'.repeat(filled)}
      <span className="text-stone-border">{'░'.repeat(10 - filled)}</span>
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div
        ref={ref}
        className="stone-panel font-pixel relative mx-4 w-full max-w-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="border-stone-groove flex items-center justify-between border-b px-5 py-1">
          <span className="gold text-sm tracking-widest">{travelerName.toUpperCase()}</span>
          <button
            onClick={onClose}
            className="text-stone-border cursor-pointer p-3 text-base transition-colors hover:text-white"
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
              className="border-stone-groove h-[275px] w-[175px] border-2 object-cover"
            />
          </div>

          {/* Col 2: skills */}
          <div className="flex flex-col justify-center px-5 py-8">
            <div className="text-stone-border mb-3 text-[0.65rem] tracking-widest">SKILL SHEET</div>
            {SKILLS.map(({ label, value }) => (
              <div key={label} className="flex items-baseline gap-2 py-[0.4rem]">
                <span className="text-stone-border shrink-0 text-[0.65rem]">{label}</span>
                <span className="border-stone-groove mb-[3px] min-w-2 flex-1 border-b-2 border-dotted" />
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
          className="gold cursor-pointer border-0 bg-transparent p-0 font-[inherit] [font-size:inherit] underline decoration-dotted underline-offset-4 transition-opacity hover:opacity-75"
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
          ACTIVE <span className="blink text-blood">●</span>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="flex flex-col justify-center">
        {rows.map(({ label, value, valueClass }) => (
          <div key={label} className="flex items-center gap-3 py-2">
            <span className="text-stone-border shrink-0 text-sm">{label}</span>
            <span className="border-stone-groove min-w-2 flex-1 border-b-2 border-dotted" />
            <span className={`shrink-0 text-sm ${valueClass ?? ''}`}>{value}</span>
          </div>
        ))}

        <SuggestionBox />
      </div>

      {open && <CharDialog travelerName={travelerName} onClose={() => setOpen(false)} />}
    </>
  );
}

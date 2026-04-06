interface SocialLinks {
  instagram: string;
  tiktok: string;
  youtube: string;
  patreon: string;
  substack: string;
  gofundme: string;
}

interface Props {
  links: SocialLinks;
}

const SOCIAL = [
  { key: 'instagram' as const, label: 'INSTAGRAM', icon: '📸' },
  { key: 'tiktok' as const, label: 'TIKTOK', icon: '🎬' },
  { key: 'youtube' as const, label: 'YOUTUBE', icon: '▶' },
  { key: 'patreon' as const, label: 'PATREON', icon: '🛡' },
  { key: 'substack' as const, label: 'SUBSTACK', icon: '📜' },
  { key: 'gofundme' as const, label: 'GOFUNDME', icon: '⚗' },
];

export function SocialFooter({ links }: Props) {
  const active = SOCIAL.filter(({ key }) => links[key]);

  if (active.length === 0) return null;

  return (
    <footer className="mt-20 px-4 pb-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-center text-[9px] tracking-widest text-[#5c4a2a]">
          ─── FOLLOW THE QUEST ───
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {active.map(({ key, label, icon }) => (
            <a
              key={key}
              href={links[key]}
              target="_blank"
              rel="noopener noreferrer"
              className="stone-panel px-4 py-3 text-[9px] tracking-widest text-[#7a6a52] transition-colors duration-150 hover:text-[#d4a853]"
            >
              <span className="mr-2">{icon}</span>
              {label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

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

const SOCIAL: { key: keyof SocialLinks; label: string; icon: string; fallback: string }[] = [
  { key: 'instagram', label: 'INSTAGRAM', icon: '📸', fallback: '#' },
  { key: 'tiktok', label: 'TIKTOK', icon: '🎬', fallback: '#' },
  { key: 'youtube', label: 'YOUTUBE', icon: '▶', fallback: '#' },
  { key: 'patreon', label: 'PATREON', icon: '🛡', fallback: '#' },
  { key: 'substack', label: 'SUBSTACK', icon: '📜', fallback: '#' },
  { key: 'gofundme', label: 'GOFUNDME', icon: '⚗', fallback: '#' },
];

export function SocialFooter({ links }: Props) {
  return (
    <footer className="mt-20 px-4 pb-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 text-center text-[9px] tracking-widest text-[#5c4a2a]">
          ─── FOLLOW THE QUEST ───
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {SOCIAL.map(({ key, label, icon, fallback }) => (
            <a
              key={key}
              href={links[key] || fallback}
              target={links[key] ? '_blank' : undefined}
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

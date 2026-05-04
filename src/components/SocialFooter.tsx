interface SocialLinks {
  instagram: string;
  tiktok: string;
  youtube: string;
  patreon: string;
  substack: string;
  coneClub: string;
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
  { key: 'coneClub', label: 'CONE CLUB', icon: '🌲', fallback: '#' },
  { key: 'gofundme', label: 'GOFUNDME', icon: '⚗', fallback: '#' },
];

export function SocialFooter({ links }: Props) {
  return (
    <footer className="mt-8 px-4 pb-16">
      <div className="mx-auto max-w-5xl">
        <div className="text-stone-border mb-5 text-center text-base tracking-widest">
          ─── FOLLOW THE QUEST ───
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {SOCIAL.map(({ key, label, icon, fallback }) => (
            <a
              key={key}
              href={links[key] || fallback}
              target={links[key] ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="text-amber text-base tracking-widest transition-[text-shadow] duration-300 hover:[text-shadow:0_0_8px_rgba(212,168,83,0.7),0_0_20px_rgba(212,168,83,0.3)]"
            >
              <span className="mr-2">{icon}</span>
              <span className="decoration-dotted underline-offset-4 hover:underline">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

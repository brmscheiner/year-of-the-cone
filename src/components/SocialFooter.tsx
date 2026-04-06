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
    <footer className="mt-8 px-4 pb-16">
      <div className="mx-auto max-w-5xl">
        <div className="text-stone-muted mb-4 text-center text-sm tracking-widest">
          ─── FOLLOW THE QUEST ───
        </div>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
          {SOCIAL.map(({ key, label, icon, fallback }) => (
            <a
              key={key}
              href={links[key] || fallback}
              target={links[key] ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="text-stone-border hover:text-amber text-base tracking-widest transition-colors duration-150"
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

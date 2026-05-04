import type { ReactNode } from 'react';
import { Camera } from 'pixelarticons/react/Camera';
import { Clapperboard } from 'pixelarticons/react/Clapperboard';
import { Play } from 'pixelarticons/react/Play';
import { Shield } from 'pixelarticons/react/Shield';
import { Script } from 'pixelarticons/react/Script';
import { TreePine } from 'pixelarticons/react/TreePine';
import { Coins } from 'pixelarticons/react/Coins';

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

const SOCIAL: { key: keyof SocialLinks; label: string; icon: ReactNode; fallback: string }[] = [
  {
    key: 'instagram',
    label: 'INSTAGRAM',
    icon: <Camera className="inline h-5 w-5" />,
    fallback: '#',
  },
  {
    key: 'tiktok',
    label: 'TIKTOK',
    icon: <Clapperboard className="inline h-5 w-5" />,
    fallback: '#',
  },
  { key: 'youtube', label: 'YOUTUBE', icon: <Play className="inline h-5 w-5" />, fallback: '#' },
  { key: 'patreon', label: 'PATREON', icon: <Shield className="inline h-5 w-5" />, fallback: '#' },
  {
    key: 'substack',
    label: 'SUBSTACK',
    icon: <Script className="inline h-5 w-5" />,
    fallback: '#',
  },
  {
    key: 'coneClub',
    label: 'CONE CLUB',
    icon: <TreePine className="inline h-5 w-5" />,
    fallback: '#',
  },
  { key: 'gofundme', label: 'GOFUNDME', icon: <Coins className="inline h-5 w-5" />, fallback: '#' },
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

export type ThemeKey = 'midnight' | 'blossom' | 'sage';

export const THEMES: Record<ThemeKey, {
  key: ThemeKey;
  name: string;
  accent: string;
  swatch: string;
  // tailwind-safe inline styles applied to the root container
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  glow1: string;
  glow2: string;
  ring: string;
  buttonPrimary: string;
  buttonPrimaryText: string;
  buttonGhost: string;
  focusCardBg: string;
  focusCardBorder: string;
  habitDone: string;
  capsuleActive: string;
  inputBg: string;
}>= {
  midnight: {
    key: 'midnight',
    name: 'Midnight Sanctuary',
    accent: '#a78bfa',
    swatch: 'linear-gradient(135deg,#0a0a0f,#312e81)',
    bg: 'radial-gradient(ellipse at top,#13131f 0%,#0a0a0f 55%)',
    surface: 'bg-black/40 border-white/10',
    surfaceAlt: 'bg-white/[0.03] border-white/5',
    border: 'border-white/10',
    text: 'text-white',
    textMuted: 'text-white/55',
    glow1: 'rgba(167,139,250,0.18)',
    glow2: 'rgba(34,211,238,0.14)',
    ring: 'ring-violet-400/40',
    buttonPrimary: 'bg-violet-500/90 hover:bg-violet-400 text-white',
    buttonPrimaryText: 'text-white',
    buttonGhost: 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10',
    focusCardBg: 'bg-black/50',
    focusCardBorder: 'border-violet-400/30',
    habitDone: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/40',
    capsuleActive: 'bg-violet-500/25 text-violet-200 border-violet-400/50',
    inputBg: 'bg-white/5 border-white/10 text-white placeholder-white/30',
  },
  blossom: {
    key: 'blossom',
    name: 'Pastel Blossom',
    accent: '#f472b6',
    swatch: 'linear-gradient(135deg,#fff5f7,#fbcfe8)',
    bg: 'radial-gradient(ellipse at top,#fff1f5 0%,#fde8ef 55%,#f9d5e4 100%)',
    surface: 'bg-white/70 border-pink-200/60',
    surfaceAlt: 'bg-pink-50/80 border-pink-200/50',
    border: 'border-pink-200/60',
    text: 'text-rose-900',
    textMuted: 'text-rose-400',
    glow1: 'rgba(244,114,182,0.22)',
    glow2: 'rgba(196,181,253,0.22)',
    ring: 'ring-pink-300/50',
    buttonPrimary: 'bg-pink-400 hover:bg-pink-300 text-white',
    buttonPrimaryText: 'text-white',
    buttonGhost: 'bg-pink-100/70 hover:bg-pink-200/70 text-rose-700 border-pink-200',
    focusCardBg: 'bg-white/80',
    focusCardBorder: 'border-pink-300/60',
    habitDone: 'bg-pink-200/60 text-pink-700 border-pink-300',
    capsuleActive: 'bg-pink-300/40 text-pink-700 border-pink-400/60',
    inputBg: 'bg-white/70 border-pink-200 text-rose-900 placeholder-rose-300',
  },
  sage: {
    key: 'sage',
    name: 'Sage Matcha',
    accent: '#65a30d',
    swatch: 'linear-gradient(135deg,#f0fdf4,#84cc16)',
    bg: 'radial-gradient(ellipse at top,#f4f7f2 0%,#e6ede0 55%,#d8e4cf 100%)',
    surface: 'bg-white/70 border-lime-200/60',
    surfaceAlt: 'bg-lime-50/80 border-lime-200/50',
    border: 'border-lime-200/60',
    text: 'text-stone-800',
    textMuted: 'text-stone-500',
    glow1: 'rgba(101,163,13,0.16)',
    glow2: 'rgba(132,204,22,0.14)',
    ring: 'ring-lime-400/40',
    buttonPrimary: 'bg-lime-600 hover:bg-lime-500 text-white',
    buttonPrimaryText: 'text-white',
    buttonGhost: 'bg-lime-100/70 hover:bg-lime-200/70 text-lime-800 border-lime-200',
    focusCardBg: 'bg-white/80',
    focusCardBorder: 'border-lime-400/50',
    habitDone: 'bg-lime-200/60 text-lime-800 border-lime-300',
    capsuleActive: 'bg-lime-300/40 text-lime-800 border-lime-500/50',
    inputBg: 'bg-white/70 border-lime-200 text-stone-800 placeholder-stone-400',
  },
};

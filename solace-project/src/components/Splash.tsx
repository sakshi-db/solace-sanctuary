import { useEffect, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

const LINES = [
  'Initializing Solace Sanctuary...',
  'Calibrating energy levels...',
  'Warming up the focus engine...',
  'Ready when you are.',
];

export default function Splash({ onEnter }: { onEnter: () => void }) {
  const [typed, setTyped] = useState('');
  const [lineIdx, setLineIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (lineIdx >= LINES.length) return;
    const current = LINES[lineIdx];
    if (charIdx <= current.length) {
      const id = setTimeout(() => {
        setTyped(current.slice(0, charIdx));
        setCharIdx((c) => c + 1);
      }, 28);
      return () => clearTimeout(id);
    }
    const id = setTimeout(() => {
      setLineIdx((i) => i + 1);
      setCharIdx(0);
      setTyped('');
    }, 600);
    return () => clearTimeout(id);
  }, [charIdx, lineIdx]);

  const allDone = lineIdx >= LINES.length;

  const handleEnter = () => {
    setLeaving(true);
    setTimeout(onEnter, 700);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-700 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ background: 'radial-gradient(ellipse at center,#13131f 0%,#06060a 70%)' }}
    >
      {/* ambient glows */}
      <div
        className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full blur-3xl"
        style={{ background: 'rgba(167,139,250,0.25)' }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-10 h-72 w-72 rounded-full blur-3xl"
        style={{ background: 'rgba(34,211,238,0.18)' }}
      />

      <div className="relative flex flex-col items-center gap-7 px-6 text-center">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-2xl bg-violet-500/30" />
          <div className="relative grid h-20 w-20 place-items-center rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <Sparkles className="h-9 w-9 text-violet-300" />
          </div>
        </div>

        <div className="h-6 font-mono text-sm tracking-wide text-cyan-200/80">
          {typed}
          <span className="ml-0.5 inline-block w-2 animate-pulse text-violet-300">▋</span>
        </div>

        <div className="flex gap-1.5">
          {LINES.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                i < lineIdx ? 'bg-violet-400' : i === lineIdx ? 'bg-violet-400/70' : 'bg-white/15'
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleEnter}
          disabled={!allDone}
          className={`group mt-4 inline-flex items-center gap-2 rounded-full px-7 py-3 text-sm font-medium transition-all ${
            allDone
              ? 'bg-violet-500/90 text-white hover:bg-violet-400 hover:shadow-[0_0_30px_rgba(167,139,250,0.5)]'
              : 'cursor-not-allowed bg-white/5 text-white/30'
          }`}
        >
          Enter Sanctuary
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
}

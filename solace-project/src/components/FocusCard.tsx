import { Check, Split, SkipForward, RefreshCw } from 'lucide-react';
import type { Task, EnergyLevel } from '@/lib/supabase';
import { THEMES } from '@/lib/themes';

type Theme = (typeof THEMES)[keyof typeof THEMES];

export default function FocusCard({
  task,
  theme,
  energy,
  onComplete,
  onBreakDown,
  onSkip,
  onRefill,
}: {
  task: Task | null;
  theme: Theme;
  energy: EnergyLevel;
  onComplete: () => void;
  onBreakDown: () => void;
  onSkip: () => void;
  onRefill: () => void;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border ${theme.focusCardBorder} ${theme.focusCardBg} p-7 backdrop-blur-2xl transition-all md:p-9`}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full blur-3xl"
        style={{ background: theme.glow1 }}
      />
      <div className="relative flex flex-col items-center text-center">
        <span
          className={`mb-4 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
            theme === THEMES.midnight
              ? 'border-white/10 bg-white/5 text-white/60'
              : 'border-black/10 bg-black/5 text-black/60'
          }`}
        >
          {energy === 'zombie' ? 'Zombie-friendly step' : energy === 'high' ? 'High-energy focus' : 'One next step'}
        </span>

        {task ? (
          <>
            <p
              className={`max-w-md text-balance text-2xl font-semibold leading-snug md:text-3xl ${
                theme === THEMES.midnight ? 'text-white' : 'text-stone-900'
              }`}
            >
              {task.title}
            </p>
            <p className={`mt-3 text-sm ${theme.textMuted}`}>
              {task.category === 'college'
                ? 'College / Exams'
                : task.category === 'personal'
                ? 'Personal Skills'
                : 'Work'}{' '}
              · {task.is_micro ? '2-minute micro-step' : 'standard task'}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={onComplete}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${theme.buttonPrimary}`}
              >
                <Check className="h-4 w-4" /> Mark Complete
              </button>
              <button
                onClick={onBreakDown}
                className={`inline-flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-medium transition-all ${theme.buttonGhost}`}
              >
                <Split className="h-4 w-4" /> I'm Too Tired / Break It Down
              </button>
              <button
                onClick={onSkip}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all ${theme.buttonGhost}`}
                title="Skip to the next task"
              >
                <SkipForward className="h-4 w-4" /> Skip
              </button>
            </div>
          </>
        ) : (
          <>
            <p
              className={`text-2xl font-semibold md:text-3xl ${
                theme === THEMES.midnight ? 'text-white' : 'text-stone-900'
              }`}
            >
              All clear for now.
            </p>
            <p className={`mt-3 text-sm ${theme.textMuted}`}>
              No tasks left for today. Rest, or refill the focus queue from your inbox.
            </p>
            <button
              onClick={onRefill}
              className={`mt-6 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-all ${theme.buttonPrimary}`}
            >
              <RefreshCw className="h-4 w-4" /> Refill from Inbox
            </button>
          </>
        )}
      </div>
    </div>
  );
}

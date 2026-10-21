import { useState } from 'react';
import { Wand2, Loader2, BookOpen, CheckCircle2, ListTodo } from 'lucide-react';
import { THEMES } from '@/lib/themes';
import { parseMindDump, type ParsedMindDump } from '@/lib/mindDump';

type Theme = (typeof THEMES)[keyof typeof THEMES];

export default function MindDump({
  theme,
  onSync,
}: {
  theme: Theme;
  onSync: (parsed: ParsedMindDump, raw: string) => Promise<void>;
}) {
  const [raw, setRaw] = useState('');
  const [preview, setPreview] = useState<ParsedMindDump | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const handleAnalyze = () => {
    if (!raw.trim()) return;
    setPreview(parseMindDump(raw));
  };

  const handleSync = async () => {
    if (!preview) return;
    setBusy(true);
    try {
      await onSync(preview, raw);
      setDone(true);
      setRaw('');
      setPreview(null);
      setTimeout(() => setDone(false), 2500);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`rounded-3xl border ${theme.border} ${theme.surface} p-5 backdrop-blur-2xl md:p-6`}>
      <div className="mb-3 flex items-center gap-2">
        <Wand2 className="h-5 w-5" style={{ color: theme.accent }} />
        <h3 className={`text-lg font-semibold ${theme.text}`}>Mind Dump & Auto-Tracker</h3>
      </div>
      <p className={`mb-4 text-sm ${theme.textMuted}`}>
        Paste messy notes, voice transcripts, or study thoughts. We'll sort them into a journal entry,
        check off habits, and queue tomorrow's tasks.
      </p>

      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="e.g. Revised BST in Java, drank 2L water, need to submit DBMS lab report tomorrow. Also did a 20 min walk."
        rows={5}
        className={`w-full resize-none rounded-2xl border p-4 text-sm leading-relaxed outline-none transition-all focus:ring-2 ${theme.ring} ${theme.inputBg}`}
      />

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          onClick={handleAnalyze}
          disabled={!raw.trim()}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
            raw.trim() ? theme.buttonGhost : 'cursor-not-allowed opacity-40'
          }`}
        >
          <Wand2 className="h-4 w-4" /> Analyze
        </button>
        {preview && (
          <button
            onClick={handleSync}
            disabled={busy}
            className={`inline-flex items-center gap-2 rounded-xl px-5 py-2 text-sm font-semibold transition-all ${theme.buttonPrimary}`}
          >
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            {busy ? 'Syncing...' : 'Confirm & Auto-Log'}
          </button>
        )}
        {done && (
          <span className={`inline-flex items-center gap-1.5 text-sm ${theme.textMuted}`}>
            <CheckCircle2 className="h-4 w-4" /> Logged successfully
          </span>
        )}
      </div>

      {preview && (
        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <PreviewPanel
            theme={theme}
            icon={<BookOpen className="h-4 w-4" />}
            title="Journal Entry"
            tone="journal"
          >
            <p className="line-clamp-5 text-xs leading-relaxed opacity-80">{preview.journalSummary}</p>
          </PreviewPanel>
          <PreviewPanel
            theme={theme}
            icon={<CheckCircle2 className="h-4 w-4" />}
            title="Habits Checked"
            tone="habits"
          >
            <div className="flex flex-col gap-1.5 text-xs">
              <HabitChip label="Hydration" on={preview.habits.hydration} />
              <HabitChip label="DSA / Study" on={preview.habits.dsa} />
              <HabitChip label="Workout" on={preview.habits.workout} />
            </div>
          </PreviewPanel>
          <PreviewPanel
            theme={theme}
            icon={<ListTodo className="h-4 w-4" />}
            title="Tomorrow's Tasks"
            tone="tasks"
          >
            {preview.tasks.length ? (
              <ul className="flex flex-col gap-1 text-xs opacity-80">
                {preview.tasks.map((t, i) => (
                  <li key={i} className="line-clamp-2">
                    · {t}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs opacity-60">No action items detected.</p>
            )}
          </PreviewPanel>
        </div>
      )}
    </div>
  );
}

function PreviewPanel({
  theme,
  icon,
  title,
  children,
}: {
  theme: Theme;
  icon: React.ReactNode;
  title: string;
  tone: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl border ${theme.border} ${theme.surfaceAlt} p-3`}>
      <div className={`mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide ${theme.textMuted}`}>
        {icon} {title}
      </div>
      {children}
    </div>
  );
}

function HabitChip({ label, on }: { label: string; on: boolean }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 ${
        on ? 'border-emerald-400/40 bg-emerald-400/15 text-emerald-300' : 'border-white/10 bg-white/5 text-white/40'
      }`}
    >
      {on ? <CheckCircle2 className="h-3 w-3" /> : <span className="h-3 w-3 rounded-full border border-current" />}
      {label}
    </span>
  );
}

import { useEffect, useMemo, useState, useCallback } from 'react';
import { Battery, Zap, BatteryLow, Palette, Moon, Flower2, Leaf, Sparkles, Droplets, Code, Dumbbell } from 'lucide-react';
import Splash from '@/components/Splash';
import FocusCard from '@/components/FocusCard';
import MindDump from '@/components/MindDump';
import TaskInbox from '@/components/TaskInbox';
import { THEMES, type ThemeKey } from '@/lib/themes';
import { supabase, type Task, type JournalEntry, type Habit, type EnergyLevel } from '@/lib/supabase';
import { parseMindDump, type ParsedMindDump } from '@/lib/mindDump';

export default function App() {
  const [entered, setEntered] = useState(false);
  const [themeKey, setThemeKey] = useState<ThemeKey>('midnight');
  const [energy, setEnergy] = useState<EnergyLevel>('normal');
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [journal, setJournal] = useState<JournalEntry[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [focusId, setFocusId] = useState<string | null>(null);

  const theme = THEMES[themeKey];
  const todayStr = new Date().toISOString().slice(0, 10);

  const load = useCallback(async () => {
    const [t, j, h] = await Promise.all([
      supabase.from('tasks').select('*').order('created_at', { ascending: true }),
      supabase.from('journal_entries').select('*').order('created_at', { ascending: false }).limit(30),
      supabase.from('habits').select('*').order('habit_date', { ascending: false }),
    ]);
    if (t.data) setTasks(t.data as Task[]);
    if (j.data) setJournal(j.data as JournalEntry[]);
    if (h.data) setHabits(h.data as Habit[]);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const todayTasks = useMemo(
    () => tasks.filter((t) => t.target_day === 'today' && !t.completed),
    [tasks]
  );
  const focusTask = useMemo(
    () => tasks.find((t) => t.id === focusId && !t.completed) ?? todayTasks[0] ?? null,
    [tasks, focusId, todayTasks]
  );

  const addTask = async (title: string, category: Task['category'], target_day: Task['target_day']) => {
    const { data } = await supabase
      .from('tasks')
      .insert({ title, category, target_day })
      .select()
      .single();
    if (data) setTasks((p) => [...p, data as Task]);
  };

  const toggleTask = async (task: Task) => {
    const completed = !task.completed;
    const { data } = await supabase.from('tasks').update({ completed }).eq('id', task.id).select().single();
    if (data) {
      setTasks((p) => p.map((t) => (t.id === task.id ? (data as Task) : t)));
      if (focusId === task.id && completed) setFocusId(null);
    }
  };

  const deleteTask = async (id: string) => {
    await supabase.from('tasks').delete().eq('id', id);
    setTasks((p) => p.filter((t) => t.id !== id));
    if (focusId === id) setFocusId(null);
  };

  const completeFocus = () => focusTask && toggleTask(focusTask);

  const breakDownFocus = async () => {
    if (!focusTask) return;
    const microTitle = `${focusTask.title} — 2-min start: just open it & spend 2 minutes`;
    const { data } = await supabase
      .from('tasks')
      .insert({ title: microTitle, category: focusTask.category, target_day: 'today', is_micro: true, is_focus: true })
      .select()
      .single();
    if (data) {
      setTasks((p) => [...p, data as Task]);
      setFocusId(data.id);
    }
  };

  const skipFocus = () => {
    const idx = todayTasks.findIndex((t) => t.id === (focusTask?.id ?? ''));
    const next = todayTasks[idx + 1];
    setFocusId(next ? next.id : null);
  };

  const refillFocus = () => setFocusId(null);

  const syncMindDump = async (parsed: ParsedMindDump, raw: string) => {
    // 1. journal entry
    const { error: jErr } = await supabase.from('journal_entries').insert({ content: parsed.journalSummary });
    if (jErr) console.error(jErr);

    // 2. habits — upsert for today
    const habitMap: { key: string; name: string }[] = [
      { key: 'hydration', name: 'Hydration' },
      { key: 'dsa', name: 'DSA / Study' },
      { key: 'workout', name: 'Workout' },
    ];
    for (const h of habitMap) {
      const on = parsed.habits[h.key as keyof typeof parsed.habits];
      if (on) {
        const existing = habits.find((x) => x.name === h.name && x.habit_date === todayStr);
        if (existing) {
          await supabase.from('habits').update({ completed: true }).eq('id', existing.id);
        } else {
          await supabase.from('habits').insert({ name: h.name, habit_date: todayStr, completed: true });
        }
      }
    }

    // 3. tomorrow tasks
    const newTasks: Task[] = [];
    for (const title of parsed.tasks) {
      const { data } = await supabase
        .from('tasks')
        .insert({ title, category: 'college', target_day: 'tomorrow' })
        .select()
        .single();
      if (data) newTasks.push(data as Task);
    }

    await load();
    void raw;
  };

  const energyPresets: { key: EnergyLevel; label: string; icon: React.ReactNode; sub: string }[] = [
    { key: 'high', label: 'High Energy', icon: <Battery className="h-4 w-4" />, sub: '100%' },
    { key: 'normal', label: 'Normal', icon: <Zap className="h-4 w-4" />, sub: '60%' },
    { key: 'zombie', label: 'Zombie Mode', icon: <BatteryLow className="h-4 w-4" />, sub: '20%' },
  ];

  const handleEnergy = (level: EnergyLevel) => {
    setEnergy(level);
    if (level === 'zombie') {
      // downscale: append gentle micro-tasks if none exist
      const hasGentle = tasks.some(
        (t) => t.target_day === 'today' && t.is_micro && /stretch|review|easy|gentle/i.test(t.title)
      );
      if (!hasGentle) {
        addTask('10-minute gentle stretching', 'personal', 'today');
        addTask('Review 1 easy DSA snippet (no solving)', 'college', 'today');
      }
    }
  };

  const themeOptions: { key: ThemeKey; name: string; icon: React.ReactNode }[] = [
    { key: 'midnight', name: 'Midnight Sanctuary', icon: <Moon className="h-4 w-4" /> },
    { key: 'blossom', name: 'Pastel Blossom', icon: <Flower2 className="h-4 w-4" /> },
    { key: 'sage', name: 'Sage Matcha', icon: <Leaf className="h-4 w-4" /> },
  ];

  const completedToday = tasks.filter((t) => t.target_day === 'today' && t.completed).length;
  const totalToday = tasks.filter((t) => t.target_day === 'today').length;
  const habitIcons = [
    { name: 'Hydration', icon: <Droplets className="h-3.5 w-3.5" /> },
    { name: 'DSA / Study', icon: <Code className="h-3.5 w-3.5" /> },
    { name: 'Workout', icon: <Dumbbell className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className={`min-h-screen transition-colors duration-500 ${theme.text}`} style={{ background: theme.bg }}>
      {!entered && <Splash onEnter={() => setEntered(true)} />}

      {/* ambient glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div
          className="absolute -top-40 left-1/4 h-80 w-80 rounded-full blur-3xl transition-all duration-700"
          style={{ background: theme.glow1 }}
        />
        <div
          className="absolute top-1/3 right-0 h-72 w-72 rounded-full blur-3xl transition-all duration-700"
          style={{ background: theme.glow2 }}
        />
      </div>

      <div className="relative mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className="grid h-10 w-10 place-items-center rounded-xl border backdrop-blur-xl"
              style={{ borderColor: theme.accent + '40', background: theme.accent + '15' }}
            >
              <Sparkles className="h-5 w-5" style={{ color: theme.accent }} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight md:text-2xl">Solace</h1>
              <p className={`text-[11px] ${theme.textMuted}`}>Low-energy student sanctuary</p>
            </div>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowThemeMenu((s) => !s)}
              className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all ${theme.buttonGhost}`}
            >
              <Palette className="h-4 w-4" /> {theme.name}
            </button>
            {showThemeMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowThemeMenu(false)} />
                <div
                  className={`absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-2xl border ${theme.border} ${theme.surfaceAlt} p-1.5 shadow-2xl backdrop-blur-2xl`}
                >
                  {themeOptions.map((o) => (
                    <button
                      key={o.key}
                      onClick={() => {
                        setThemeKey(o.key);
                        setShowThemeMenu(false);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all ${
                        themeKey === o.key ? theme.capsuleActive : `${theme.text} hover:bg-current/5`
                      }`}
                    >
                      {o.icon} {o.name}
                      <span className="ml-auto h-3 w-3 rounded-full" style={{ background: THEMES[o.key].accent }} />
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        {/* Vibe Check */}
        <section className="mb-7">
          <div className="mb-3 flex items-center justify-between">
            <h2 className={`text-sm font-semibold uppercase tracking-wide ${theme.textMuted}`}>Vibe Check</h2>
            <span className={`text-xs ${theme.textMuted}`}>
              {completedToday}/{totalToday} done today
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {energyPresets.map((e) => (
              <button
                key={e.key}
                onClick={() => handleEnergy(e.key)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                  energy === e.key ? theme.capsuleActive : `${theme.surfaceAlt} ${theme.textMuted} hover:${theme.text}`
                }`}
              >
                {e.icon} {e.label}
                <span className="text-xs opacity-60">{e.sub}</span>
              </button>
            ))}
          </div>
          {energy === 'zombie' && (
            <p className={`mt-3 text-sm ${theme.textMuted}`}>
              Zombie mode on — daily targets downscaled to gentle micro-steps. Be kind to yourself.
            </p>
          )}
        </section>

        {/* Focus Card */}
        <section className="mb-8">
          <FocusCard
            task={focusTask}
            theme={theme}
            energy={energy}
            onComplete={completeFocus}
            onBreakDown={breakDownFocus}
            onSkip={skipFocus}
            onRefill={refillFocus}
          />
        </section>

        {/* Mind Dump */}
        <section className="mb-8">
          <MindDump theme={theme} onSync={syncMindDump} />
        </section>

        {/* Task Inbox */}
        <section className="mb-8">
          <TaskInbox
            theme={theme}
            tasks={tasks}
            journal={journal}
            habits={habits}
            todayStr={todayStr}
            onAddTask={addTask}
            onToggleTask={toggleTask}
            onDeleteTask={deleteTask}
          />
        </section>

        {/* Footer */}
        <footer className={`mt-10 flex flex-col items-center gap-2 py-6 text-center text-xs ${theme.textMuted}`}>
          <div className="flex gap-3">
            {habitIcons.map((h) => {
              const done = habits.find((x) => x.name === h.name && x.habit_date === todayStr)?.completed;
              return (
                <span
                  key={h.name}
                  className={`inline-flex items-center gap-1 ${done ? '' : 'opacity-40'}`}
                  style={done ? { color: theme.accent } : undefined}
                >
                  {h.icon} {h.name}
                </span>
              );
            })}
          </div>
          <p>Solace — rest is productive too.</p>
        </footer>
      </div>
    </div>
  );
}

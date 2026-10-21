import { useState } from 'react';
import { Plus, Check, Trash2, Clock, CalendarClock, BookOpen } from 'lucide-react';
import type { Task, JournalEntry, Habit } from '@/lib/supabase';
import { THEMES } from '@/lib/themes';

type Theme = (typeof THEMES)[keyof typeof THEMES];

type Tab = 'today' | 'tomorrow' | 'diary';

export default function TaskInbox({
  theme,
  tasks,
  journal,
  habits,
  todayStr,
  onAddTask,
  onToggleTask,
  onDeleteTask,
}: {
  theme: Theme;
  tasks: Task[];
  journal: JournalEntry[];
  habits: Habit[];
  todayStr: string;
  onAddTask: (title: string, category: Task['category'], target_day: Task['target_day']) => void;
  onToggleTask: (task: Task) => void;
  onDeleteTask: (id: string) => void;
}) {
  const [tab, setTab] = useState<Tab>('today');
  const [newTitle, setNewTitle] = useState('');
  const [newCat, setNewCat] = useState<Task['category']>('college');

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'today', label: "Today's Tasks", icon: <Clock className="h-4 w-4" /> },
    { key: 'tomorrow', label: "Tomorrow's Plan", icon: <CalendarClock className="h-4 w-4" /> },
    { key: 'diary', label: 'Diary & Notes', icon: <BookOpen className="h-4 w-4" /> },
  ];

  const filtered = tasks.filter((t) => t.target_day === tab || (tab === 'today' && t.target_day === 'today'));

  const handleAdd = () => {
    if (!newTitle.trim()) return;
    onAddTask(newTitle.trim(), newCat, tab === 'tomorrow' ? 'tomorrow' : 'today');
    setNewTitle('');
  };

  const todaysHabits = habits.filter((h) => h.habit_date === todayStr);

  return (
    <div className={`rounded-3xl border ${theme.border} ${theme.surface} p-5 backdrop-blur-2xl md:p-6`}>
      <div className="flex flex-wrap gap-1.5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all ${
              tab === t.key ? theme.capsuleActive : `${theme.surfaceAlt} ${theme.textMuted}`
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab !== 'diary' && (
          <>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row">
              <input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                placeholder={`Add a task for ${tab === 'today' ? 'today' : 'tomorrow'}...`}
                className={`flex-1 rounded-xl border px-3.5 py-2 text-sm outline-none transition-all focus:ring-2 ${theme.ring} ${theme.inputBg}`}
              />
              <select
                value={newCat}
                onChange={(e) => setNewCat(e.target.value as Task['category'])}
                className={`rounded-xl border px-3 py-2 text-sm outline-none ${theme.inputBg}`}
              >
                <option value="college">College / Exams</option>
                <option value="personal">Personal Skills</option>
                <option value="work">Work</option>
              </select>
              <button
                onClick={handleAdd}
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${theme.buttonPrimary}`}
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>

            {tab === 'today' && todaysHabits.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {todaysHabits.map((h) => (
                  <span
                    key={h.id}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                      h.completed ? theme.habitDone : theme.surfaceAlt + ' ' + theme.textMuted
                    }`}
                  >
                    {h.completed ? <Check className="h-3 w-3" /> : <span className="h-3 w-3 rounded-full border border-current" />}
                    {h.name}
                  </span>
                ))}
              </div>
            )}

            <ul className="flex flex-col gap-2">
              {filtered.length === 0 && (
                <li className={`py-8 text-center text-sm ${theme.textMuted}`}>
                  Nothing here yet. Add a task above to get started.
                </li>
              )}
              {filtered.map((t) => (
                <li
                  key={t.id}
                  className={`group flex items-center gap-3 rounded-2xl border ${theme.border} ${theme.surfaceAlt} px-4 py-3 transition-all hover:translate-x-0.5`}
                >
                  <button
                    onClick={() => onToggleTask(t)}
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border transition-all ${
                      t.completed ? theme.buttonPrimary : 'border-current opacity-50'
                    }`}
                  >
                    {t.completed && <Check className="h-3.5 w-3.5" />}
                  </button>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm ${
                        t.completed ? 'line-through opacity-50' : theme.text
                      }`}
                    >
                      {t.title}
                    </p>
                    <div className={`mt-0.5 flex items-center gap-2 text-[11px] ${theme.textMuted}`}>
                      <span className="capitalize">{t.category}</span>
                      {t.is_focus && <span className="rounded-full bg-current/10 px-1.5 py-0.5">focus</span>}
                      {t.is_micro && <span className="rounded-full bg-current/10 px-1.5 py-0.5">micro</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeleteTask(t.id)}
                    className={`shrink-0 opacity-0 transition-opacity group-hover:opacity-100 ${theme.textMuted} hover:text-red-400`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        {tab === 'diary' && (
          <div className="flex flex-col gap-3">
            {journal.length === 0 && (
              <p className={`py-8 text-center text-sm ${theme.textMuted}`}>
                No journal entries yet. Use the Mind Dump above to create one.
              </p>
            )}
            {journal.map((e) => (
              <div key={e.id} className={`rounded-2xl border ${theme.border} ${theme.surfaceAlt} p-4`}>
                <div className={`mb-1.5 text-[11px] font-medium uppercase tracking-wide ${theme.textMuted}`}>
                  {new Date(e.created_at).toLocaleString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>
                <p className={`whitespace-pre-wrap text-sm leading-relaxed ${theme.text}`}>{e.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

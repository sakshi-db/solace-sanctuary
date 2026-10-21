import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: false },
});

export type Task = {
  id: string;
  title: string;
  category: 'college' | 'personal' | 'work';
  target_day: 'today' | 'tomorrow';
  completed: boolean;
  is_focus: boolean;
  is_micro: boolean;
  priority: string;
  created_at: string;
};

export type JournalEntry = {
  id: string;
  content: string;
  created_at: string;
};

export type Habit = {
  id: string;
  name: string;
  habit_date: string;
  completed: boolean;
};

export type EnergyLevel = 'high' | 'normal' | 'zombie';

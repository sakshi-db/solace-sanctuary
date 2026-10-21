// Lightweight keyword-based parser for the Mind Dump feature.

export type ParsedMindDump = {
  habits: { hydration: boolean; dsa: boolean; workout: boolean };
  tasks: string[];
  journalSummary: string;
};

const lower = (s: string) => s.toLowerCase();

export function parseMindDump(raw: string): ParsedMindDump {
  const text = raw.trim();
  const t = lower(text);

  const habits = {
    hydration: /(\bwater\b|\bhydr|\bdrank\b|\b2l\b|\blitre|\bliter|\bbottle\b)/.test(t),
    dsa: /(\bdsa\b|\bleetcode\b|\bqueue\b|\bstack\b|\btree\b|\bbst\b|\bgraph\b|\balgorithm|\bdata structure|\bproblem\b|\brevise|\brevis|\bsolve\b)/.test(t),
    workout: /(\bworkout|\bgym\b|\brun\b|\brunning|\bstretch|\bexercise|\bwalk\b|\byoga|\bcycling|\bcardio\b)/.test(t),
  };

  const tasks: string[] = [];
  // Split on newlines, commas, "and", "need to", bullets.
  const parts = text
    .split(/[\n,;]| and | need to | need | todo: | to-do: | tomorrow/i)
    .map((p) => p.trim())
    .filter(Boolean);

  const actionRe = /\b(submit|finish|complete|revise|review|study|read|write|do|prepare|attend|send|email|lab|report|assignment|practice|solve|work on|watch)\b/i;
  const todoRe = /\b(tomorrow|tonight|today|asap|urgent|pending|due)\b/i;

  for (const p of parts) {
    const pl = lower(p);
    // skip pure habit lines
    if (/^(\d+\s?l|drank|hydrat)/.test(pl)) continue;
    if (actionRe.test(p) || todoRe.test(pl)) {
      // clean up
      const clean = p.replace(/^[-*•\d.\s]+/, '').replace(/\s+/g, ' ').trim();
      if (clean.length > 2) tasks.push(clean.charAt(0).toUpperCase() + clean.slice(1));
    }
  }

  const journalSummary = text;

  return { habits, tasks: tasks.slice(0, 8), journalSummary };
}

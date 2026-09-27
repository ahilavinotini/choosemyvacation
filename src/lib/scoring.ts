import {
  ORDER,
  QUESTIONS,
  TYPES,
  type AnswerId,
  type ArchetypeKey,
  type Destination,
  type Side,
} from '../data/quiz';

export type Scores = Record<ArchetypeKey, number>;

export function scoreAnswers(answers: Side[]): Scores {
  const s: Scores = { bali: 0, alps: 0, tokyo: 0, paris: 0 };
  answers.forEach((a, i) => {
    const w = QUESTIONS[i][a];
    for (const k of ORDER) s[k] += w[k] ?? 0;
  });
  return s;
}

/** Largest-remainder percentages that always sum to 100 (0 everywhere if no score). */
export function percentages(s: Scores): Scores {
  const total = ORDER.reduce((a, k) => a + s[k], 0);
  if (total === 0) return { bali: 0, alps: 0, tokyo: 0, paris: 0 };
  const raw = ORDER.map((k) => (s[k] / total) * 100);
  const pcts = raw.map(Math.floor);
  const rem = 100 - pcts.reduce((a, b) => a + b, 0);
  raw
    .map((v, i) => [v - Math.floor(v), i] as const)
    .sort((a, b) => b[0] - a[0])
    .slice(0, rem)
    .forEach(([, i]) => pcts[i]++);
  return Object.fromEntries(ORDER.map((k, i) => [k, pcts[i]])) as Scores;
}

/** Highest score wins; ties resolve by ORDER. */
export function winner(s: Scores): ArchetypeKey {
  return ORDER.reduce((best, k) => (s[k] > s[best] ? k : best), ORDER[0]);
}

export function answerLabel(id: AnswerId): string {
  const q = QUESTIONS[Number(id[0]) - 1];
  return id[1] === 'L' ? q.left : q.right;
}

export function toAnswerIds(answers: Side[]): AnswerId[] {
  return answers.map((a, i) => `${i + 1}${a}` as AnswerId);
}

export interface RankedRec extends Destination {
  /** Up to 3 matched answer labels, or ["Wildcard pick"]. */
  matches: string[];
}

/** Destinations for an archetype, ordered by how many of the user's answers they match. */
export function rankRecs(key: ArchetypeKey, answers: Side[]): RankedRec[] {
  const picked = toAnswerIds(answers);
  return TYPES[key].recs
    .map((d) => ({ d, hits: d.tags.filter((t) => picked.includes(t)) }))
    .sort((a, b) => b.hits.length - a.hits.length)
    .map(({ d, hits }) => ({
      ...d,
      matches: hits.length ? hits.slice(0, 3).map(answerLabel) : ['Wildcard pick'],
    }));
}

export function shareText(key: ArchetypeKey, pct: number): string {
  const t = TYPES[key];
  return `I'm a ${t.titleA} ${t.titleB} (${pct}% match). Top trip: ${t.recs[0].name}.`;
}

export const pad2 = (n: number) => String(n).padStart(2, '0');

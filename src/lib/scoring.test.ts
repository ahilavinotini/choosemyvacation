import { describe, expect, it } from 'vitest';
import { ORDER, type Side } from '../data/quiz';
import { percentages, rankRecs, scoreAnswers, shareText, winner } from './scoring';

const all = (s: Side): Side[] => [s, s, s, s, s];

describe('scoring', () => {
  it('scores all-left answers', () => {
    expect(scoreAnswers(all('L'))).toEqual({ bali: 12, alps: 0, tokyo: 3, paris: 2 });
    expect(winner(scoreAnswers(all('L')))).toBe('bali');
  });

  it('scores all-right answers', () => {
    const s = scoreAnswers(all('R'));
    expect(s).toEqual({ bali: 0, alps: 8, tokyo: 6, paris: 6 });
    expect(winner(s)).toBe('alps');
  });

  it('breaks ties by ORDER', () => {
    expect(winner({ bali: 0, alps: 5, tokyo: 5, paris: 5 })).toBe('alps');
    expect(winner({ bali: 0, alps: 0, tokyo: 5, paris: 5 })).toBe('tokyo');
  });

  it('percentages always sum to 100', () => {
    for (let m = 0; m < 32; m++) {
      const answers = [0, 1, 2, 3, 4].map((b) => ((m >> b) & 1 ? 'R' : 'L')) as Side[];
      const p = percentages(scoreAnswers(answers));
      expect(ORDER.reduce((a, k) => a + p[k], 0)).toBe(100);
    }
  });

  it('distributes remainder by largest fraction', () => {
    // 12/17=70.58, 0, 3/17=17.64, 2/17=11.76 → floors 70+0+17+11=98 → +1 paris (.76), +1 tokyo (.64)
    expect(percentages(scoreAnswers(all('L')))).toEqual({ bali: 70, alps: 0, tokyo: 18, paris: 12 });
  });

  it('ranks recs by matched answers and labels up to 3', () => {
    const recs = rankRecs('paris', all('R'));
    expect(recs[0].name).toBe('Paris, France');
    expect(recs[0].matches).toEqual(['Fine dining', 'Explore the old town', 'A hundred photos']);
  });

  it('falls back to "Wildcard pick"', () => {
    const recs = rankRecs('alps', all('L'));
    const banff = recs.find((r) => r.name === 'Banff, Canada')!;
    expect(banff.matches).toEqual(['Nap by the pool']);
    expect(recs.find((r) => r.name === 'Zermatt, Switzerland')!.matches).toEqual(['Wildcard pick']);
  });

  it('builds share text', () => {
    expect(shareText('bali', 70)).toBe("I'm a Bali Beach Bum (70% match). Top trip: Uluwatu, Bali.");
  });
});

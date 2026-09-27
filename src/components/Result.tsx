import { useEffect, useMemo, useRef, useState } from 'react';
import { ORDER, QUESTIONS, TYPES, type ArchetypeKey, type Side } from '../data/quiz';
import { pad2, percentages, rankRecs, scoreAnswers, shareText, winner } from '../lib/scoring';
import { Tag } from './ds/Tag';

interface ResultProps {
  answers: Side[];
  onRetake: () => void;
}

export function Result({ answers, onRetake }: ResultProps) {
  const scores = useMemo(() => scoreAnswers(answers), [answers]);
  const pcts = useMemo(() => percentages(scores), [scores]);
  const win = winner(scores);

  const [explore, setExplore] = useState<ArchetypeKey | null>(null);
  const [openRec, setOpenRec] = useState(0);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(copyTimer.current), []);

  const cur = explore ?? win;
  const r = TYPES[win];
  const ex = TYPES[cur];
  const recs = useMemo(() => rankRecs(cur, answers), [cur, answers]);
  const breakdown = [...ORDER].sort((a, b) => scores[b] - scores[a]);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(shareText(win, pcts[win]));
    } catch {
      /* clipboard unavailable — still show feedback, matching the prototype */
    }
    setCopied(true);
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="result">
      <article className="hero" style={{ background: r.bg, color: r.fg }}>
        <div className="hero__head label">
          <span>Arrival · Your travel type</span>
          <span className="hero__pct">{pcts[win]}% match</span>
        </div>
        <div className="hero__body">
          <div className="label">{r.code}</div>
          <h2 className="hero__title">
            {r.titleA} <em>{r.titleB}</em>
          </h2>
          <p className="hero__blurb">{r.blurb}</p>
        </div>
        <div className="hero__foot">
          <button type="button" className="hero__action hero__action--grow label" onClick={share} aria-live="polite">
            {copied ? 'Copied to clipboard' : 'Share my result →'}
          </button>
          <button type="button" className="hero__action hero__action--retake label" onClick={onRetake}>
            Retake
          </button>
        </div>
      </article>

      <div className="mix">
        <div className="row-between">
          <span className="label">Your mix</span>
          <span className="label label--sm label--muted">Tap one to explore</span>
        </div>
        {breakdown.map((k) => (
          <button
            key={k}
            type="button"
            className={`mix__row${k === cur ? ' is-selected' : ''}`}
            aria-pressed={k === cur}
            onClick={() => {
              setExplore(k);
              setOpenRec(0);
            }}
          >
            <span className="mix__name">
              {TYPES[k].titleA} {TYPES[k].titleB}
            </span>
            <span className="mix__bar">
              <span className="mix__fill" style={{ width: `${pcts[k]}%`, background: TYPES[k].bg }} />
            </span>
            <span className="mix__pct">{pcts[k]}%</span>
          </button>
        ))}
      </div>

      <div className="trips">
        <div className="trips__head">
          <span className="label label--muted">Trips for</span>
          <h3 className="trips__title">
            {ex.titleA} <em>{ex.titleB}</em>
          </h3>
        </div>
        {recs.map((d, i) => {
          const open = i === openRec;
          return (
            <div key={d.name} className="rec">
              <button
                type="button"
                className="rec__head"
                aria-expanded={open}
                onClick={() => setOpenRec(open ? -1 : i)}
              >
                <span className="row-between rec__titlerow">
                  <span className="rec__name">{d.name}</span>
                  <span className="rec__arrow" aria-hidden="true">
                    {open ? '✕' : '→'}
                  </span>
                </span>
                <span className="rec__line">{d.line}</span>
                <span className="rec__tags">
                  {d.matches.map((m) => (
                    <Tag key={m}>{m}</Tag>
                  ))}
                </span>
              </button>
              {open && (
                <div className="rec__panel">
                  <div className="row-between label label--sm">
                    <span>Best time · {d.when}</span>
                    <span className="label--muted nowrap">3-day sketch</span>
                  </div>
                  {d.days.map((text, j) => (
                    <div key={j} className="rec__day">
                      <span className="label label--sm label--muted">DAY {pad2(j + 1)}</span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="tracklist">
        <div className="label tracklist__head">Your answers</div>
        {answers.map((a, i) => (
          <div key={i} className="tracklist__row">
            <span className="tracklist__no">{pad2(i + 1)}</span>
            <span className="tracklist__answer">{a === 'L' ? QUESTIONS[i].left : QUESTIONS[i].right}</span>
            <span className="label label--sm label--muted">{QUESTIONS[i].cat}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

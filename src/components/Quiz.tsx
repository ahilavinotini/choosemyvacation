import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { QUESTIONS, type Side } from '../data/quiz';
import { pad2 } from '../lib/scoring';

const FLY_DISTANCE = 640;
const FLY_MS = 240;

interface QuizProps {
  idx: number;
  threshold: number;
  onAnswer: (side: Side) => void;
}

export function Quiz({ idx, threshold, onAnswer }: QuizProps) {
  const q = QUESTIONS[idx];
  const total = QUESTIONS.length;
  const hasNext = idx < total - 1;

  const [dx, setDx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [flying, setFlying] = useState(false);
  const flyingRef = useRef(false);
  const x0 = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timer.current), []);

  const commit = useCallback(
    (dir: -1 | 1) => {
      if (flyingRef.current) return;
      flyingRef.current = true;
      setFlying(true);
      setDragging(false);
      setDx(dir * FLY_DISTANCE);
      timer.current = setTimeout(() => {
        // The card is keyed by question index, so the next one mounts at dx=0
        // with no fly-back animation.
        flyingRef.current = false;
        setFlying(false);
        setDx(0);
        onAnswer(dir < 0 ? 'L' : 'R');
      }, FLY_MS);
    },
    [onAnswer],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') commit(-1);
      if (e.key === 'ArrowRight') commit(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [commit]);

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    if (flyingRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    x0.current = e.clientX;
    setDragging(true);
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (dragging) setDx(e.clientX - x0.current);
  };
  const onUp = () => {
    if (!dragging) return;
    if (Math.abs(dx) > threshold) commit(dx < 0 ? -1 : 1);
    else {
      setDragging(false);
      setDx(0);
    }
  };
  const stop = (e: PointerEvent) => e.stopPropagation();

  const transition = dragging ? 'none' : flying ? `transform ${FLY_MS}ms ease-in` : 'transform 160ms ease';
  const clamp = (v: number) => Math.max(0, Math.min(1, v));

  return (
    <section className="quiz">
      <div className="quiz__meta label">
        <span className="quiz__stop">
          Stop {pad2(idx + 1)} / {pad2(total)}
        </span>
        <span className="label--muted">{q.cat}</span>
      </div>

      <div className="stack">
        {hasNext && (
          <div className="card card--next" aria-hidden="true">
            <div className="card--next__head label label--muted">
              Stop {pad2(idx + 2)} · {QUESTIONS[idx + 1].cat}
            </div>
          </div>
        )}

        <div
          key={idx}
          className="card card--active"
          style={{ transform: `translateX(${dx}px) rotate(${dx / 18}deg)`, transition }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <div className="card__head label">
            <span>Stop {pad2(idx + 1)}</span>
            <span className="card__cat">{q.cat}</span>
          </div>
          <div className="card__perf" />
          <div className="card__body">
            <h2 className="card__prompt">{q.prompt}</h2>
            <div className="stamp stamp--left" style={{ opacity: clamp(-dx / threshold) }} aria-hidden="true">
              {q.left}
            </div>
            <div className="stamp stamp--right" style={{ opacity: clamp(dx / threshold) }} aria-hidden="true">
              {q.right}
            </div>
          </div>
          <div className="answers">
            <button type="button" className="answers__cell" onPointerDown={stop} onClick={() => commit(-1)}>
              <span className="answers__hint">← SWIPE LEFT</span>
              <span className="answers__text">{q.left}</span>
            </button>
            <button type="button" className="answers__cell answers__cell--right" onPointerDown={stop} onClick={() => commit(1)}>
              <span className="answers__hint">SWIPE RIGHT →</span>
              <span className="answers__text">{q.right}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="quiz__help label label--muted">Drag the card · tap a side · or use ← →</div>
    </section>
  );
}

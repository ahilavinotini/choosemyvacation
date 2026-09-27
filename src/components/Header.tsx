import { useEffect, useState } from 'react';
import { MILES_PER_STOP, QUESTIONS } from '../data/quiz';

export type ProgressMode = 'both' | 'miles' | 'stops';

/** Counts toward `target` in mechanical steps of 62 every 16ms. */
function useMilesCounter(target: number) {
  const [count, setCount] = useState(target);
  useEffect(() => {
    if (count === target) return;
    const t = setTimeout(() => {
      setCount((c) => c + Math.sign(target - c) * Math.min(62, Math.abs(target - c)));
    }, 16);
    return () => clearTimeout(t);
  }, [count, target]);
  return count;
}

export function Header({ answered, mode }: { answered: number; mode: ProgressMode }) {
  const miles = useMilesCounter(answered * MILES_PER_STOP);
  const digits = String(miles).padStart(4, '0').split('');

  return (
    <header className="header">
      <div className="logo">
        Swipe<span className="logo__trip">.trip</span>
      </div>
      <div className="header__progress" aria-label={`${answered} of ${QUESTIONS.length} stops answered`}>
        {mode !== 'miles' && (
          <div className="stops" aria-hidden="true">
            {QUESTIONS.map((_, i) => (
              <div key={i} className="stops__item">
                <div className={`stops__dot${i < answered ? ' is-filled' : ''}`} />
                {i < QUESTIONS.length - 1 && <div className="stops__line" />}
              </div>
            ))}
          </div>
        )}
        {mode !== 'stops' && (
          <div className="miles" aria-hidden="true">
            {digits.map((d, i) => (
              <div key={i} className="miles__digit">
                {d}
              </div>
            ))}
            <span className="miles__unit">MI</span>
          </div>
        )}
      </div>
    </header>
  );
}

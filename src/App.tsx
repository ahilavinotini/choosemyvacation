import { useCallback, useState } from 'react';
import { QUESTIONS, type Side } from './data/quiz';
import { Header, type ProgressMode } from './components/Header';
import { Intro } from './components/Intro';
import { Quiz } from './components/Quiz';
import { Result } from './components/Result';

type Screen = 'intro' | 'quiz' | 'result';

export interface AppConfig {
  /** Drag distance (px) that commits a swipe. 60–200, default 110. */
  swipeThreshold: number;
  progressMode: ProgressMode;
}

/** Config can be overridden via query string: ?threshold=140&progress=miles */
export function readConfig(search = window.location.search): AppConfig {
  const p = new URLSearchParams(search);
  const t = Number(p.get('threshold'));
  const mode = p.get('progress');
  return {
    swipeThreshold: Number.isFinite(t) && t >= 60 && t <= 200 ? t : 110,
    progressMode: mode === 'miles' || mode === 'stops' ? mode : 'both',
  };
}

export function App({ config }: { config: AppConfig }) {
  const [screen, setScreen] = useState<Screen>('intro');
  const [answers, setAnswers] = useState<Side[]>([]);

  const start = () => {
    setAnswers([]);
    setScreen('quiz');
  };

  const onAnswer = useCallback(
    (side: Side) => {
      const next = [...answers, side];
      setAnswers(next);
      if (next.length >= QUESTIONS.length) setScreen('result');
    },
    [answers],
  );

  return (
    <div className="app">
      <Header answered={answers.length} mode={config.progressMode} />
      <main className="main">
        {screen === 'intro' && <Intro onStart={start} />}
        {screen === 'quiz' && <Quiz idx={answers.length} threshold={config.swipeThreshold} onAnswer={onAnswer} />}
        {screen === 'result' && <Result answers={answers} onRetake={start} />}
      </main>
    </div>
  );
}

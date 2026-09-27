import { Button } from './ds/Button';
import { RegistrationMark } from './ds/RegistrationMark';

export function Intro({ onStart }: { onStart: () => void }) {
  return (
    <section className="intro">
      <RegistrationMark variant="float" size={56} accent="violet" />
      <div className="label label--muted">Boarding · 5 stops · 1 destination</div>
      <h1 className="intro__title">
        Where should you <em>actually</em> go?
      </h1>
      <p className="intro__body">
        Five swipes, two choices each. You get a travel type, then a shortlist of trips picked from your answers.
      </p>
      <div>
        <Button variant="secondary" size="lg" onClick={onStart}>
          Start packing →
        </Button>
      </div>
    </section>
  );
}

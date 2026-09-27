# Swipe.trip — Trip Swipe Quiz

A swipe quiz with five travel questions. Each answer adds points to four travel types, and the result screen shows your type, your mix, and ranked trip recommendations. Built from the design handoff `design_handoff_trip_swipe_quiz` using React 18, TypeScript and Vite, with Scrapbook design-system tokens.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # scoring unit tests (vitest)
npm run build      # typecheck + production build to dist/
```

## Config

Set these with query-string parameters (they were props in the prototype):

| Param | Values | Default |
|---|---|---|
| `threshold` | 60–200 (px drag distance that commits a swipe) | `110` |
| `progress` | `both` \| `miles` \| `stops` | `both` |

Example: `/?threshold=140&progress=miles`

## Structure

```
src/
  data/quiz.ts          questions, weights, archetypes, destinations (placeholder content — confirm with product)
  lib/scoring.ts        pure scoring: totals, largest-remainder %, winner + tie-break, rec ranking, share text
  components/
    ds/                 Scrapbook DS components ported to TSX: Button, Tag, RegistrationMark
    Header.tsx          logo + stops / miles progress (mechanical count-up)
    Intro.tsx
    Quiz.tsx            swipe card: pointer drag, stamps, fly-out, tap cells, ← → keys
    Result.tsx          result card, mix breakdown, explorable trips, answer list
  styles/               DS token CSS (colors, typography, spacing, borders) + app.css
```

## Changes from the prototype

- The active card is keyed by question index, so the next card mounts at rest. This replaces the prototype's two-frame "snap" flag, and the result looks the same.
- Answer cells, mix rows, rec headers and the share/retake actions are real `<button>`s, so they work with the keyboard and screen readers.
- The "% match" and "3-day sketch" labels no longer wrap on narrow phones.

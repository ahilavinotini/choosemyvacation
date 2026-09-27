const ACCENTS = {
  none: null,
  red: '#FF4B6E',
  violet: '#7B5CF5',
  yellow: '#F5FF4B',
  mint: '#4BFFC8',
  tan: '#FF8C42',
} as const;

interface RegistrationMarkProps {
  size?: number;
  variant?: 'md' | 'float' | 'plain';
  accent?: keyof typeof ACCENTS;
  ink?: string;
}

/** Scrapbook RegistrationMark — the printer's crosshair. One per page, in hero sections. */
export function RegistrationMark({ size = 56, variant = 'md', accent = 'none', ink = '#111111' }: RegistrationMarkProps) {
  const fill = ACCENTS[accent];
  const c = 28;
  const line = { stroke: ink, strokeWidth: 2.5, strokeLinecap: 'round' as const };
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" style={{ display: 'block' }} aria-hidden="true">
      {variant === 'float' ? (
        <>
          <line x1={c} y1={0} x2={c} y2={10} {...line} />
          <line x1={c} y1={46} x2={c} y2={56} {...line} />
          <line x1={0} y1={c} x2={10} y2={c} {...line} />
          <line x1={46} y1={c} x2={56} y2={c} {...line} />
        </>
      ) : (
        <>
          <line x1={c} y1={0} x2={c} y2={56} {...line} />
          <line x1={0} y1={c} x2={56} y2={c} {...line} />
        </>
      )}
      {fill && <circle cx={c} cy={c} r={16} fill={fill} />}
      <circle cx={c} cy={c} r={16} fill="none" stroke={ink} strokeWidth={2.5} />
      {variant === 'md' && <circle cx={c} cy={c} r={9} fill="none" stroke={ink} strokeWidth={2.5} />}
      <circle cx={c} cy={c} r={2.5} fill={ink} />
    </svg>
  );
}

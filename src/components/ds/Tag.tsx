import type { HTMLAttributes } from 'react';

/** Scrapbook Tag — Space Mono pill; the one exception to the no-radius rule. */
export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'outline' | 'violet' | 'red' | 'yellow' | 'mint';
}

export function Tag({ variant = 'outline', className = '', ...rest }: TagProps) {
  return <span className={`ds-tag ds-tag--${variant} ${className}`.trim()} {...rest} />;
}

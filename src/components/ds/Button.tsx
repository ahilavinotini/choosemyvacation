import type { ButtonHTMLAttributes } from 'react';

/**
 * Scrapbook Button — letterpress action with a 2.5px ink border, hard corners, no shadow.
 * primary = violet, secondary = yellow, ghost = transparent.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', type = 'button', className = '', ...rest }: ButtonProps) {
  return <button type={type} className={`ds-btn ds-btn--${variant} ds-btn--${size} ${className}`.trim()} {...rest} />;
}

import type { ButtonHTMLAttributes } from 'react';
import { Icon, type Glyph } from '../Icon/Icon';
import './IconButton.css';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  glyph: Glyph;
  /** Required: the button has no visible text. Also shown as the tooltip. */
  label: string;
  on?: boolean;
  /** Announces `on` as aria-pressed. Leave off for one-shot actions. */
  toggle?: boolean;
  /** 24px chip with a 44px hit area, for close buttons inside panels. */
  small?: boolean;
}

export function IconButton({ glyph, label, on, toggle, small, className, ...rest }: IconButtonProps) {
  const cls = ['sd-ib', on && 'is-on', small && 'sd-ib--sm', className].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} aria-label={label} title={label} aria-pressed={toggle ? !!on : undefined} {...rest}>
      <Icon glyph={glyph} />
    </button>
  );
}

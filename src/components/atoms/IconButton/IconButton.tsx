import type { ButtonHTMLAttributes } from 'react';
import { Icon, type Glyph } from '../Icon/Icon';
import { Tooltip, type TooltipSide } from '../Tooltip/Tooltip';
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
  /** Where the tooltip opens. */
  tipSide?: TooltipSide;
}

export function IconButton({ glyph, label, on, toggle, small, tipSide, className, ...rest }: IconButtonProps) {
  const cls = ['sd-ib', on && 'is-on', small && 'sd-ib--sm', className].filter(Boolean).join(' ');
  return (
    <Tooltip label={label} side={tipSide}>
      <button type="button" className={cls} aria-label={label} aria-pressed={toggle ? !!on : undefined} {...rest}>
        <Icon glyph={glyph} />
      </button>
    </Tooltip>
  );
}

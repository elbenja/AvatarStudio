import type { AnchorHTMLAttributes, ButtonHTMLAttributes, Ref } from 'react';
import { Badge } from '../Badge/Badge';
import { Icon, type Glyph } from '../Icon/Icon';
import './Button.css';

export type ButtonKind = 'quiet' | 'soft' | 'solid' | 'float' | 'go';

interface BaseProps {
  label: string;
  kind?: ButtonKind;
  glyph?: Glyph;
  glyphEnd?: Glyph;
  /** Fills its container at the 44px touch height. */
  wide?: boolean;
  /** A short status after the label, e.g. "Soon". */
  badge?: string;
  /** lg: 48px tall with larger text, for the one action a surface leads with. */
  size?: 'md' | 'lg';
}

type AsButton = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  href?: undefined;
  /** Makes it a toggle: announces aria-pressed. */
  pressed?: boolean;
  ref?: Ref<HTMLButtonElement>;
};
type AsLink = BaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & { href: string; ref?: Ref<HTMLAnchorElement> };

export type ButtonProps = AsButton | AsLink;

/** A button, or a link that looks like one when `href` is set. */
export function Button(props: ButtonProps) {
  const { label, kind = 'soft', glyph, glyphEnd, wide, badge, size = 'md', className, ...rest } = props;
  const cls = ['sd-btn', `sd-btn--${kind}`, wide && 'sd-btn--wide', size === 'lg' && 'sd-btn--lg', className].filter(Boolean).join(' ');
  const inner = (
    <>
      {glyph && <Icon glyph={glyph} />}
      <span>{label}</span>
      {badge && <Badge label={badge} />}
      {glyphEnd && <Icon glyph={glyphEnd} end />}
    </>
  );

  if (rest.href !== undefined) {
    return <a className={cls} {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}>{inner}</a>;
  }
  const { pressed, ...buttonRest } = rest as AsButton;
  return (
    <button type="button" className={cls} aria-pressed={pressed} {...buttonRest}>
      {inner}
    </button>
  );
}

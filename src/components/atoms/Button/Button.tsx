import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import { Icon, type Glyph } from '../Icon/Icon';
import './Button.css';

export type ButtonKind = 'quiet' | 'soft' | 'solid';

interface BaseProps {
  label: string;
  kind?: ButtonKind;
  glyph?: Glyph;
  glyphEnd?: Glyph;
  /** Fills its container at the 44px touch height. */
  wide?: boolean;
}

type AsButton = BaseProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  href?: undefined;
  /** Makes it a toggle: announces aria-pressed. */
  pressed?: boolean;
};
type AsLink = BaseProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children'> & { href: string };

export type ButtonProps = AsButton | AsLink;

/** A button, or a link that looks like one when `href` is set. */
export function Button(props: ButtonProps) {
  const { label, kind = 'soft', glyph, glyphEnd, wide, className, ...rest } = props;
  const cls = ['sd-btn', `sd-btn--${kind}`, wide && 'sd-btn--wide', className].filter(Boolean).join(' ');
  const inner = (
    <>
      {glyph && <Icon glyph={glyph} />}
      <span>{label}</span>
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

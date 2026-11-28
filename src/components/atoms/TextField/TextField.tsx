import { useId, useLayoutEffect, useRef, type HTMLInputAutoCompleteAttribute } from 'react';
import './TextField.css';

export interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** A quiet note after the label, e.g. "Optional". */
  hint?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'url';
  autoComplete?: HTMLInputAutoCompleteAttribute;
  /** More than one makes it a text area: it starts this many lines tall and grows with what is typed. */
  lines?: number;
}

/** A labelled text input, sunken: it is made to sit inside a white panel. */
export function TextField({ label, value, onChange, hint, placeholder, type = 'text', autoComplete, lines = 1 }: TextFieldProps) {
  const id = useId();
  const area = useRef<HTMLTextAreaElement>(null);
  // Grow to fit: let it shrink first, then take the height of its content. The CSS min-height holds the starting size.
  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  return (
    <div className="sd-field">
      <label className="sd-field-label" htmlFor={id}>
        {label}
        {hint && <span className="sd-field-hint">{hint}</span>}
      </label>
      {lines > 1 ? (
        <textarea ref={area} id={id} className="sd-field-input sd-field-input--area" rows={lines} value={value} placeholder={placeholder} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input id={id} className="sd-field-input" type={type} value={value} placeholder={placeholder} autoComplete={autoComplete} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

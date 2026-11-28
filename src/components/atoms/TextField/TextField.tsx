import { useId, useLayoutEffect, useRef, type HTMLInputAutoCompleteAttribute } from 'react';
import './TextField.css';

export interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  /** A quiet note after the label, e.g. "Optional". */
  hint?: string;
  /** What is wrong with the value, shown under the field. Leave it out while the field is fine. */
  error?: string;
  onBlur?: () => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'url';
  autoComplete?: HTMLInputAutoCompleteAttribute;
  /** More than one makes it a text area: it starts this many lines tall and grows with what is typed. */
  lines?: number;
}

/** A labelled text input, sunken: it is made to sit inside a white panel. */
export function TextField({ label, value, onChange, hint, error, onBlur, placeholder, type = 'text', autoComplete, lines = 1 }: TextFieldProps) {
  const id = useId();
  const area = useRef<HTMLTextAreaElement>(null);
  // Grow to fit: let it shrink first, then take the height of its content. The CSS min-height holds the starting size.
  useLayoutEffect(() => {
    const el = area.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }, [value]);

  const shared = {
    id, value, placeholder, autoComplete, onBlur,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? `${id}-error` : undefined,
  };

  return (
    <div className="sd-field">
      <label className="sd-field-label" htmlFor={id}>
        {label}
        {hint && <span className="sd-field-hint">{hint}</span>}
      </label>
      {lines > 1 ? (
        <textarea ref={area} {...shared} className="sd-field-input sd-field-input--area" rows={lines} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input {...shared} className="sd-field-input" type={type} onChange={(e) => onChange(e.target.value)} />
      )}
      {error && <p id={`${id}-error`} className="sd-field-error">{error}</p>}
    </div>
  );
}

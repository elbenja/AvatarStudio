import type { CSSProperties } from 'react';
import './Slider.css';

export type SliderUnit = 'times' | 'plain' | 'degrees';

export interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: SliderUnit;
  onChange: (value: number) => void;
}

const format = (value: number, unit: SliderUnit) =>
  unit === 'degrees' ? `${Math.round(value)}°` : value.toFixed(1) + (unit === 'times' ? '×' : '');

/** A native range input: keyboard, screen readers and touch work as the platform expects. */
export function Slider({ label, value, min, max, step = 0.05, unit = 'times', onChange }: SliderProps) {
  const text = format(value, unit);
  const fill = max > min ? ((value - min) / (max - min)) * 100 : 0;
  return (
    <label className="sd-slider">
      <span className="sd-slider-head">
        <span>{label}</span>
        <span className="sd-mono sd-slider-val" aria-hidden="true">{text}</span>
      </span>
      <input
        className="sd-range"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-valuetext={text}
        onChange={(e) => onChange(parseFloat(e.currentTarget.value))}
        style={{ '--p': `${fill.toFixed(2)}%` } as CSSProperties}
      />
    </label>
  );
}

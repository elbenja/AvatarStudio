import './Badge.css';

export interface BadgeProps {
  label: string;
}

/** A 20px status label, e.g. "Soon". A pale wash with ink text, so it reads without competing for attention. */
export function Badge({ label }: BadgeProps) {
  return <span className="sd-badge">{label}</span>;
}

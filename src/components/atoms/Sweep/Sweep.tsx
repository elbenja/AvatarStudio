import { useEffect, useRef, useState } from 'react';
import './Sweep.css';

export interface SweepProps {
  /** The sweep replays each time this changes. It stays still on mount. */
  trigger: unknown;
}

/** A colour glint that sweeps across its nearest positioned ancestor, which should clip it. */
export function Sweep({ trigger }: SweepProps) {
  // Remounted per run to replay the animation.
  const [runs, setRuns] = useState(0);
  const last = useRef(trigger);

  useEffect(() => {
    if (trigger !== last.current) setRuns((n) => n + 1);
    last.current = trigger;
  }, [trigger]);

  return runs > 0 ? <div key={runs} className="sd-sweep" aria-hidden="true" /> : null;
}

import { useEffect, useRef } from 'react';
import '../../../../src/components/disclosure/disclosure.js';
import '../../../../src/components/disclosure/disclosure.css';

/**
 * Disclosure, rendered as the <psds-disclosure> web component.
 * Mirrors src/components/disclosure/disclosure.twig. The web component owns
 * the open/close behavior and the trigger's ARIA state; React 19 passes `open`
 * through as a property.
 */
export function Disclosure({ summary, children, open = false, onToggle }) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !onToggle) return undefined;

    const handler = (event) => onToggle(event.detail.open, event);
    element.addEventListener('psds-toggle', handler);
    return () => element.removeEventListener('psds-toggle', handler);
  }, [onToggle]);

  return (
    <psds-disclosure ref={ref} class="psds-disclosure" open={open || undefined}>
      <button type="button" className="psds-disclosure__trigger">
        {summary}
      </button>
      <div className="psds-disclosure__panel">{children}</div>
    </psds-disclosure>
  );
}

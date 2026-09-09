import { useId, useState, type ReactNode } from "react";

export function Disclosure({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return <article className="ss-disclosure" data-open={open}>
    <h3 className="ss-disclosure-heading">
      <button id={`${id}-question`} aria-expanded={open} aria-controls={`${id}-answer`} onClick={() => setOpen(value => !value)}>
        {title}<span className="ss-disclosure-icon" aria-hidden="true" />
      </button>
    </h3>
    <div className="ss-disclosure-panel" id={`${id}-answer`} role="region" aria-labelledby={`${id}-question`} aria-hidden={!open}>
      <div className="ss-disclosure-inner">{children}</div>
    </div>
  </article>;
}

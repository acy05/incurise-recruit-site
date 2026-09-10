import { AsteriskMark } from "./AsteriskMark";
import { useEffect, useRef, useState } from "react";

/* Vector artwork keeps the fine lines sharp at every screen size. */
const contours = Array.from({ length: 24 }, (_, index) => {
  const points = Array.from({ length: 241 }, (_, step) => {
    const angle = (step / 240) * Math.PI * 2;
    const radius = 114 + index * 4.1 + 29 * Math.cos(3 * angle + index * 0.055);
    return `${step ? "L" : "M"}${(300 + Math.cos(angle) * radius).toFixed(2)},${(300 + Math.sin(angle) * radius).toFixed(2)}`;
  });
  return `${points.join(" ")}Z`;
});

export function ApproachArtwork() {
  return (
    <div className="approach-art" aria-hidden="true" data-motion-scene>
      <div className="approach-engraving">
        <svg viewBox="0 0 600 600" fill="none">
          <defs>
            <linearGradient id="weave-ink" x1="60" y1="60" x2="520" y2="540" gradientUnits="userSpaceOnUse">
              <stop stopColor="#e6bb85" />
              <stop offset=".48" stopColor="#d8dfc1" />
              <stop offset="1" stopColor="#879d81" />
            </linearGradient>
          </defs>
          <g className="approach-weave" stroke="url(#weave-ink)" strokeWidth=".85">
            {contours.map((d, i) => <path key={i} d={d} opacity={.34 + i / 42} />)}
          </g>
          <circle cx="300" cy="300" r="65" stroke="#c7d4b9" strokeOpacity=".18" />
          <g className="approach-seed" stroke="#e0d3af" strokeWidth="2" strokeLinecap="round">
            {[0, 45, 90, 135].map(angle => <path key={angle} d="M300 280V320" transform={`rotate(${angle} 300 300)`} />)}
          </g>
        </svg>
        <span className="approach-art-index">IDEAS IN GOOD COMPANY</span>
        <div className="approach-art-legend"><span>01 — THINK</span><span>02 — CREATE</span><span>03 — GROW</span></div>
      </div>
    </div>
  );
}

export function ChapterArtwork() {
  return (
    <div className="chapter-art" aria-hidden="true">
      {["left", "right"].map(side => (
        <svg className={`chapter-lines chapter-lines-${side}`} key={side} viewBox="0 0 600 600" fill="none">
          {Array.from({ length: 15 }, (_, i) => <ellipse key={i} cx="300" cy="300" rx={120 + i * 12} ry={185 + i * 7} stroke="currentColor" strokeWidth=".7" />)}
        </svg>
      ))}
    </div>
  );
}

export function DesignTicker() {
  const root = useRef<HTMLDivElement>(null);
  const [repetitions, setRepetitions] = useState(4);
  useEffect(() => {
    const container = root.current;
    const pair = container?.querySelector<HTMLElement>(".ticker-pair");
    if (!container || !pair) return;
    const resize = new ResizeObserver(() => {
      const width = pair.getBoundingClientRect().width;
      if (width > 0) setRepetitions(Math.max(2, Math.ceil(container.clientWidth / width) + 1));
    });
    resize.observe(container);
    resize.observe(pair);
    return () => resize.disconnect();
  }, []);
  return (
    <div ref={root} className="ticker" aria-hidden="true" data-motion-scene>
      <div className="ticker-track">
        {[0, 1].map(group => <div className="ticker-group" key={group}>
          {Array.from({ length: repetitions }, (_, item) => <span className="ticker-pair" key={item}>
            <span>DESIGN WITH PURPOSE</span><i><AsteriskMark /></i><span>IDEAS INTO IMPACT</span><i><AsteriskMark /></i>
          </span>)}
        </div>)}
      </div>
    </div>
  );
}

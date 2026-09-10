import { AsteriskMark } from "../AsteriskMark";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import "./motion.css";
import { useSampleNavigation } from "./Navigation";

const MotionContext = createContext({ enabled: false, visible: true });
const preferenceKey = "isaac-sample-motion";
const revealSelector = [
  "main h2", ".sora-prose > p", ".sora-project-card", ".sora-process li",
  ".sora-journal-row", ".next-person", ".next-values article", ".next-job",
  ".mellow-story > p", ".mellow-story-word", ".mellow-notes-copy article",
  ".mellow-ritual article", ".mellow-faq .ss-disclosure", ".ss-form", "[data-enter]",
].join(",");

export function MotionProvider({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useSampleNavigation(root);
  const [reduced, setReduced] = useState(() => matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [paused, setPaused] = useState(() => {
    try { return sessionStorage.getItem(preferenceKey) === "off"; } catch { return false; }
  });
  const [visible, setVisible] = useState(() => !document.hidden);
  const enabled = !paused && !reduced;

  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => setReduced(media.matches);
    const visibility = () => setVisible(!document.hidden);
    media.addEventListener("change", change);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      media.removeEventListener("change", change);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    const container = root.current!;
    const seen = new Set<HTMLElement>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      }
    }, { threshold: .1, rootMargin: "0px 0px -24px 0px" });
    const register = () => {
      container.querySelectorAll<HTMLElement>(revealSelector).forEach(node => {
        if (seen.has(node) || node.closest("dialog")) return;
        seen.add(node);
        // Animate one level at a time, so a heading never fades twice inside a card.
        if (node.parentElement?.closest(revealSelector)) return;
        const siblings = Array.from(node.parentElement?.children || []).filter(s => s.matches(revealSelector));
        node.style.setProperty("--enter-delay", `${Math.min(siblings.indexOf(node), 3) * 70}ms`);
        node.classList.add("ss-enter");
        if (!enabled || node.getBoundingClientRect().bottom < 0) node.classList.add("is-revealed");
        else observer.observe(node);
      });
    };
    register();
    // Filters insert new cards after mount; give them the same entrance treatment.
    const mutations = new MutationObserver(register);
    mutations.observe(container, { childList: true, subtree: true });
    return () => { observer.disconnect(); mutations.disconnect(); };
  }, [enabled]);

  useEffect(() => {
    const container = root.current!;
    const scenes = container.querySelectorAll<HTMLElement>("[data-scene]");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => (entry.target as HTMLElement).dataset.inview = String(entry.isIntersecting));
    }, { rootMargin: "60px" });
    scenes.forEach(scene => observer.observe(scene));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!enabled || !visible) return;
    const container = root.current!;
    let frame = 0;
    const update = () => {
      frame = 0;
      const height = innerHeight;
      const mobile = innerWidth < 761;
      const targets = container.querySelectorAll<HTMLElement>("[data-parallax], [data-scroll-turn]");
      for (const target of targets) {
        const rect = target.getBoundingClientRect();
        if (rect.bottom < -100 || rect.top > height + 100) continue;
        const progress = Math.max(-1, Math.min(1, (height / 2 - rect.top - rect.height / 2) / ((height + rect.height) / 2)));
        const travel = Number(target.dataset.parallax || 32) * (mobile ? .5 : 1);
        target.style.setProperty("--scroll-y", `${progress * travel}px`);
        target.style.setProperty("--scroll-turn", `${progress * 22}deg`);
      }
      const length = document.documentElement.scrollHeight - height;
      container.style.setProperty("--reading-progress", String(length > 0 ? scrollY / length : 0));
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    const resize = new ResizeObserver(schedule);
    resize.observe(container);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      resize.disconnect();
    };
  }, [enabled, visible]);

  function toggle() {
    setPaused(!paused);
    try { sessionStorage.setItem(preferenceKey, paused ? "on" : "off"); } catch { /* Storage is optional. */ }
  }

  return <MotionContext.Provider value={{ enabled, visible }}>
    <div ref={root} className="ss-motion-root" data-motion={enabled ? "on" : "off"} data-hidden={!visible}>
      <div className="ss-reading-progress" aria-hidden="true" />
      {children}
      <button className="ss-motion-toggle" onClick={toggle} disabled={reduced} aria-pressed={!enabled}
        aria-label={reduced ? "端末の設定によりアニメーションを停止中" : enabled ? "すべての動画とアニメーションを停止" : "動画とアニメーションを再生"}>
        <span className="ss-motion-icon" aria-hidden="true">{enabled ? <><i/><i/></> : "▷"}</span>
        MOTION <span>{enabled ? "ON" : "OFF"}</span>
      </button>
    </div>
  </MotionContext.Provider>;
}

/** A decorative, original light film. The photograph beneath is always available. */
export function AmbientVideo({ className = "" }: { className?: string }) {
  const { enabled, visible } = useContext(MotionContext);
  const ref = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin: "80px" });
    observer.observe(ref.current!);
    return () => observer.disconnect();
  }, []);
  useEffect(() => { if (enabled && inView) setLoaded(true); }, [enabled, inView]);
  useEffect(() => {
    const video = ref.current!;
    if (enabled && visible && inView && loaded && !failed) {
      // Set both before play: some browsers re-evaluate autoplay when a lazy src arrives.
      video.muted = true;
      video.defaultMuted = true;
      const play = () => { void video.play().catch(() => { /* Keep the poster when autoplay is unavailable. */ }); };
      video.addEventListener("canplay", play);
      play();
      return () => video.removeEventListener("canplay", play);
    } else video.pause();
  }, [enabled, visible, inView, loaded, failed]);
  return <video ref={ref} className={`ss-light-film ${className}`} aria-hidden="true" tabIndex={-1}
    muted loop playsInline autoPlay={enabled && visible && inView} preload="none" disablePictureInPicture
    poster={`${import.meta.env.BASE_URL}isaac/samples/motion/botanical-light-poster.webp`}
    src={loaded && !failed ? `${import.meta.env.BASE_URL}isaac/samples/motion/botanical-light-loop.mp4` : undefined}
    onError={() => setFailed(true)} />;
}

export function HeroLines({ first, second }: { first: ReactNode; second: ReactNode }) {
  return <><span className="ss-title-line"><span>{first}</span></span><span className="ss-title-line"><span>{second}</span></span></>;
}

export function MotionMarquee() {
  return <div className="next-marquee" data-scene aria-hidden="true"><div className="next-marquee-track ss-loop">
    {[0, 1].map(i => <div key={i}><span>MAKE IT TOGETHER.</span><b><AsteriskMark /></b><span>THE NEXT IS YOURS.</span><b><AsteriskMark /></b></div>)}
  </div></div>;
}

export function BotanicalMark() {
  return <svg className="mellow-botanical-mark ss-loop" viewBox="0 0 200 200" fill="none" aria-hidden="true">
    <circle cx="100" cy="100" r="94" stroke="currentColor" strokeWidth=".6"/>
    <path d="M70 156C114 117 123 75 125 43M93 128C48 133 43 88 43 88C78 81 103 97 93 128ZM113 96C110 57 147 51 160 57C157 83 143 99 113 96ZM115 88C87 87 75 65 78 42C108 42 126 58 115 88Z" stroke="currentColor" strokeWidth="1.2"/>
  </svg>;
}

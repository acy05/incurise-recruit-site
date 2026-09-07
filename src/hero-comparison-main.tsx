import { StrictMode, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { Hero } from "./CommentRevisionApp";
import logo from "./assets/preview/incurise-logo.png";
import "./comment-revision.css";
import "./hero-comparison.css";

const options = [
  { id: "A", name: "TYPOGRAPHY", title: "大きな英字で、余白に意味を。", detail: "INCUBATE / RISEを淡いアウトラインで配置。ゆっくり浮かぶ文字が、右側の粒子と呼応します。" },
  { id: "B", name: "LIGHT PATH", title: "ひとつの光が、成長をつなぐ。", detail: "左上の数字から右側の立体へ。細い曲線に光が流れ、空白に視線の通り道をつくります。" },
  { id: "C", name: "REBALANCE", title: "足さずに、重心を整える。", detail: "コピーを上へ移動し、立体も少し中央へ。要素を増やさず、余白と情報のバランスを整えます。" },
  { id: "D", name: "BUILDING BLOCK", title: "点から線へ、線から立体へ。", detail: "直線の格子と三角面で構成した幾何学フレーム。中心の立体と周囲のパーツが、ゆっくり連動します。" },
  { id: "current", name: "CURRENT", title: "現在のデザイン", detail: "変更前のHero。4案と同じ表示サイズで比較できます。" },
];

function Decoration({ variant }: { variant: string }) {
  if (variant === "A") return <div className="hc-type" aria-hidden="true"><span>INCUBATE</span><span>RISE</span></div>;
  if (variant === "B") return <svg className="hc-path" viewBox="0 0 1440 850" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="hc-light"><stop stopColor="#ff9b71"/><stop offset="1" stopColor="#ff006c"/></linearGradient></defs><path className="hc-track" d="M 180 95 C 110 240, 220 355, 420 330 S 670 120, 970 300"/><path className="hc-travel" d="M 180 95 C 110 240, 220 355, 420 330 S 670 120, 970 300"/><circle cx="180" cy="95" r="3" fill="#ff9b71"/></svg>;
  if (variant === "D") return <div className="hc-constellation" aria-hidden="true">
    <svg viewBox="0 0 520 280">
      <defs><linearGradient id="hc-cube-color" x2="1" y2="1"><stop stopColor="#ffb188"/><stop offset="1" stopColor="#ff006c"/></linearGradient>
        <g id="hc-solid"><path className="hc-cube-face" d="M0 -65 57 -32 57 33 0 66 -57 33 -57 -32Z"/><path d="M0 -65 57 -32 57 33 0 66 -57 33 -57 -32Z M-57 -32 0 1 57 -32 M0 1V66"/><path className="hc-cube-back" d="M0 -65V1 M-57 33 0 1 57 33"/></g>
      </defs>
      <g className="hc-angular-frame">
        <path className="hc-facet hc-facet-coral" d="M36 110 153 30 207 119Z"/>
        <path className="hc-facet hc-facet-pink" d="M207 119 331 25 419 66Z"/>
        <path className="hc-facet hc-facet-mint" d="M207 119 365 228 176 249Z"/>
        <path className="hc-facet hc-facet-pink" d="M419 66 489 154 365 228Z"/>
        <path className="hc-frame-edge" d="M36 110 153 30 331 25 419 66 489 154 365 228 176 249 56 184Z M36 110 207 119 153 30 M331 25 207 119 419 66 M489 154 207 119 365 228 M176 249 207 119 56 184 M153 30 176 249 M331 25 365 228 M36 110 489 154"/>
        <path className="hc-frame-inner" d="M91 106 170 53 305 48 391 81 447 149 349 207 180 224 81 177Z M91 106 180 224 M305 48 349 207"/>
      </g>
      <g transform="translate(207 119)"><g className="hc-core"><use href="#hc-solid"/><circle r="4" fill="#ffd0b9" stroke="none"/></g></g>
      <g transform="translate(56 184) scale(.33)"><g className="hc-satellite"><use href="#hc-solid"/></g></g>
      <g transform="translate(419 66) scale(.45)"><g className="hc-satellite hc-satellite-two"><use href="#hc-solid"/></g></g>
      <g transform="translate(365 228) scale(.24)"><g className="hc-satellite hc-satellite-three"><use href="#hc-solid"/></g></g>
      <g className="hc-vertex-points"><rect x="33" y="107" width="6" height="6"/><rect x="150" y="27" width="6" height="6"/><rect x="328" y="22" width="6" height="6"/><rect x="486" y="151" width="6" height="6"/><rect x="173" y="246" width="6" height="6"/></g>
    </svg><span>INCUBATE <i/> CONNECT <i/> RISE</span>
  </div>;
  return null;
}

function Comparison() {
  const initial = new URLSearchParams(location.search).get("variant");
  const [variant, setVariant] = useState(options.some(o => o.id === initial) ? initial! : "A");
  const [replay, setReplay] = useState(0);
  const stageRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || variant === "current") return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let animations: Animation[] = [];
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (media.matches) return;
        const index = elements.indexOf(entry.target as HTMLElement);
        animations.push(entry.target.animate([
          { opacity: .15, transform: "translateY(22px)" },
          { opacity: 1, transform: "translateY(0)" },
        ], { duration: 800, delay: (index % 4) * 65, easing: "cubic-bezier(.23,1,.32,1)", fill: "backwards" }));
      });
    }, { threshold: .25 });
    const elements = Array.from(stage.querySelectorAll<HTMLElement>(".hc-site-header > b, .hc-site-header > span, .cr2-growth-sequence > span, .cr2-growth-sequence > strong, .cr2-hero-copy > *, .hc-constellation > span"));
    elements.forEach(element => observer.observe(element));
    const stop = () => { if (media.matches) { animations.forEach(a => a.cancel()); animations = []; } };
    media.addEventListener("change", stop);
    return () => { observer.disconnect(); animations.forEach(a => a.cancel()); media.removeEventListener("change", stop); };
  }, [variant, replay]);
  const active = options.find(o => o.id === variant)!;
  function select(id: string) {
    setVariant(id);
    const url = new URL(location.href); url.searchParams.set("variant", id); history.replaceState(null, "", url);
  }
  return <div className={`hc-page hc-${variant}`}>
    <header className="hc-toolbar"><div><span className="hc-eyebrow">INCURISE / HERO STUDIES</span><h1>4つの案を、同じ画面で。</h1></div>
      <div role="tablist" aria-label="Heroデザイン案" className="hc-tabs">{options.map((o, index) => <button key={o.id} id={`hc-tab-${o.id}`} role="tab" aria-selected={variant === o.id} aria-controls="hc-stage" tabIndex={variant === o.id ? 0 : -1} onClick={() => select(o.id)} onKeyDown={event => {
        let next = index;
        if (event.key === "ArrowRight") next = (index + 1) % options.length;
        else if (event.key === "ArrowLeft") next = (index + options.length - 1) % options.length;
        else if (event.key === "Home") next = 0;
        else if (event.key === "End") next = options.length - 1;
        else return;
        event.preventDefault(); select(options[next].id); document.getElementById(`hc-tab-${options[next].id}`)?.focus();
      }}><b>{o.id === "current" ? "現行" : o.id}</b><span>{o.name}</span></button>)}</div>
    </header>
    <div className="hc-caption"><div aria-live="polite"><strong>{active.title}</strong><span>{active.detail}</span></div><button className="hc-replay" disabled={variant === "current"} onClick={() => setReplay(value => value + 1)}>文字アニメーションを再生</button></div>
    <main ref={stageRef} id="hc-stage" role="tabpanel" aria-labelledby={`hc-tab-${variant}`}>
      <div className="hc-site-header"><a href="https://incurise.co.jp/" aria-label="インキュライズ公式サイト"><img src={logo} alt="INCURISE Consulting"/></a><b>RECRUIT 2026</b><span>DESIGN COMPARISON — {variant === "current" ? "CURRENT" : variant}</span></div>
      <Hero centerShift={variant === "C" ? -.055 : 0}><Decoration variant={variant}/></Hero>
    </main>
    <footer className="hc-footer">比較用の独立ページです。現在の採用サイトは変更していません。背景右下から動きを停止できます。<a href="../comment-revision/">現在の採用サイトを見る ↗</a></footer>
  </div>;
}
createRoot(document.getElementById("hero-comparison-root")!).render(<StrictMode><Comparison/></StrictMode>);

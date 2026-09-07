import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { Hero } from "./CommentRevisionApp";
import logo from "./assets/preview/incurise-logo.png";
import "./comment-revision.css";
import "./hero-comparison.css";

const options = [
  { id: "A", name: "TYPOGRAPHY", title: "大きな英字で、余白に意味を。", detail: "INCUBATE / RISEを淡いアウトラインで配置。ゆっくり浮かぶ文字が、右側の粒子と呼応します。" },
  { id: "B", name: "LIGHT PATH", title: "ひとつの光が、成長をつなぐ。", detail: "左上の数字から右側の立体へ。細い曲線に光が流れ、空白に視線の通り道をつくります。" },
  { id: "C", name: "REBALANCE", title: "足さずに、重心を整える。", detail: "コピーを上へ移動し、立体も少し中央へ。要素を増やさず、余白と情報のバランスを整えます。" },
  { id: "D", name: "BUILDING BLOCK", title: "点から線へ、線から立体へ。", detail: "小さな幾何学キューブが左中央で組み上がります。育成から成長へという物語を添える案です。" },
  { id: "current", name: "CURRENT", title: "現在のデザイン", detail: "変更前のHero。4案と同じ表示サイズで比較できます。" },
];

function Decoration({ variant }: { variant: string }) {
  if (variant === "A") return <div className="hc-type" aria-hidden="true"><span>INCUBATE</span><span>RISE</span></div>;
  if (variant === "B") return <svg className="hc-path" viewBox="0 0 1440 850" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="hc-light"><stop stopColor="#ff9b71"/><stop offset="1" stopColor="#ff006c"/></linearGradient></defs><path className="hc-track" d="M 180 95 C 110 240, 220 355, 420 330 S 670 120, 970 300"/><path className="hc-travel" d="M 180 95 C 110 240, 220 355, 420 330 S 670 120, 970 300"/><circle cx="180" cy="95" r="3" fill="#ff9b71"/></svg>;
  if (variant === "D") return <div className="hc-block" aria-hidden="true"><svg viewBox="0 0 180 180"><circle className="hc-seed" cx="90" cy="88" r="3"/><g className="hc-cube"><path d="M90 20 150 55 150 125 90 160 30 125 30 55Z M30 55 90 90 150 55 M90 90V160"/><path className="hc-hidden-edge" d="M90 20V90 M30 125 90 90 150 125"/></g></svg><span>FROM POTENTIAL TO POSSIBILITY</span></div>;
  return null;
}

function Comparison() {
  const initial = new URLSearchParams(location.search).get("variant");
  const [variant, setVariant] = useState(options.some(o => o.id === initial) ? initial! : "A");
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
    <div className="hc-caption" aria-live="polite"><strong>{active.title}</strong><span>{active.detail}</span></div>
    <main id="hc-stage" role="tabpanel" aria-labelledby={`hc-tab-${variant}`}>
      <div className="hc-site-header"><a href="https://incurise.co.jp/" aria-label="インキュライズ公式サイト"><img src={logo} alt="INCURISE Consulting"/></a><b>RECRUIT 2026</b><span>DESIGN COMPARISON — {variant === "current" ? "CURRENT" : variant}</span></div>
      <Hero centerShift={variant === "C" ? -.055 : 0}><Decoration variant={variant}/></Hero>
    </main>
    <footer className="hc-footer">比較用の独立ページです。現在の採用サイトは変更していません。背景右下から動きを停止できます。<a href="../comment-revision/">現在の採用サイトを見る ↗</a></footer>
  </div>;
}
createRoot(document.getElementById("hero-comparison-root")!).render(<StrictMode><Comparison/></StrictMode>);

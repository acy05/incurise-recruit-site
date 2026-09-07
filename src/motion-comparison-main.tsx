import {StrictMode, useEffect, useRef, useState} from "react";
import {createRoot} from "react-dom/client";
import {GeometricHero} from "./GeometricHero";
import logo from "./assets/preview/incurise-logo.png";
import arrow from "./assets/preview/growth-arrow.png";
import linkArrow from "./assets/preview/button-arrow-white.png";
import "./comment-revision.css";
import "./hero-comparison.css";
import "./layout-comparison.css";
import "./motion-comparison.css";
type Mode="A"|"B"|"C"|"D";
const modes: {id:Mode;name:string;description:string}[]=[
  {id:"A",name:"ASSEMBLE",description:"散らばった粒子が約2.4秒で立体へ集合します。「最初から再生」で登場演出を見直せます。"},
  {id:"B",name:"MORPH",description:"球体→多面体→リングへ、15秒で一巡。少し眺めて、形が移り変わる様子を比較してください。"},
  {id:"C",name:"REACT",description:"Hero上でマウスを動かしてください。立体が傾き、近くの粒子が押し広げられます。スマホはタップで反応します。"},
  {id:"D",name:"PASS THROUGH",description:"下へスクロールしてください。立体が拡大し、明るい次のセクションへ通り抜けます。"},
];
function App(){const initial=new URLSearchParams(location.search).get("motion");const [mode,setMode]=useState<Mode>(modes.some(x=>x.id===initial)?initial as Mode:"A");const [replay,setReplay]=useState(0);const hero=useRef<HTMLElement>(null);
  useEffect(()=>{if(mode!=="D")return;const el=hero.current;const copy=el?.querySelector<HTMLElement>(".lc-copy");if(!el||!copy)return;const media=matchMedia("(prefers-reduced-motion: reduce)");let raf=0;const update=()=>{raf=0;const p=media.matches||el.querySelector('[aria-pressed="true"]')?0:Math.max(0,Math.min(1,-el.getBoundingClientRect().top/el.offsetHeight));copy.style.transform=`translateY(${-p*110}px)`;copy.style.opacity=String(1-p*.95)};const scroll=()=>{if(!raf)raf=requestAnimationFrame(update)};window.addEventListener("scroll",scroll,{passive:true});media.addEventListener("change",update);update();return()=>{cancelAnimationFrame(raf);window.removeEventListener("scroll",scroll);media.removeEventListener("change",update);copy.style.transform="";copy.style.opacity=""}},[mode,replay]);
  function select(id:Mode){setMode(id);setReplay(v=>v+1);const url=new URL(location.href);url.searchParams.set("motion",id);history.replaceState(null,"",url);window.scrollTo({top:0,behavior:"instant"})}
  const active=modes.find(x=>x.id===mode)!;
  return <div className={`hc-page lc-page lc-1 mc-page mc-${mode}`}><header className="hc-toolbar"><div><span className="hc-eyebrow">INCURISE / MOTION STUDIES</span><h1>中央レイアウト、4つの動き。</h1></div><div className="hc-tabs" role="tablist" aria-label="モーションを比較">{modes.map((m,i)=><button key={m.id} id={`mc-tab-${m.id}`} role="tab" aria-selected={mode===m.id} aria-controls="mc-stage" tabIndex={mode===m.id?0:-1} onClick={()=>select(m.id)} onKeyDown={e=>{let n=i;if(e.key==="ArrowRight")n=(i+1)%4;else if(e.key==="ArrowLeft")n=(i+3)%4;else if(e.key==="Home")n=0;else if(e.key==="End")n=3;else return;e.preventDefault();select(modes[n].id);document.getElementById(`mc-tab-${modes[n].id}`)?.focus()}}><b>{m.id}</b><span>{m.name}</span></button>)}</div></header>
    <div className="hc-caption"><div aria-live="polite"><strong>{active.name}</strong><span>{active.description}</span></div><button className="hc-replay" onClick={()=>{setReplay(v=>v+1);window.scrollTo({top:0,behavior:"instant"})}}>最初から再生</button></div>
    <main role="tabpanel" id="mc-stage" aria-labelledby={`mc-tab-${mode}`}><div className="hc-site-header"><a href="https://incurise.co.jp/" aria-label="インキュライズ公式サイト"><img src={logo} alt="INCURISE Consulting"/></a><b>RECRUIT 2026</b><span>MOTION STUDY — {mode}</span></div>
      <section ref={hero} className="lc-hero" aria-labelledby="mc-title" key={`${mode}-${replay}`}><div className="lc-particles"><GeometricHero centerShift={-.24} motion={mode}/></div><div className="lc-shade" aria-hidden="true"/><div className="lc-copy"><p className="lc-label">INCURISE CONSULTING / RECRUIT 2026</p><h2 id="mc-title" aria-label="0から1の挑戦を、1から100の成長へ。"><span className="lc-title-line">0<img className="lc-arrow" src={arrow} alt=""/><strong>1</strong>の挑戦を、</span><span className="lc-title-line">1<img className="lc-arrow" src={arrow} alt=""/><strong>100</strong>の成長へ。</span></h2><div className="lc-bottom"><p className="lc-lead">未経験から技術を仕事にする人も、経験を次の事業へつなぐ人も。<br/>一人ひとりの現在地から、成長の続きをつくる。</p><a href="https://incurise.co.jp/about/">私たちを知る<img src={linkArrow} alt=""/></a></div></div><div className="mc-hint">{mode==="D"?"SCROLL TO EXPLORE":mode==="C"?"MOVE YOUR POINTER / TAP":"INCUBATE / RISE"}</div></section>
      {mode==="D"&&<section className="mc-next"><p>ABOUT / TRANSITION STUDY</p><h2>さらなる成長と成功へ、<br/>共に挑戦する</h2><span>次のセクションへの接続を確認するためのデモです。</span><button onClick={()=>window.scrollTo({top:0,behavior:"instant"})}>比較へ戻る</button></section>}
    </main><footer className="hc-footer"><span>比較用デモです。背景右下で一時停止できます。動きを減らす設定では静止表示になります。</span><a href="../layout-comparison/?layout=1">レイアウト比較へ戻る</a></footer></div>
}
createRoot(document.getElementById("motion-root")!).render(<StrictMode><App/></StrictMode>);

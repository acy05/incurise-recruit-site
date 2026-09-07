import {StrictMode, useState} from "react";
import {createRoot} from "react-dom/client";
import {GeometricHero} from "./GeometricHero";
import logo from "./assets/preview/incurise-logo.png";
import arrow from "./assets/preview/growth-arrow.png";
import linkArrow from "./assets/preview/button-arrow-white.png";
import "./comment-revision.css";
import "./hero-comparison.css";
import "./layout-comparison.css";
import "./motion-comparison.css";
import "./space-comparison.css";
const options = [
  {id:"A",name:"PARTICLE FLOW",space:"flow",description:"左右をつなぐ粒子の帯。画面全体に緩やかな流れをつくり、中央の立体と一体化します。"},
  {id:"B",name:"ORBITAL SPACE",space:"rings",description:"画面端からはみ出す巨大リング。左右に奥行きをつくり、空間の中に文字が浮かぶ構成です。"},
  {id:"C",name:"GEOMETRIC FIELD",space:"facets",description:"左右を覆う三角形の幾何学面。頂点がゆっくり動き、構造的でシャープな印象をつくります。"},
  {id:"D",name:"BEFORE",space:"default",description:"比較用の元の背景。文字位置・サイズは新しい3案と同じです。"},
  {id:"E",name:"PARTICLE FIELD",space:"scatter",description:"大きく明るい粒子雲＋手前のぼけた粒子。マウスで3層が異なる速度で動き、近くの粒子がふわっと避けます。「最初から再生」で見直せます。"},
] as const;
function App(){
 const initial=new URLSearchParams(location.search).get("space");
 const [selected,setSelected]=useState(Math.max(0,options.findIndex(o=>o.id===initial)));
 const [replay,setReplay]=useState(0);
 const active=options[selected];
 function select(i:number){setSelected(i);const url=new URL(location.href);url.searchParams.set("space",options[i].id);history.replaceState(null,"",url)}
 return <div className={`hc-page lc-page lc-1 mc-page sc-page sc-${active.id}`}>
 <header className="hc-toolbar"><div><span className="hc-eyebrow">INCURISE / SPATIAL STUDIES</span><h1>画面全体に広がる、粒子の空間。</h1></div><div className="hc-tabs" role="tablist" aria-label="背景を比較">{options.map((o,i)=><button key={o.id} role="tab" id={`space-tab-${i}`} aria-selected={selected===i} aria-controls="space-stage" tabIndex={selected===i?0:-1} onClick={()=>select(i)} onKeyDown={e=>{let n=i;if(e.key==="ArrowRight")n=(i+1)%options.length;else if(e.key==="ArrowLeft")n=(i+options.length-1)%options.length;else if(e.key==="Home")n=0;else if(e.key==="End")n=options.length-1;else return;e.preventDefault();select(n);document.getElementById(`space-tab-${n}`)?.focus()}}><b>{o.id}</b><span>{o.name}</span></button>)}</div></header>
 <div className="hc-caption"><div aria-live="polite"><strong>{active.name}</strong><span>{active.description}</span></div><button className="hc-replay" onClick={()=>setReplay(v=>v+1)}>最初から再生</button></div>
 <main id="space-stage" role="tabpanel" aria-labelledby={`space-tab-${selected}`}><div className="hc-site-header"><a href="https://incurise.co.jp/" aria-label="インキュライズ公式サイト"><img src={logo} alt="INCURISE Consulting"/></a><b>RECRUIT 2026</b><span>SPACE STUDY — {active.id}</span></div>
 <section className="lc-hero" aria-labelledby="space-title" key={`${selected}-${replay}`}><div className="lc-particles"><GeometricHero centerShift={-.24} space={active.space}/></div><div className="lc-shade" aria-hidden="true"/><div className="lc-copy"><p className="lc-label">{active.id === "E" ? "技術と人で、企業の変革を支える。" : "INCURISE CONSULTING / RECRUIT 2026"}</p><h2 id="space-title" aria-label="0から1の挑戦を、1から100の成長へ。"><span className="lc-title-line">0<img className="lc-arrow" src={arrow} alt=""/><strong>1</strong>の挑戦を{active.id === "E" ? <span className="sc-punctuation">、</span> : "、"}</span><span className="lc-title-line">1<img className="lc-arrow" src={arrow} alt=""/><strong>100</strong>の成長へ{active.id === "E" ? <span className="sc-punctuation">。</span> : "。"}</span></h2><div className="lc-bottom"><p className="lc-lead">{active.id === "E" && <>ITコンサルティングとシステム開発で、企業の挑戦を支える。<br/></>}未経験から技術を仕事にする人も、経験を次の事業へつなぐ人も。<br/>一人ひとりの現在地から、成長の続きをつくる。</p><a href="https://incurise.co.jp/about/">私たちを知る<img src={linkArrow} alt=""/></a></div></div><div className="mc-hint">INCUBATE / RISE</div></section></main>
 <footer className="hc-footer"><span>Eが全体に粒子を散らした新案です。A〜Dとも比較できます。右下で一時停止できます。</span><a href="../motion-comparison/?motion=A">モーション比較へ戻る</a></footer></div>
}
createRoot(document.getElementById("space-root")!).render(<StrictMode><App/></StrictMode>);

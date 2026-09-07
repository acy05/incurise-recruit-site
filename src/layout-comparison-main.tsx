import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import { GeometricHero } from "./GeometricHero";
import logo from "./assets/preview/incurise-logo.png";
import arrow from "./assets/preview/growth-arrow.png";
import linkArrow from "./assets/preview/button-arrow-white.png";
import "./comment-revision.css";
import "./hero-comparison.css";
import "./layout-comparison.css";

const layouts = [
  {id:"1",name:"CENTER",title:"中央コピー × 大きな立体",description:"文字を中央に集約。ひとつの立体が背景を包み、左右に分かれていた要素を統合します。"},
  {id:"2",name:"SPLIT",title:"左に立体 × 右にコピー",description:"左半分は幾何学の見せ場、右半分はメッセージ。視覚表現と読みやすさを分担します。"},
  {id:"3",name:"HORIZON",title:"上にコピー × 横に広がる成長",description:"見出し・幾何学・説明文を上下に分離。点から骨組み、立体へと横方向に展開します。"},
  {id:"4",name:"GROWTH",title:"0 → 1 → 100 が主役",description:"大きな数字と幾何学を一体化。日本語コピーは下に置き、成長の記号を主役にします。"},
];
function GrowthArrow(){return <img className="lc-arrow" src={arrow} alt=""/>}
function GrowthArt(){return <svg className="lc-growth-art" viewBox="0 0 1200 330" aria-hidden="true">
  <defs><linearGradient id="lc-gradient"><stop stopColor="#ffb188"/><stop offset="1" stopColor="#ff006c"/></linearGradient></defs>
  <path className="lc-construction" d="M90 165H1110 M290 90 600 20 1030 60 M290 240 600 310 1030 270"/>
  <g className="lc-dot"><circle cx="140" cy="165" r="9"/><circle cx="140" cy="165" r="34" fill="none" strokeWidth="1"/></g>
  <g className="lc-skeleton"><path d="M560 50 660 108 660 222 560 280 460 222 460 108Z M460 108 560 165 660 108 M560 165V280 M560 50V165 M460 222 560 165 660 222"/></g>
  <g className="lc-volume"><path className="lc-face" d="M990 22 1115 94 1115 238 990 310 865 238 865 94Z"/><path d="M990 22 1115 94 1115 238 990 310 865 238 865 94Z M865 94 990 166 1115 94 M990 166V310 M990 22V166 M865 238 990 166 1115 238 M927 58 1052 130 1052 274 M927 274V130L1052 58 M865 166 990 94 1115 166 990 238Z"/></g>
  <path className="lc-connector" d="M230 165H400 M710 165H820"/>
</svg>}
function App(){
  const initial=new URLSearchParams(location.search).get("layout");
  const [layout,setLayout]=useState(layouts.some(x=>x.id===initial)?initial!:"1");
  const [replay,setReplay]=useState(0);
  const active=layouts.find(x=>x.id===layout)!;
  function select(id:string){setLayout(id);const u=new URL(location.href);u.searchParams.set("layout",id);history.replaceState(null,"",u);}
  return <div className={`hc-page lc-page lc-${layout}`}>
    <header className="hc-toolbar"><div><span className="hc-eyebrow">INCURISE / LAYOUT STUDIES</span><h1>構図から変える、4つの案。</h1></div><div className="hc-tabs" role="tablist" aria-label="レイアウトを比較">{layouts.map((x,i)=><button key={x.id} id={`lc-tab-${x.id}`} role="tab" aria-selected={layout===x.id} aria-controls="lc-stage" tabIndex={layout===x.id?0:-1} onClick={()=>select(x.id)} onKeyDown={e=>{let n=i;if(e.key==="ArrowRight")n=(i+1)%4;else if(e.key==="ArrowLeft")n=(i+3)%4;else if(e.key==="Home")n=0;else if(e.key==="End")n=3;else return;e.preventDefault();select(layouts[n].id);document.getElementById(`lc-tab-${layouts[n].id}`)?.focus();}}><b>{x.id}</b><span>{x.name}</span></button>)}</div></header>
    <div className="hc-caption"><div aria-live="polite"><strong>{active.title}</strong><span>{active.description}</span></div><button className="hc-replay" onClick={()=>setReplay(v=>v+1)}>文字アニメーションを再生</button></div>
    <main id="lc-stage" role="tabpanel" aria-labelledby={`lc-tab-${layout}`}>
      <div className="hc-site-header"><a href="https://incurise.co.jp/" aria-label="インキュライズ公式サイト"><img src={logo} alt="INCURISE Consulting"/></a><b>RECRUIT 2026</b><span>LAYOUT STUDY — {layout}</span></div>
      <section className="lc-hero" aria-labelledby="lc-title">
        <div className="lc-particles"><GeometricHero centerShift={layout==="2"?-.46:layout==="1"?-.24:layout==="3"?-.15:-.24}/></div>
        <div className="lc-shade" aria-hidden="true"/>
        {layout==="3"&&<GrowthArt/>}
        {layout==="4"&&<div className="lc-numbers" aria-hidden="true" key={`numbers-${replay}`}><span>0</span><GrowthArrow/><strong>1</strong><GrowthArrow/><strong>100</strong></div>}
        <div className="lc-copy" key={`${layout}-${replay}`}>
          <p className="lc-label">INCURISE CONSULTING / RECRUIT 2026</p>
          <h2 id="lc-title" aria-label="0から1の挑戦を、1から100の成長へ。"><span className="lc-title-line">0<GrowthArrow/><strong>1</strong>の挑戦を、</span><span className="lc-title-line">1<GrowthArrow/><strong>100</strong>の成長へ。</span></h2>
          <div className="lc-bottom"><p className="lc-lead">未経験から技術を仕事にする人も、経験を次の事業へつなぐ人も。<br/>一人ひとりの現在地から、成長の続きをつくる。</p><a href="https://incurise.co.jp/about/">私たちを知る<img src={linkArrow} alt=""/></a></div>
        </div>
      </section>
    </main>
    <footer className="hc-footer"><span>比較専用ページです。採用サイト本体・前回の4案は変更していません。</span><a href="../hero-comparison/?variant=D">前回のD案と比較する</a></footer>
  </div>
}
createRoot(document.getElementById("layout-root")!).render(<StrictMode><App/></StrictMode>);

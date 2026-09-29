import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, Check, CheckCheck, Copy, Menu, Pause, Play, Plus, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import team from "./assets/generated/hero/hero-team.webp";
import "./isaac-complete.css";

const topics = ["新しくサイトをつくりたい", "今のサイトをリニューアル", "まずは相談してみたい"];
const consultationEmail = "hp_sales-bounces@isaac-inc.co.jp";
const nav = [["サービス", "services"], ["私たちの考え方", "approach"], ["制作の流れ", "process"], ["よくある質問", "faq"]];
const faqs = [
  ["何も決まっていなくても相談できますか？", "もちろんです。まだ言葉になっていない段階から、お話を伺いながら目的と優先順位を一緒に整理します。"],
  ["制作費用はどのくらいですか？", "ページ数、必要な機能、原稿や写真の準備範囲に応じて個別にお見積もりします。初回相談と概算見積もりは無料です。"],
  ["公開までにどのくらいかかりますか？", "規模や素材の準備状況によって異なります。ご希望の公開時期を伺い、要件整理・制作・確認を含めた日程をご提案します。"],
  ["文章や写真の準備もお願いできますか？", "はい。伝えたい内容の整理、原稿構成、撮影や素材準備の方法からご相談いただけます。"],
  ["公開後の運用やデータ分析も相談できますか？", "はい。更新・保守に加え、アクセス状況の整理や分析、改善提案もご相談いただけます。データ分析と継続改善は、公開後に必要な場合だけ選べる別契約のオプションです。"],
];

function LiquidMark({ compact = false }: { compact?: boolean }) {
  return <svg className={`isaac-liquid ${compact ? "is-compact" : ""}`} viewBox="0 0 620 620" aria-hidden="true">
    <g>
      <circle className="liquid-core" cx="310" cy="310" r="154"/>
      <circle className="liquid-orbit liquid-orbit-a" cx="142" cy="204" r="72"/>
      <circle className="liquid-orbit liquid-orbit-b" cx="470" cy="422" r="91"/>
      <circle className="liquid-orbit liquid-orbit-c" cx="432" cy="148" r="51"/>
    </g>
    <path className="liquid-line" d="M104 363C156 188 289 103 444 164c102 40 124 158 67 252-64 105-205 137-308 71-75-48-120-124-99-124Z"/>
  </svg>;
}

function HeroTalk({ topic, setTopic }: { topic: string; setTopic: (topic: string) => void }) {
  const card = useRef<HTMLDivElement>(null); const shell = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { const c=card.current,s=shell.current;if(!c||!s)return; const size=()=>s.style.height=`${c.offsetHeight}px`;size();const ro=new ResizeObserver(size);ro.observe(c);return()=>ro.disconnect();},[]);
  return <div className="fd-c-chat-shell hero-talk-shell" ref={shell}><div className="fd-c-chat hero-talk" ref={card}>
    <div className="hero-talk-top"><span>LET’S TALK</span><span>01 / HELLO</span></div>
    <h2>いま、どんなことを<br/>考えていますか？</h2>
    <div className="hero-talk-options" role="group" aria-label="相談テーマ">{topics.map((item,index)=><button key={item} aria-pressed={topic===item} onClick={()=>setTopic(item)}><small>0{index+1}</small><span>{item}</span><i>{topic===item ? "●" : "○"}</i></button>)}</div>
    <a className="fd-cta hero-talk-cta" href="#contact"><span>{topic === topics[0] ? "新しいサイトについて話す" : topic === topics[1] ? "リニューアルについて話す" : "まずは気軽に話す"}</span><ArrowUpRight size={16}/></a>
  </div></div>;
}

function Consultation({ topic, setTopic }: { topic: string; setTopic: (topic: string) => void }) {
  const [message,setMessage]=useState(""); const [copied,setCopied]=useState(false); const [copyError,setCopyError]=useState(false); const timer=useRef<ReturnType<typeof setTimeout>>();
  useEffect(()=>()=>clearTimeout(timer.current),[]); useEffect(()=>{setCopied(false);setCopyError(false);clearTimeout(timer.current)},[topic,message]);
  const content=`Web制作のご相談\n相談したいこと：${topic}\n${message ? `補足：${message}` : "詳細はお話ししながら相談したいです。"}`;
  const href=`mailto:${consultationEmail}?subject=${encodeURIComponent("Web制作のご相談")}&body=${encodeURIComponent(content)}`;
  const copy=async()=>{try{await navigator.clipboard.writeText(content);setCopied(true);timer.current=setTimeout(()=>setCopied(false),3000)}catch{setCopyError(true)}};
  return <div className="consultation">
    <p className="consultation-kicker"><i/> LET’S START A CONVERSATION</p><h3>いま、どんなことを<br/>考えていますか？</h3>
    <fieldset><legend>ご相談のきっかけ</legend>{topics.map(item=><label key={item} className={topic===item?"selected":""}><input type="radio" name="topic" checked={topic===item} onChange={()=>setTopic(item)}/><span>{item}</span>{topic===item?<Check size={17}/>:<Plus size={17}/>}</label>)}</fieldset>
    <label className="message-label" htmlFor="consultation-message">もう少し詳しく <span>任意</span></label>
    <textarea id="consultation-message" value={message} onChange={e=>setMessage(e.target.value)} maxLength={2000} placeholder="例：新サービスのLPをつくりたい。予算や進め方から相談したいです。" rows={4}/>
    <div className="consultation-next"><button type="button" className="copy-button" onClick={copy}>{copied?<CheckCheck size={16}/>:<Copy size={16}/>} {copied?"コピーしました":"相談内容をコピー"}</button><span aria-live="polite">{copyError?"コピーできませんでした。内容を選択してコピーしてください。":"選択した内容は、メール本文にも反映されます。"}</span></div>
    {copyError&&<div className="manual-copy"><label htmlFor="consultation-copy-fallback">こちらを選択してコピーしてください</label><textarea id="consultation-copy-fallback" readOnly value={content} onFocus={e=>e.currentTarget.select()} rows={4}/></div>}
    <a className="mail-cta" href={href}><span>メールで無料相談する</span><ArrowUpRight size={20}/></a><p className="contact-note">メールアプリが開きます。内容をご確認のうえ送信してください。</p>
  </div>;
}

function SectionLabel({ children }: { children: React.ReactNode }) { return <div className="section-label"><span>{children}</span><i/></div>; }

export default function IsaacCompleteLanding(){
  const root=useRef<HTMLDivElement>(null); const menuButton=useRef<HTMLButtonElement>(null); const menuPanel=useRef<HTMLElement>(null);
  const [topic,setTopic]=useState(topics[2]); const [menuOpen,setMenuOpen]=useState(false); const [paused,setPaused]=useState(()=>matchMedia("(prefers-reduced-motion: reduce)").matches); const [reduced,setReduced]=useState(false); const [activeFaq,setActiveFaq]=useState<number|null>(0); const [faqInstant,setFaqInstant]=useState(false);
  useEffect(()=>{const q=matchMedia("(prefers-reduced-motion: reduce)");const update=()=>{setReduced(q.matches);setPaused(q.matches)};update();q.addEventListener("change",update);return()=>q.removeEventListener("change",update)},[]);
  useEffect(()=>{const scenes=Array.from(root.current?.querySelectorAll<HTMLElement>(".hero-complete,.approach,.statement,.contact")??[]);const observer=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle("motion-scene-active",entry.isIntersecting)),{rootMargin:"100px"});scenes.forEach(scene=>observer.observe(scene));return()=>observer.disconnect()},[]);
  useLayoutEffect(()=>{if(!root.current||paused||reduced)return;gsap.registerPlugin(ScrollTrigger);const ctx=gsap.context(()=>{
    gsap.from(".hero-word > span",{yPercent:110,duration:1.05,stagger:.09,ease:"power4.out"});
    gsap.from(".hero-meta, .hero-side, .hero-talk-shell",{opacity:0,y:24,duration:.8,stagger:.11,delay:.28,ease:"power3.out"});
    gsap.to(".hero-liquid-wrap",{yPercent:38,rotate:18,scale:1.18,ease:"none",scrollTrigger:{trigger:".hero-complete",start:"top top",end:"bottom top",scrub:.8}});
    gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach(el=>gsap.fromTo(el,{clipPath:"inset(0 0 100% 0)",y:24},{clipPath:"inset(0 0 0% 0)",y:0,duration:.95,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 88%",once:true}}));
    gsap.to(".work-track",{xPercent:-32,ease:"none",scrollTrigger:{trigger:".works-stage",start:"top 76%",end:"bottom 28%",scrub:1}});
  },root);return()=>ctx.revert()},[reduced]);
  useEffect(()=>{const wide=matchMedia("(min-width: 901px)");const close=()=>{if(wide.matches)setMenuOpen(false)};wide.addEventListener("change",close);return()=>wide.removeEventListener("change",close)},[]);
  useEffect(()=>{if(!menuOpen)return;const old=document.body.style.overflow;document.body.style.overflow="hidden";menuPanel.current?.querySelector<HTMLAnchorElement>("a")?.focus();const key=(e:KeyboardEvent)=>{if(e.key==="Escape"){setMenuOpen(false);return}if(e.key!=="Tab")return;const all=[menuButton.current,...Array.from(menuPanel.current?.querySelectorAll<HTMLAnchorElement>("a")??[])].filter(Boolean) as HTMLElement[];const i=all.indexOf(document.activeElement as HTMLElement);e.preventDefault();all[(i+(e.shiftKey?-1:1)+all.length)%all.length]?.focus()};document.addEventListener("keydown",key);return()=>{document.body.style.overflow=old;document.removeEventListener("keydown",key);menuButton.current?.focus({preventScroll:true})}},[menuOpen]);
  useEffect(()=>{const container=root.current!;let request=0;const frame=()=>new Promise<void>(r=>requestAnimationFrame(()=>r()));const animateScroll=(top:number,token:number)=>{const start=scrollY;const distance=top-start;const begun=performance.now();const duration=680;const tick=(now:number)=>{if(token!==request)return;const progress=Math.min(1,(now-begun)/duration);const eased=1-Math.pow(1-progress,4);scrollTo(0,start+distance*eased);if(progress<1)requestAnimationFrame(tick)};requestAnimationFrame(tick)};const navigate=async(hash:string,initial=false)=>{const current=++request;let id:string;try{id=decodeURIComponent(hash.slice(1))}catch{return}const section=document.getElementById(id);if(!section||!container.contains(section))return;await frame();await frame();await Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,400))]);const animations=Array.from(container.querySelectorAll<HTMLElement>(".faq-answer")).flatMap(a=>a.getAnimations());await Promise.allSettled(animations.map(a=>a.finished));if(current!==request)return;const anchor=section.matches("section")?section.querySelector<HTMLElement>(".section-label, .fd-label")??section:section;let top=0;for(let node:HTMLElement|null=anchor;node;node=node.offsetParent as HTMLElement|null)top+=node.offsetTop;top=id==="top"?0:Math.max(0,top-32);const sameHash=location.hash===hash;if(!initial&&!sameHash)history.pushState(null,"",hash);if(!section.hasAttribute("tabindex"))section.tabIndex=-1;section.focus({preventScroll:true});const off=matchMedia("(prefers-reduced-motion: reduce)").matches||container.classList.contains("motion-paused");if(initial||off||sameHash)scrollTo({top,behavior:"instant"});else animateScroll(top,current)};const click=(e:MouseEvent)=>{if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const link=(e.target as Element).closest<HTMLAnchorElement>("a[href]");if(!link||link.target&&link.target!=="_self")return;const url=new URL(link.href);if(!url.hash||url.origin!==location.origin||url.pathname!==location.pathname||url.search!==location.search)return;e.preventDefault();setMenuOpen(false);void navigate(url.hash)};const hash=()=>void navigate(location.hash||"#top",true);const cancel=()=>request++;container.addEventListener("click",click);addEventListener("hashchange",hash);addEventListener("wheel",cancel,{passive:true});addEventListener("touchstart",cancel,{passive:true});if(location.hash)void navigate(location.hash,true);return()=>{request++;container.removeEventListener("click",click);removeEventListener("hashchange",hash);removeEventListener("wheel",cancel);removeEventListener("touchstart",cancel)}},[]);
  return <div ref={root} id="top" className={`studio isaac-complete ${paused?"motion-paused":""} ${reduced?"motion-reduced":""}`}>
    <a className="skip-link" href="#main">本文へ移動</a>
    <header className="studio-header"><a className="brand" href="#top" aria-label="ISAAC トップ">ISAAC<span>WEB<br/>DESIGN<br/>STUDIO</span></a><nav className="desktop-nav" aria-label="メインナビゲーション">{nav.map(([t,id])=><a key={id} href={`#${id}`}>{t}</a>)}</nav><div className="header-actions"><a className="header-contact" href="#contact">無料で相談する</a><button ref={menuButton} className="menu-button" aria-label={menuOpen?"メニューを閉じる":"メニューを開く"} aria-expanded={menuOpen} aria-controls="mobile-menu" onClick={()=>setMenuOpen(!menuOpen)}>{menuOpen?<X/>:<Menu/>}</button></div></header>
    <nav ref={menuPanel} id="mobile-menu" className="mobile-menu" aria-label="モバイルナビゲーション" hidden={!menuOpen}>{nav.map(([t,id],i)=><a key={id} href={`#${id}`} onClick={()=>setMenuOpen(false)}><small>0{i+1}</small>{t}</a>)}<a href="#contact" onClick={()=>setMenuOpen(false)}><small>05</small>無料で相談する</a></nav>
    <main id="main">
      <section className="hero-complete" aria-labelledby="hero-title">
        <div className="hero-meta"><span>HELLO. WE’RE ISAAC.</span><span>TOKYO / JAPAN</span></div>
        <h1 id="hero-title"><span className="hero-word"><span>いいWebを、</span></span><span className="hero-word hero-word-offset"><span>いい<span className="hero-accent">対話</span>から。</span></span></h1>
        <div className="hero-side"><p>事業の本質を聞き、<br/>まだ曖昧な考えに輪郭を与える。<br/>言葉、デザイン、技術をひとつにして、<br/>人を動かすWebをつくります。</p><a href="#intro">OUR PHILOSOPHY <span>↓</span></a></div>
        <div className="hero-liquid-wrap"><LiquidMark/><span className="liquid-caption">DIALOGUE<br/>BECOMES<br/>FORM.</span></div>
        <HeroTalk topic={topic} setTopic={setTopic}/>
        <div className="hero-bottom"><span>DESIGN WITH PURPOSE</span><span>✳</span><span>IDEAS INTO IMPACT</span><span>✳</span><span>BUILT WITH CARE</span></div>
      </section>

      <section className="intro editorial-shell" id="intro"><SectionLabel>01 / WHY ISAAC</SectionLabel><div className="manifesto"><p className="manifesto-index">GOOD RELATIONSHIPS<br/>MAKE GOOD WEBSITES.</p><h2 data-reveal>つくる前に、<br/><em>知る。</em></h2><div className="manifesto-copy" data-reveal><p className="large-copy">まだ言葉になっていない想いほど、丁寧に聞く。</p><p>私たちは、見た目から始めません。事業の目的、届けたい相手、会社らしさを対話の中から見つけ、必要な言葉と体験へ編み直します。</p><p>ブランドの判断は人が担い、実装にはAIも活用する。品質とスピードの両方を、目的に合わせて設計します。</p><a className="text-link" href="#approach">私たちが大切にしていること</a></div></div></section>

      <section className="services editorial-shell" id="services"><SectionLabel>02 / WHAT WE DO</SectionLabel><div className="services-head"><h2 data-reveal>目的から、<br/>Webの<span>形</span>を決める。</h2><p>決まった型に当てはめず、<br/>事業に必要な接点を一から設計します。</p></div><div className="service-ledger">{[
        ["01","CORPORATE","会社の魅力を、信頼に。","事業の強みや想いを整理し、選ばれる理由が伝わる企業サイトへ。","企業ブランディング / リニューアル"],
        ["02","LANDING PAGE","興味を、次の行動へ。","伝わる順序と迷わない導線で、相談や購入につながる体験をつくります。","新規事業 / 広告・集客"],
        ["03","RECRUIT","ここで働く、をつくる。","人、仕事、カルチャー。募集要項だけでは伝わらない会社らしさを届けます。","採用ブランディング / カルチャー発信"]
      ].map(([n,en,title,body,tags])=><article key={n} data-reveal><span className="service-number">{n}</span><p className="service-en">{en}</p><h3>{title}</h3><p className="service-body">{body}</p><small>{tags}</small><a className="service-consult text-link" href="#contact">相談する</a></article>)}</div></section>

      <section className="works-stage" id="design-samples"><div className="works-heading editorial-shell"><p className="fd-label">03 / DESIGN STUDIES</p><h2>違う答えを、<br/><span>同じ型でつくらない。</span></h2><p>目的と空気に合わせて、表現も変える。<br/>ISAACが考える3つのデザインサンプルです。</p></div><div className="work-viewport"><div className="work-track">
        <a className="work-panel work-sora" href={`${import.meta.env.BASE_URL}web-production/samples/sora/`}><div><span>01 / CORPORATE SITE</span><h3>SORA</h3><p>余白と、暮らす。</p></div><img src={`${import.meta.env.BASE_URL}isaac/samples/sora-courtyard.webp`} width="1448" height="1086" loading="lazy" alt="木と光のある建築空間"/><strong>VIEW SAMPLE</strong></a>
        <a className="work-panel work-next" href={`${import.meta.env.BASE_URL}web-production/samples/next/`}><div><span>02 / RECRUIT SITE</span><h3>next.</h3><p>次の自分を、おもしろく。</p></div><img src={team} width="1586" height="992" loading="lazy" alt="テーブルを囲んで話すチーム"/><strong>VIEW SAMPLE</strong></a>
        <a className="work-panel work-mellow" href={`${import.meta.env.BASE_URL}web-production/samples/mellow/`}><div><span>03 / LANDING PAGE</span><h3>mellow</h3><p>A little closer to nature.</p></div><img src={`${import.meta.env.BASE_URL}isaac/samples/mellow-botanical.webp`} width="1122" height="1402" loading="lazy" alt="自然光とボタニカルボディミルク"/><strong>VIEW SAMPLE</strong></a>
      </div></div><p className="works-note editorial-shell">掲載は制作実績ではなく、オリジナルのデザインサンプルです。</p></section>

      <section className="approach" id="approach"><div className="approach-visual"><LiquidMark/><p>THINK.<br/>MAKE.<br/>MOVE.</p></div><div className="approach-content"><SectionLabel>04 / OUR APPROACH</SectionLabel><h2 data-reveal>人が考え、<br/>技術で<span>加速</span>する。</h2><p className="approach-lead">効率化のために、判断を手放さない。<br/>人とAIの役割を分け、品質を守ります。</p><div className="approach-list">{[["01","本質を聞く","誰に、何を届け、どう動いてほしいか。デザインの前に目的を揃えます。"],["02","らしさを編集する","言葉、写真、余白、動き。それぞれに理由を持たせ、固有の表現へ。"],["03","速く、丁寧につくる","AIも活用しながら実装と検証を進め、人の判断に時間を使います。"]].map(([n,t,b])=><article key={n} data-reveal><span>{n}</span><h3>{t}</h3><p>{b}</p></article>)}</div></div></section>

      <section className="process editorial-shell" id="process"><SectionLabel>05 / HOW WE WORK</SectionLabel><div className="process-head"><h2 data-reveal>迷わないための、<br/>4つの対話。</h2><p>節目ごとに確かめながら、<br/>小さな合意を重ねて進めます。</p></div><div className="process-path">{[["01","LISTEN","まずは、お話から。","構想段階でも大丈夫です。悩みや叶えたいことを伺います。"],["02","PLAN","道筋を、一緒に。","目的、必要な機能、制作範囲、費用と日程を整理します。"],["03","CREATE","想いを、かたちに。","構成、デザイン、実装。途中の状態も共有しながら進めます。"],["04","LAUNCH","届けて、始める。","PC・スマートフォンの表示と操作を確認し、公開まで伴走します。"]].map(([n,en,t,b])=><article key={n} data-reveal><div><span>{n}</span><small>{en}</small></div><h3>{t}</h3><p>{b}</p></article>)}</div>
        <aside className="aftercare-option" data-reveal><div><small>OPTION / AFTER LAUNCH</small><h3>公開後は、<br/>データで育てる。</h3></div><p>アクセス状況やお問い合わせの動きを整理し、改善の優先順位をご提案します。必要な場合だけ選べる、サイト制作とは別契約のオプションです。</p><a className="text-link" href="#contact">公開後の改善を相談する</a></aside>
      </section>

      <section className="statement"><div className="statement-liquid"><LiquidMark compact/></div><p>FROM A SMALL CONVERSATION</p><h2 data-reveal>まだ曖昧な想いを、<br/><span>届くかたち</span>へ。</h2><small>IDEAS INTO IMPACT.</small></section>

      <section className="faq editorial-shell" id="faq"><div className="faq-heading"><SectionLabel>06 / FAQ</SectionLabel><h2>気になること、<br/>先にお答えします。</h2><p>ここにないご質問も、どうぞお気軽に。</p><a className="text-link" href="#contact">質問してみる</a></div><div className="faq-list" data-instant={faqInstant}>{faqs.map(([q,a],i)=><article className={activeFaq===i?"faq-open":""} key={q}><h3><button id={`faq-question-${i}`} aria-expanded={activeFaq===i} aria-controls={`faq-answer-${i}`} onClick={e=>{setFaqInstant(e.detail===0);setActiveFaq(activeFaq===i?null:i)}}><span>Q.{String(i+1).padStart(2,"0")}</span>{q}<svg className="faq-toggle-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M5 12h14"/><path className="faq-toggle-stem" d="M12 5v14"/></svg></button></h3><div className="faq-answer" id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-question-${i}`} aria-hidden={activeFaq!==i}><div className="faq-answer-inner"><p>{a}</p></div></div></article>)}</div></section>

      <section className="contact editorial-shell" id="contact" tabIndex={-1}><div className="contact-copy"><SectionLabel>07 / LET’S TALK</SectionLabel><h2>話すことから、<br/><span>はじめよう。</span></h2><p>うまく説明できなくても大丈夫。<br/>あなたの「こんなことできる？」を聞かせてください。</p><div className="contact-benefits"><span><Check size={15}/>初回相談・お見積もり無料</span><span><Check size={15}/>オンラインで全国対応</span><span><Check size={15}/>構想段階・相見積もりも歓迎</span></div><div className="contact-liquid"><LiquidMark compact/></div></div><Consultation topic={topic} setTopic={setTopic}/></section>
    </main>
    <footer className="studio-footer"><div className="footer-top"><a className="brand" href="#top">ISAAC<span>WEB DESIGN STUDIO</span></a><a href="#top">BACK TO TOP <ArrowUp size={16}/></a></div><div className="footer-bottom"><span>© {new Date().getFullYear()} ISAAC</span><div><a href="https://www.isaac-inc.co.jp/" target="_blank" rel="noreferrer">運営会社 <ArrowUpRight size={12}/></a><a href="https://www.isaac-inc.co.jp/privacy.php" target="_blank" rel="noreferrer">プライバシーポリシー <ArrowUpRight size={12}/></a></div><span>IDEAS INTO DIGITAL EXPERIENCES.</span></div></footer>
    <button className="motion-control" onClick={()=>setPaused(v=>!v)} aria-label={paused?"アニメーションを再生":"アニメーションを一時停止"} aria-pressed={paused}>{paused?<Play size={13}/>:<Pause size={13}/>}<span>MOTION {paused?"OFF":"ON"}</span></button>
  </div>;
}

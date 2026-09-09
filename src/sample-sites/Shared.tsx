import { useEffect, useId, useRef, useState, type ReactNode, type FormEvent } from "react";
import { NavigationIcon } from "./NavigationIcon";
export { NavigationIcon } from "./NavigationIcon";
export const base = `${import.meta.env.BASE_URL}web-production/`;
export const asset = (name: string) => `${import.meta.env.BASE_URL}isaac/samples/${name}`;
export function DemoBar({site}: {site: string}) {
  return <aside className="demo-bar"><a href={`${base}#design-samples`}><NavigationIcon direction="back"/>ISAACに戻る</a><span>架空ブランドのデザインサンプル</span><nav aria-label="サンプル切り替え">{["sora","next","mellow"].map(s=><a key={s} href={`${base}samples/${s}/`} aria-current={site===s?"page":undefined}>{s === "sora" ? "SORA" : s === "next" ? "next." : "mellow"}</a>)}</nav></aside>;
}
export function SiteHeader({logo,links,action}:{logo:ReactNode;links:[string,string][];action?:ReactNode}) {
  const [open,setOpen]=useState(false); const trigger=useRef<HTMLButtonElement>(null); const header=useRef<HTMLElement>(null); const id=useId();
  useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==="Escape"&&open){setOpen(false);trigger.current?.focus({preventScroll:true});}};document.addEventListener("keydown",key);return()=>document.removeEventListener("keydown",key);},[open]);
  useEffect(() => {
    const wide = matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => { if (wide.matches) setOpen(false); };
    wide.addEventListener("change", closeOnDesktop);
    return () => wide.removeEventListener("change", closeOnDesktop);
  }, []);
  useEffect(() => {
    if (!open) return;
    // The demo bar scrolls away, so use the header's actual bottom edge.
    const fitMenu = () => {
      const element = header.current;
      if (element) element.style.setProperty("--ss-menu-top", `${element.getBoundingClientRect().bottom}px`);
    };
    fitMenu();
    window.addEventListener("resize", fitMenu);
    window.addEventListener("scroll", fitMenu, { passive: true });
    return () => {
      window.removeEventListener("resize", fitMenu);
      window.removeEventListener("scroll", fitMenu);
      header.current?.style.removeProperty("--ss-menu-top");
    };
  }, [open]);
  return <header ref={header} className="ss-header"><a className="ss-logo" href="#top" aria-label="トップへ">{logo}</a><nav id={id} className={open?"ss-nav is-open":"ss-nav"} aria-label="メインナビゲーション">{links.map(([label,href])=><a key={href} href={href} onClick={()=>setOpen(false)}>{label}</a>)}</nav><div className="ss-header-action">{action}</div><button className="ss-menu" ref={trigger} onClick={()=>setOpen(!open)} aria-expanded={open} aria-controls={id} aria-label={open?"メニューを閉じる":"メニューを開く"}>{open?"✕":"☰"}</button></header>;
}
export function Modal({title,close,children}:{title:string;close:()=>void;children:ReactNode}) {
  const ref=useRef<HTMLDialogElement>(null); const id=useId();
  const [closing,setClosing]=useState(false);
  const dismissing=useRef(false);
  const timer=useRef<ReturnType<typeof setTimeout>>();
  useEffect(()=>{
    const d=ref.current!;
    const prev=document.activeElement as HTMLElement;
    const body=document.body;
    const overflow=body.style.overflow;
    const padding=body.style.paddingRight;
    const gutter=innerWidth-document.documentElement.clientWidth;
    const basePadding=parseFloat(getComputedStyle(body).paddingRight)||0;
    d.showModal();
    body.style.overflow="hidden";
    if(gutter>0)body.style.paddingRight=`${basePadding+gutter}px`;
    return()=>{
      clearTimeout(timer.current);
      const x=scrollX,y=scrollY;
      d.close();
      body.style.overflow=overflow;
      body.style.paddingRight=padding;
      prev?.focus({preventScroll:true});
      window.scrollTo({left:x,top:y,behavior:"instant"});
    };
  },[]);
  function dismiss(){
    if(dismissing.current)return;
    dismissing.current=true;
    const motionOff=ref.current?.closest('[data-motion="off"]') || matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(motionOff){close();return;}
    const d=ref.current!;
    const style=getComputedStyle(d);
    d.style.setProperty("--close-opacity",style.opacity);
    d.style.setProperty("--close-transform",style.transform);
    d.style.setProperty("--close-backdrop-opacity",getComputedStyle(d,"::backdrop").opacity);
    setClosing(true);
    timer.current=setTimeout(close,280);
  }
  return <dialog ref={ref} className={`ss-modal${closing?" is-closing":""}`} aria-labelledby={id} onCancel={e=>{e.preventDefault();dismiss();}} onClick={e=>{if(e.target===e.currentTarget){const r=e.currentTarget.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dismiss();}}}><div className="ss-modal-head"><h2 id={id}>{title}</h2><button onClick={dismiss} aria-label="閉じる" autoFocus>✕</button></div>{children}</dialog>;
}
export function DemoForm({kind,subject}:{kind:"相談"|"応募";subject?:string}) {
  const [done,setDone]=useState(false);const [values,setValues]=useState({name:"",email:"",message:""});const id=useId();
  function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();const data=new FormData(e.currentTarget);setValues({name:String(data.get("name")||""),email:String(data.get("email")||""),message:String(data.get("message")||"")});setDone(true);}
  if(done)return <div className="ss-form-result" role="status" tabIndex={-1} ref={el=>el?.focus()}><span className="ss-eyebrow">DEMO COMPLETED</span><h3>{kind}内容の確認ができました。</h3><dl className="ss-specs"><div><dt>お名前</dt><dd>{values.name}</dd></div><div><dt>メール</dt><dd>{values.email}</dd></div>{subject&&<div><dt>職種</dt><dd>{subject}</dd></div>}<div><dt>メッセージ</dt><dd className="ss-confirm-message">{values.message || "記載なし"}</dd></div></dl><p>これはデザインサンプルです。入力内容は送信・保存されていません。</p><button className="ss-button" onClick={()=>setDone(false)}>フォームに戻る</button><a className="ss-text-link" href={`${base}#contact`}>このようなサイトの制作を相談する</a></div>;
  return <form className="ss-form" onSubmit={submit}>
    <p className="ss-demo-note">フォームの操作デモです。個人情報は入力せず、テスト用の内容でお試しください。送信・保存はされません。</p>
    {subject&&<p className="ss-form-subject">選択した職種：<strong>{subject}</strong></p>}
    <div className="ss-form-two"><label htmlFor={`${id}-name`}>お名前 <small>必須</small><input id={`${id}-name`} name="name" defaultValue={values.name} required maxLength={60} placeholder="サンプル 太郎" autoComplete="off"/></label><label htmlFor={`${id}-email`}>メールアドレス <small>必須</small><input id={`${id}-email`} name="email" defaultValue={values.email} required type="email" maxLength={150} placeholder="sample@example.com" autoComplete="off"/></label></div>
    <label htmlFor={`${id}-message`}>{kind==="相談"?"つくりたい暮らしについて":"興味を持ったきっかけ"}<textarea id={`${id}-message`} name="message" defaultValue={values.message} rows={4} maxLength={2000} placeholder={kind==="相談"?"庭とつながる家で、ゆっくり暮らしたい。":"仕事やチームについて、もう少し知りたいです。"}/></label>
    <button className="ss-button" type="submit">{kind}内容を確認する（デモ）</button>
  </form>;
}
export function SiteFooter({brand,tagline}:{brand:string;tagline:string}) {
 return <footer className="ss-footer"><div><a href="#top" className="ss-footer-brand">{brand}</a><p>{tagline}</p></div><div><a href="#top">BACK TO TOP <NavigationIcon direction="up"/></a><a href={`${base}#design-samples`}>ISAACのサンプル一覧へ</a><small>© {new Date().getFullYear()} ISAAC DESIGN SAMPLE<br/>掲載するブランド・人物紹介・プロジェクト・商品情報は架空です。</small></div></footer>;
}

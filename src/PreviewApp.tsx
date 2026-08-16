import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import logo from "./assets/preview/incurise-logo.png";
import hero from "./assets/preview/hero.png";
import heroMobile from "./assets/preview/hero-mobile.png";
import careerChanger from "./assets/preview/career-changer.png";
import experienced from "./assets/preview/experienced.png";
import story01 from "./assets/preview/story-01.png";
import story02 from "./assets/preview/story-02.png";
import story03 from "./assets/preview/story-03.png";
import mentor from "./assets/preview/mentor.png";
import workshop from "./assets/preview/workshop.png";
import growthArrow from "./assets/preview/growth-arrow.png";
import buttonArrowDark from "./assets/preview/button-arrow-dark.png";
import buttonArrowWhite from "./assets/preview/button-arrow-white.png";
import wantedly from "./assets/preview/wantedly.png";
import notion from "./assets/preview/notion.png";

const navItems = [
  ["ABOUT", "#about"],
  ["PEOPLE", "#people"],
  ["CAREER", "#career"],
  ["SUPPORT", "#support"],
  ["BENEFITS", "#benefits"],
  ["JOBS", "#jobs"],
  ["FAQ", "#faq"],
] as const;

const footerNavItems = [
  ["ABOUT", "#about"],
  ["PEOPLE", "#people"],
  ["WORK", "#starting"],
  ["CAREER", "#career"],
  ["BENEFITS", "#benefits"],
  ["JOBS", "#jobs"],
] as const;

gsap.registerPlugin(ScrollTrigger);

const values = [
  ["01", "Confidence", "自信"],
  ["02", "Integrity", "誠実"],
  ["03", "Hungry", "貪欲"],
  ["04", "Proactivity", "主体性"],
  ["05", "Flexibility", "柔軟性"],
] as const;

const supportItems = [
  ["01", "プログラミング研修", "Javaを中心に、入社後3カ月間集中して学ぶ。"],
  ["02", "eラーニング", "待機期間もオンラインで継続的に学べる。"],
  ["03", "コンサル研修", "キャリアアップに必要な基礎と実践を学ぶ。"],
  ["04", "メンター制度", "役員との月1回の1on1でキャリアを相談する。"],
  ["05", "サポーター制度", "先輩社員が月2回フォローし、現場の不安を支える。"],
  ["06", "資格取得補助", "対象資格の合格を祝い、受験と学びを後押しする。"],
] as const;

const benefits = [
  ["01", "有給・夏季休暇", "入社6カ月後に有給10日。夏季休暇は8〜9月に4日取得。"],
  ["02", "帰社する？制度", "帰社時の飲食代を補助し、仲間との対話をつくる。"],
  ["03", "リファラル採用", "紹介から採用につながった社員へ報酬金を支給。"],
  ["04", "イベント制度", "隔月の懇親会で部署を越えた関係を育てる。"],
  ["05", "IKETERU Consultant", "コンサルへのキャリアチェンジを制度で後押しする。"],
  ["06", "全社員集会／決起集会", "報告とイベントで、会社の現在地と次の挑戦を共有する。"],
] as const;

type CareerStage = { meta: string; title: string; body: ReactNode };

const commonCareer: CareerStage[] = [
  { meta: "STEP 01 / 280–320万円", title: "Trainer / トレーニー", body: "研修で初現場に備え、SEとしてのINPUT期間をつくる。" },
  { meta: "STEP 02 / 300–420万円", title: "SE", body: "開発メンバーとして自走し、社内タスクにも挑戦する。" },
];

const consultingCareer: CareerStage[] = [
  { meta: "03 / 400–500万円", title: "Associate", body: "コンサルワークを理解する" },
  { meta: "04 / 480–600万円", title: "Consultant", body: "メンバーとして自走する" },
  { meta: "05 / 600–800万円", title: "Senior Consultant", body: "1プロジェクトを遂行する" },
];

const engineeringCareer: CareerStage[] = [
  { meta: "03 / 420–600万円", title: "SE Lead", body: "開発チームの運営を担う" },
  { meta: "04 / 500–800万円", title: "Tech Lead", body: "設計と技術判断の中核を担う" },
  { meta: "05 / 役割連動", title: "Specialist", body: "専門性を深め、価値を広げる" },
];

const faqs = [
  ["IT業界が未経験でも応募できますか？", "はい。3カ月の基礎研修やメンター支援を用意し、学びを実務へつなげる前提で選考します。"],
  ["キャリアはどのように選べますか？", "SEを基礎に、技術を深める道とコンサルタントへ広げる道を選択できます。途中で志向を見直すこともできます。"],
  ["配属やプロジェクトはどのように決まりますか？", "経験、伸ばしたい領域、プロジェクト状況を確認しながら相談して決定します。"],
  ["応募前に相談できますか？", "採用に関する質問はエントリーフォームからお知らせください。確認後、担当者よりご案内します。"],
] as const;

function goTo(href: string) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelector<HTMLElement>(href)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

function ArrowAsset({ theme = "dark", className = "" }: { theme?: "dark" | "white"; className?: string }) {
  return <img className={`pc-arrow-asset ${className}`} src={theme === "white" ? buttonArrowWhite : buttonArrowDark} alt="" aria-hidden="true" />;
}

function GrowthMark({ direction, compact = false }: { direction: "0-1" | "1-100"; compact?: boolean }) {
  return (
    <span className={`pc-growth-mark ${compact ? "is-compact" : ""}`} aria-label={direction === "0-1" ? "0から1" : "1から100"}>
      <span>(</span>
      <span>{direction === "0-1" ? "0" : "1"}</span>
      <span className="pc-growth-arrow"><img src={growthArrow} alt="" /></span>
      <strong>{direction === "0-1" ? "1" : "100"}</strong>
      <span>)</span>
    </span>
  );
}

function BrandTagline() {
  return (
    <div className="pc-brand-tagline" aria-label="Incubate 0から1 プラス Rise 1から100">
      <em>Incubate</em>
      <GrowthMark direction="0-1" />
      <b className="pc-tagline-plus">＋</b>
      <em>Rise</em>
      <GrowthMark direction="1-100" />
    </div>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.classList.toggle("pc-menu-open", open);
    if (!open) return;

    const menu = menuRef.current;
    const selector = "button:not([disabled]),a[href],[tabindex]:not([tabindex='-1'])";
    const frame = requestAnimationFrame(() => menu?.querySelector<HTMLElement>(selector)?.focus());
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !menu) return;
      const controls = Array.from(menu.querySelectorAll<HTMLElement>(selector));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", keydown);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", keydown);
      document.body.classList.remove("pc-menu-open");
      requestAnimationFrame(() => triggerRef.current?.focus());
    };
  }, [open]);

  const navigate = (href: string) => {
    setOpen(false);
    requestAnimationFrame(() => goTo(href));
  };

  return (
    <>
      <header className="pc-header">
        <button className="pc-brand" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="ページ上部へ">
          <img src={logo} alt="INCURISE Consulting" />
          <span>RECRUIT 2026</span>
        </button>
        <nav className="pc-nav" aria-label="主要ナビゲーション">
          {navItems.map(([label, href]) => <button type="button" key={href} onClick={() => goTo(href)}>{label}</button>)}
        </nav>
        <button className="pc-header-entry" type="button" onClick={() => goTo("#entry")}>ENTRY <ArrowAsset theme="white" /></button>
        <button
          ref={triggerRef}
          className="pc-menu-trigger"
          type="button"
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>
      <div ref={menuRef} id="mobile-navigation" className={`pc-mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav aria-label="モバイルナビゲーション">
          {navItems.map(([label, href], index) => (
            <button type="button" key={href} onClick={() => navigate(href)}><span>{String(index + 1).padStart(2, "0")}</span>{label}</button>
          ))}
          <button className="pc-mobile-entry" type="button" onClick={() => navigate("#entry")}>ENTRY <ArrowAsset theme="white" /></button>
        </nav>
      </div>
    </>
  );
}

function SectionHeading({ label, title, lead, light = false }: { label: string; title: ReactNode; lead: string; light?: boolean }) {
  return (
    <header className={`pc-section-heading pc-motion-heading ${light ? "is-light" : ""}`}>
      <p className="pc-eyebrow">{label}</p>
      <h2>{title}</h2>
      <p>{lead}</p>
    </header>
  );
}

function CareerCard({ stage, dark = false }: { stage: CareerStage; dark?: boolean }) {
  return (
    <article className={`pc-career-card pc-motion-card ${dark ? "is-dark" : ""}`}>
      <span>{stage.meta}</span>
      <h4>{stage.title}</h4>
      <p>{stage.body}</p>
    </article>
  );
}

function CorporateCircle() {
  return (
    <a className="pc-corporate-cta" href="https://incurise.co.jp/" target="_self">
      <span>Corporate</span>
      <span className="pc-corporate-circle"><ArrowAsset /><ArrowAsset theme="white" className="is-hover" /></span>
    </a>
  );
}

function FaqSection() {
  const [active, setActive] = useState(0);
  return (
    <section className="pc-section pc-faq" id="faq">
      <div className="pc-container pc-faq-layout">
        <SectionHeading label="FAQ / 09" title="よくある質問" lead="応募前に知っておきたいことをまとめました。" light />
        <div className="pc-faq-list pc-motion-reveal">
          {faqs.map(([question, answer], index) => {
            const open = active === index;
            return (
              <article className={open ? "is-open" : ""} key={question}>
                <button type="button" aria-expanded={open} onClick={() => setActive(open ? -1 : index)}>
                  <span>Q{String(index + 1).padStart(2, "0")}</span><b>{question}</b><i>{open ? "×" : "＋"}</i>
                </button>
                <div className="pc-faq-answer" aria-hidden={!open}><div><p>{answer}</p></div></div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type EntryData = { name: string; email: string; role: string; message: string };

function EntrySection() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [preview, setPreview] = useState<EntryData | null>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values: EntryData = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      role: String(data.get("role") ?? "").trim(),
      message: String(data.get("message") ?? "").trim(),
    };
    const next: Record<string, string> = {};
    if (!values.name) next.name = "入力してください";
    if (!values.email) next.email = "入力してください";
    else if (!/^\S+@\S+\.\S+$/.test(values.email)) next.email = "メールアドレスの形式を確認してください";
    if (!values.role) next.role = "希望職種を選択してください";
    if (!values.message) next.message = "入力してください";
    if (data.get("privacy") !== "accepted") next.privacy = "同意が必要です";
    setErrors(next);
    if (Object.keys(next).length) {
      requestAnimationFrame(() => form.querySelector<HTMLElement>("[aria-invalid='true']")?.focus());
      return;
    }
    setPreview(values);
  };

  useEffect(() => {
    if (!preview) return;
    const dialog = dialogRef.current;
    lastFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.classList.add("pc-modal-open");
    const selector = "a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex='-1'])";
    const frame = requestAnimationFrame(() => (dialog?.querySelector<HTMLElement>(selector) ?? dialog)?.focus());
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setPreview(null); return; }
      if (event.key !== "Tab" || !dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>(selector));
      if (!controls.length) { event.preventDefault(); dialog.focus(); return; }
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", keydown);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", keydown);
      document.body.classList.remove("pc-modal-open");
      requestAnimationFrame(() => lastFocused.current?.focus());
    };
  }, [preview]);

  return (
    <section className="pc-section pc-entry" id="entry">
      <div className="pc-container pc-entry-layout">
        <SectionHeading label="ENTRY / 10" title={<>ここから、<br />次の成長へ。</>} lead="選考についての質問も、まずはフォームからお知らせください。" />
        <form className="pc-entry-form pc-motion-reveal" onSubmit={submit} noValidate>
          <div className="pc-form-grid">
            <label className={errors.name ? "has-error" : ""}><span>お名前 *</span><input name="name" autoComplete="name" placeholder="山田 太郎" aria-invalid={Boolean(errors.name)} />{errors.name && <small>{errors.name}</small>}</label>
            <label className={errors.email ? "has-error" : ""}><span>メールアドレス *</span><input name="email" type="email" autoComplete="email" spellCheck={false} placeholder="name@example.com" aria-invalid={Boolean(errors.email)} />{errors.email && <small>{errors.email}</small>}</label>
            <label className={errors.role ? "has-error" : ""}><span>希望職種 *</span><select name="role" defaultValue="" aria-invalid={Boolean(errors.role)}><option value="" disabled>選択してください</option><option>システムエンジニア</option><option>ITコンサルタント</option><option>まだ決めていない</option></select>{errors.role && <small>{errors.role}</small>}</label>
            <label className={errors.message ? "has-error" : ""}><span>メッセージ *</span><textarea name="message" placeholder="ご質問・ご相談をご記入ください" aria-invalid={Boolean(errors.message)} />{errors.message && <small>{errors.message}</small>}</label>
          </div>
          <label className="pc-privacy"><input name="privacy" type="checkbox" value="accepted" aria-invalid={Boolean(errors.privacy)} /><span>個人情報の取り扱いに同意する</span>{errors.privacy && <small>{errors.privacy}</small>}</label>
          <button className="pc-confirm" type="submit">入力内容を確認する <ArrowAsset theme="white" /></button>
          <p className="pc-form-caption">この公開デモでは確認画面まで動作します。情報の送信は行いません。</p>
        </form>
      </div>
      {preview && (
        <div className="pc-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setPreview(null)}>
          <section ref={dialogRef} className="pc-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="pc-confirm-title" aria-describedby="pc-confirm-description" tabIndex={-1}>
            <button className="pc-modal-close" type="button" onClick={() => setPreview(null)} aria-label="確認画面を閉じる"><X /></button>
            <p className="pc-eyebrow">CONFIRM</p><h2 id="pc-confirm-title">入力内容の確認</h2>
            <p id="pc-confirm-description">送信前の確認画面です。この公開デモでは情報は送信されません。</p>
            <dl><div><dt>お名前</dt><dd>{preview.name}</dd></div><div><dt>メールアドレス</dt><dd>{preview.email}</dd></div><div><dt>希望職種</dt><dd>{preview.role}</dd></div><div><dt>メッセージ</dt><dd>{preview.message}</dd></div></dl>
            <div className="pc-modal-actions"><button type="button" onClick={() => setPreview(null)}>修正する</button><button type="button" disabled>送信する（未接続）</button></div>
          </section>
        </div>
      )}
    </section>
  );
}

type RecruitSiteProps = { motion?: boolean; preview?: boolean };

export function RecruitSite({ motion = true, preview = false }: RecruitSiteProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const belowFoldLoading = preview ? "eager" : "lazy";
  const belowFoldDecoding = preview ? "sync" : "async";

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root || !motion) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      root.dataset.motionReady = "reduced";
      return;
    }

    root.dataset.motionReady = "true";
    const context = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .fromTo(".pc-hero-image", { scale: 1.08 }, { scale: 1, duration: 1.1 })
        .fromTo(".pc-hero-progression > *", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, stagger: 0.06 }, 0.15)
        .fromTo(".pc-hero-copy > p, .pc-hero-copy > h1, .pc-hero-lead, .pc-hero-actions", { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: 0.65, stagger: 0.09 }, 0.35);

      gsap.to(".pc-hero-image", {
        yPercent: 8,
        scale: 1.04,
        ease: "none",
        scrollTrigger: { trigger: ".pc-hero", start: "top top", end: "bottom top", scrub: 0.6 },
      });
      gsap.to(".pc-scroll-progress-bar", {
        scaleY: 1,
        scaleX: 1,
        ease: "none",
        scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.2 },
      });

      gsap.utils.toArray<HTMLElement>(".pc-motion-heading, .pc-motion-reveal").forEach((element) => {
        gsap.fromTo(element, { y: 32, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: { trigger: element, start: "top 86%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(".pc-motion-media").forEach((element) => {
        gsap.fromTo(element, { clipPath: "inset(0 0 100% 0)" }, {
          clipPath: "inset(0 0 0% 0)",
          duration: 0.9,
          ease: "power3.inOut",
          scrollTrigger: { trigger: element, start: "top 84%", once: true },
        });
      });

      gsap.utils.toArray<HTMLElement>(".pc-motion-stagger").forEach((grid) => {
        gsap.fromTo(Array.from(grid.children), { y: 28, opacity: 0 }, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.05,
          ease: "power3.out",
          scrollTrigger: { trigger: grid, start: "top 82%", once: true },
        });
      });

      gsap.fromTo(".pc-message-divider", { scaleX: 0 }, {
        scaleX: 1,
        duration: 0.8,
        ease: "power3.inOut",
        transformOrigin: "left center",
        scrollTrigger: { trigger: ".pc-message-divider", start: "top 84%", once: true },
      });
      gsap.fromTo(".pc-brand-tagline", { clipPath: "inset(0 100% 0 0)", opacity: 0 }, {
        clipPath: "inset(0 0% 0 0)",
        opacity: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".pc-brand-tagline", start: "top 88%", once: true },
      });

      gsap.utils.toArray<HTMLElement>(".pc-career-route").forEach((route) => {
        const line = route.querySelector(".pc-career-line");
        const cards = route.querySelectorAll(".pc-career-card");
        if (line) {
          gsap.fromTo(line, { scaleY: 0 }, {
            scaleY: 1,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: { trigger: route, start: "top 70%", end: "bottom 55%", scrub: 0.35 },
          });
        }
        cards.forEach((card) => ScrollTrigger.create({
          trigger: card,
          start: "top 68%",
          end: "bottom 45%",
          toggleClass: { targets: card, className: "is-active" },
        }));
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh).catch(() => undefined);
    window.addEventListener("load", refresh, { once: true });
    return () => {
      window.removeEventListener("load", refresh);
      context.revert();
      delete root.dataset.motionReady;
    };
  }, [motion]);

  return (
    <div ref={rootRef} className={`pc-site ${motion ? "has-motion" : "is-static-preview"}`} data-preview={preview || undefined}>
      <Header />
      {motion && <div className="pc-scroll-progress" aria-hidden="true"><span className="pc-scroll-progress-bar" /></div>}
      <main>
        <section className="pc-hero" aria-labelledby="pc-hero-title">
          <picture>
            <source media="(max-width: 767px)" srcSet={heroMobile} />
            <img className="pc-hero-image" src={hero} alt="プロジェクトについて話し合うチーム" fetchPriority="high" />
          </picture>
          <div className="pc-hero-overlay" aria-hidden="true" />
          <div className="pc-hero-progression"><span>0</span><img src={growthArrow} alt="" /><strong>1</strong><img src={growthArrow} alt="" /><strong>100</strong></div>
          <div className="pc-hero-copy">
            <p>INCURISE CONSULTING / RECRUIT 2026</p>
            <h1 id="pc-hero-title"><span>0</span><img src={growthArrow} alt="" /><strong>1</strong>の挑戦を、<br /><span>1</span><img src={growthArrow} alt="" /><strong>100</strong>の成長へ。</h1>
            <div className="pc-hero-lead">未経験から技術を仕事にする人も、経験を次の事業へつなぐ人も。<br />一人ひとりの現在地から、成長の続きをつくる。</div>
            <div className="pc-hero-actions"><button type="button" onClick={() => goTo("#entry")}>ENTRY <ArrowAsset theme="white" /></button><a href="https://incurise.co.jp/about/">私たちを知る <ArrowAsset theme="white" /></a></div>
          </div>
        </section>

        <section className="pc-message" id="preview-message">
          <div className="pc-message-inner">
            <div className="pc-message-label pc-eyebrow pc-motion-reveal">MESSAGE / 01</div>
            <div className="pc-message-content pc-motion-reveal">
              <h2>成長は、誰かに<br />与えられるものではない。</h2>
              <p className="pc-message-lead">学び、試し、失敗し、また考える。その積み重ねを、仕事の価値へつなげる。</p>
              <p className="pc-message-body">IRCは、挑戦を個人だけに任せません。<br />研修、メンター、目標設定、実践の機会をつなぎ、<br />自分で次の一歩を選べる環境をつくります。</p>
              <div className="pc-message-divider" />
              <BrandTagline />
            </div>
          </div>
        </section>

        <section className="pc-section pc-about" id="about">
          <div className="pc-container">
            <SectionHeading label="ABOUT IRC / 02" title={<>技術力 × 人間力。<br />IKETERU人材を育てる。</>} lead="IRCが大切にするのは、スキルだけではなく、信頼される姿勢と行動です。" />
            <div className="pc-mission pc-motion-reveal"><span>MISSION</span><h3>IRCに関わるすべての人と企業に、成長と実感を。</h3><p>課題の発見から仕組みづくり、実行まで。</p></div>
            <div className="pc-value-grid pc-motion-stagger">{values.map(([number, en, ja]) => <article key={number}><span>{number}</span><h3>{en}</h3><p>{ja}</p></article>)}</div>
            <div className="pc-corporate pc-motion-reveal"><div><span>BUSINESS</span><h3>事業・サービスの詳細は、コーポレートサイトへ。</h3></div><CorporateCircle /></div>
          </div>
        </section>

        <section className="pc-section pc-starting" id="starting">
          <div className="pc-container">
            <SectionHeading label="STARTING POINTS / 03" title={<>入り口は違っても、<br />成長はひとつにつながる。</>} lead="未経験の挑戦も、経験者の次の一手も。" />
            <div className="pc-path-grid pc-motion-stagger">
              <article><div className="pc-motion-media"><img src={careerChanger} alt="メンターと開発を学ぶ社員" loading={belowFoldLoading} decoding={belowFoldDecoding} /></div><span>FOR CAREER CHANGERS</span><h3>未経験から、技術を仕事に。</h3><p>3カ月の基礎研修とメンター支援で、学びを実務へつなげます。</p></article>
              <article><div className="pc-motion-media"><img src={experienced} alt="事業課題を議論する社員" loading={belowFoldLoading} decoding={belowFoldDecoding} /></div><span>FOR EXPERIENCED</span><h3>経験を、次の事業づくりへ。</h3><p>専門性を起点に、リーダー、コンサル、新規事業へ役割を広げます。</p></article>
            </div>
          </div>
        </section>

        <section className="pc-section pc-people" id="people">
          <div className="pc-container">
            <SectionHeading label="PEOPLE / 04" title="成長の途中に、物語がある。" lead="肩書きではなく、変化の軌跡から仕事を知る。" />
            <div className="pc-story-grid pc-motion-stagger">
              {[[story01, "01", "未経験からSEへ", "学ぶことを仕事に変える。"], [story02, "02", "研修と挑戦", "メンターと目標を言葉にする。"], [story03, "03", "コンサルタントへ", "技術を軸に、視点を広げる。"]].map(([image, number, title, text]) => <article key={number}><div className="pc-motion-media"><img src={image} alt="社員のキャリアストーリー" loading={belowFoldLoading} decoding={belowFoldDecoding} /></div><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
            </div>
          </div>
        </section>

        <section className="pc-section pc-career" id="career">
          <div className="pc-container">
            <SectionHeading label="CAREER PATH / 05" title="キャリアは、一本の線ではない。" lead="共通の基礎から、コンサルタントとエンジニアの2ルートへ。志向に合わせて選び直せるキャリアです。" />
            <div className="pc-common-career pc-motion-stagger">{commonCareer.map((stage) => <CareerCard key={stage.title} stage={stage} />)}</div>
            <div className="pc-career-routes">
              <div className="pc-career-route"><span className="pc-career-line" aria-hidden="true" /><header><span>CONSULTING PATH</span><h3>課題整理から、経営・事業の推進へ。</h3></header>{consultingCareer.map((stage) => <CareerCard key={stage.title} stage={stage} />)}</div>
              <div className="pc-career-route"><span className="pc-career-line" aria-hidden="true" /><header><span>ENGINEERING PATH</span><h3>技術を深め、開発チームを導く。</h3></header>{engineeringCareer.map((stage) => <CareerCard key={stage.title} stage={stage} />)}</div>
            </div>
            <div className="pc-senior-career pc-motion-stagger"><CareerCard dark stage={{ meta: "STEP 05 / 800–1200万円", title: "Manager / マネージャー", body: "複数プロジェクトと組織の成長を担う。" }} /><CareerCard dark stage={{ meta: "STEP 06 / 売上連動", title: "Partner / パートナー", body: <span className="pc-partner-copy">経営視点で事業をつくり、次の<GrowthMark compact direction="0-1" />を生み出す。</span> }} /></div>
          </div>
        </section>

        <section className="pc-section pc-support" id="support">
          <div className="pc-container">
            <SectionHeading label="CAREER SUPPORT / 06" title="学びと対話で、次の選択を支える。" lead="研修だけで終わらず、現場・面談・資格支援をつなぎます。" />
            <div className="pc-support-visuals pc-motion-stagger"><div className="pc-motion-media"><img src={mentor} alt="メンターとの面談" loading={belowFoldLoading} decoding={belowFoldDecoding} /></div><div className="pc-motion-media"><img src={workshop} alt="チーム研修" loading={belowFoldLoading} decoding={belowFoldDecoding} /></div></div>
            <div className="pc-info-grid pc-motion-stagger">{supportItems.map(([number, title, body]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
          </div>
        </section>

        <section className="pc-section pc-benefits" id="benefits">
          <div className="pc-container">
            <SectionHeading label="BENEFITS & CULTURE / 07" title="働き続けるための、制度とカルチャー。" lead="学び、休み、つながり、挑戦。そのすべてを制度として支えます。" />
            <div className="pc-benefit-grid pc-motion-stagger">{benefits.map(([number, title, body]) => <article className={number === "05" ? "is-featured" : ""} key={number}><span>{number}</span><h3>{title}</h3><p>{body}</p></article>)}</div>
          </div>
        </section>

        <section className="pc-section pc-jobs" id="jobs">
          <div className="pc-container">
            <SectionHeading label="JOBS / 08" title="あなたの強みが、次の役割になる。" lead="募集要項の詳細は、選考の中でも丁寧にお伝えします。" />
            <div className="pc-job-grid pc-motion-stagger"><article><span>ENGINEERING</span><h3>システムエンジニア</h3><p>要件整理、設計、開発を通じて、事業を支える仕組みをつくる。</p></article><article><span>CONSULTING</span><h3>ITコンサルタント</h3><p>顧客の課題を捉え、技術と実行をつないで変革を前へ進める。</p></article></div>
            <div className="pc-selection pc-motion-reveal"><span>SELECTION FLOW</span><div>{["応募", "書類選考", "一次選考", "最終選考"].map((step, index) => <article key={step}><b>{String(index + 1).padStart(2, "0")}</b><h3>{step}</h3>{index < 3 && <ArrowAsset className="pc-selection-arrow" />}</article>)}</div></div>
          </div>
        </section>

        <FaqSection />
        <EntrySection />
      </main>

      <footer className="pc-footer">
        <div className="pc-footer-top"><a href="https://incurise.co.jp/" aria-label="インキュライズ公式サイト"><img src={logo} alt="INCURISE Consulting" /></a><div><a href="https://www.wantedly.com/companies/company_4522961" target="_blank" rel="noreferrer" aria-label="Wantedly"><img src={wantedly} alt="" /></a><a href="https://www.notion.so/Incurise-Consulting-1850e0dd05818078a32ff9df118ce9ff" target="_blank" rel="noreferrer" aria-label="Notion"><img src={notion} alt="" /></a></div></div>
        <div className="pc-footer-bottom"><p>© INCURISE Consulting</p><nav>{footerNavItems.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav></div>
      </footer>
    </div>
  );
}

export default function PreviewApp() {
  return <RecruitSite motion={false} preview />;
}

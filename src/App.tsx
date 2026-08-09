import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  Check,
  ChevronRight,
  Code2,
  Gift,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Medal,
  Menu,
  MonitorCheck,
  PartyPopper,
  Plus,
  Route,
  Sparkles,
  Trophy,
  Umbrella,
  UserRoundCheck,
  UsersRound,
  X,
  type LucideIcon,
} from "lucide-react";

import logo from "./assets/brand/incurise-logo.png";
import heroTeam from "./assets/generated/hero/hero-team.webp";
import pathBeginner from "./assets/generated/paths/path-beginner.webp";
import pathExperienced from "./assets/generated/paths/path-experienced.webp";
import personSe from "./assets/generated/people/person-se.webp";
import personGrowth from "./assets/generated/people/person-growth.webp";
import personConsultant from "./assets/generated/people/person-consultant.webp";
import growthMentor from "./assets/generated/growth/growth-mentor.webp";
import growthWorkshop from "./assets/generated/growth/growth-workshop.webp";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  ["ABOUT", "#about"],
  ["PEOPLE", "#people"],
  ["CAREER", "#career"],
  ["SUPPORT", "#support"],
  ["BENEFITS", "#benefits"],
  ["JOBS", "#jobs"],
  ["FAQ", "#faq"],
] as const;

const values = [
  ["01", "Confidence", "自信", "自分の考えと仕事に責任を持つ。"],
  ["02", "Integrity", "誠実", "人と仕事に、まっすぐ向き合う。"],
  ["03", "Hungry", "貪欲", "学びと機会を自分から取りにいく。"],
  ["04", "Proactivity", "主体性", "意思を持ち、周囲を巻き込んで動く。"],
  ["05", "Flexibility", "柔軟性", "変化を受け入れ、より良い方法を選ぶ。"],
] as const;

const stories = [
  {
    number: "01",
    title: "未経験からSEへ",
    body: "学ぶことを仕事に変える。基礎から積み上げ、開発の現場で価値を生み出すまで。",
    image: personSe,
    alt: "ノートパソコンで開発に取り組む社員のイメージ",
  },
  {
    number: "02",
    title: "研修と挑戦",
    body: "メンターと目標を言葉にし、学びと実践を往復しながら次の挑戦を選ぶ。",
    image: personGrowth,
    alt: "研修で学ぶ社員のイメージ",
  },
  {
    number: "03",
    title: "コンサルタントへ",
    body: "技術を軸に、課題の発見から事業の前進まで。視点と役割を広げていく。",
    image: personConsultant,
    alt: "会議で提案するコンサルタントのイメージ",
  },
] as const;

type CareerStage = {
  title: string;
  salary: string;
  body: string;
};

const sharedCareer: CareerStage[] = [
  { title: "Trainer / トレーニー", salary: "280–320万円", body: "研修を通じて、初めての現場へ進む基礎をつくる。" },
  { title: "SE", salary: "300–420万円", body: "開発メンバーとして自走し、社内の取り組みにも挑戦する。" },
];

const consultingCareer: CareerStage[] = [
  { title: "Associate", salary: "400–500万円", body: "コンサルワークの基本を理解し、指示を成果へ変える。" },
  { title: "Consultant", salary: "480–600万円", body: "メンバーとして自走し、顧客とプロジェクトを前へ進める。" },
  { title: "Senior Consultant", salary: "600–800万円", body: "1つのプロジェクトを自ら設計し、完遂する。" },
];

const engineeringCareer: CareerStage[] = [
  { title: "SE Lead", salary: "420–600万円", body: "開発チームの運営と意思決定を担う。" },
  { title: "Tech Lead", salary: "500–800万円", body: "設計と技術判断の中核となり、開発価値を高める。" },
  { title: "Specialist", salary: "役割連動", body: "専門性を深め、技術で事業と組織を導く。" },
];

const seniorCareer: CareerStage[] = [
  { title: "Manager / マネージャー", salary: "800–1200万円", body: "複数プロジェクトと組織の成長を担う。" },
  { title: "Partner / パートナー", salary: "売上連動", body: "経営視点で事業をつくり、次の0↗1を生み出す。" },
];

type InfoCard = {
  number: string;
  title: string;
  body: string;
  icon: LucideIcon;
};

const supportItems: InfoCard[] = [
  { number: "01", title: "プログラミング研修", body: "Javaを中心に、入社後3カ月間集中して学ぶ。", icon: Code2 },
  { number: "02", title: "eラーニング", body: "オンライン環境で、待機期間も継続して学べる。", icon: MonitorCheck },
  { number: "03", title: "コンサル研修", body: "キャリアアップに必要な基礎と実践を学ぶ。", icon: GraduationCap },
  { number: "04", title: "メンター制度", body: "月1回の1on1で、キャリアや悩みを相談する。", icon: UserRoundCheck },
  { number: "05", title: "サポーター制度", body: "先輩社員が月2回フォローし、現場の不安を支える。", icon: HeartHandshake },
  { number: "06", title: "資格取得補助", body: "対象資格の合格と、そのための学びを後押しする。", icon: Medal },
];

const benefitItems: InfoCard[] = [
  { number: "01", title: "有給・夏季休暇", body: "入社6カ月後に有給10日。夏季休暇は8〜9月に4日取得。", icon: Umbrella },
  { number: "02", title: "帰社する？制度", body: "帰社時の飲食代を補助し、仲間との対話をつくる。", icon: Building2 },
  { number: "03", title: "リファラル採用", body: "紹介から採用につながった社員へ報酬金を支給。", icon: Handshake },
  { number: "04", title: "イベント制度", body: "隔月の懇親会で、部署を越えた関係を育てる。", icon: PartyPopper },
  { number: "05", title: "IKETERU Consultant", body: "コンサルタントへのキャリアチェンジを制度で後押しする。", icon: Sparkles },
  { number: "06", title: "全社員集会／決起集会", body: "会社の現在地と次の挑戦を、全社員で共有する。", icon: Trophy },
];

const faqs = [
  ["IT業界が未経験でも応募できますか？", "はい。3カ月の基礎研修やメンター支援を用意し、学びを実務へつなげる前提で選考します。"],
  ["キャリアはどのように選べますか？", "SEを基礎に、技術を深める道とコンサルタントへ広げる道を選択できます。途中で志向を見直すこともできます。"],
  ["配属やプロジェクトはどのように決まりますか？", "これまでの経験、伸ばしたい領域、プロジェクト状況を確認しながら相談して決定します。"],
  ["応募前に相談できますか？", "採用に関する質問はエントリーフォームからお知らせください。確認後、担当者よりご案内します。"],
] as const;

function SectionHeading({ label, title, lead, light = false }: { label: string; title: ReactNode; lead?: string; light?: boolean }) {
  return (
    <header className={`section-heading reveal ${light ? "is-light" : ""}`}>
      <p className="eyebrow">{label}</p>
      <h2>{title}</h2>
      {lead && <p className="section-lead">{lead}</p>}
    </header>
  );
}

function Header({ open, setOpen }: { open: boolean; setOpen: (open: boolean) => void }) {
  const go = (href: string) => {
    document.querySelector<HTMLElement>(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpen(false);
  };

  return (
    <header className="site-header">
      <button className="brand" type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="ページ上部へ">
        <img src={logo} alt="INCURISE Consulting" />
        <span>RECRUIT 2026</span>
      </button>
      <nav className="desktop-nav" aria-label="主要ナビゲーション">
        {navItems.map(([label, href]) => <button type="button" key={href} onClick={() => go(href)}>{label}</button>)}
      </nav>
      <button className="header-entry" type="button" onClick={() => go("#entry")}>ENTRY <ArrowUpRight /></button>
      <button className="menu-button" type="button" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? "メニューを閉じる" : "メニューを開く"}>
        {open ? <X /> : <Menu />}
      </button>
      <div id="mobile-menu" className={`mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav aria-label="モバイルナビゲーション">
          {navItems.map(([label, href], index) => (
            <button type="button" key={href} onClick={() => go(href)}><span>{String(index + 1).padStart(2, "0")}</span>{label}<ChevronRight /></button>
          ))}
          <button type="button" className="mobile-entry" onClick={() => go("#entry")}>ENTRY<ArrowUpRight /></button>
        </nav>
      </div>
    </header>
  );
}

function CareerCard({ stage, index, dark = false }: { stage: CareerStage; index: string; dark?: boolean }) {
  return (
    <article className={`career-card ${dark ? "is-dark" : ""}`}>
      <div className="career-card__meta"><span>{index}</span><b>{stage.salary}</b></div>
      <h4>{stage.title}</h4>
      <p>{stage.body}</p>
    </article>
  );
}

function InfoGrid({ items, className = "" }: { items: InfoCard[]; className?: string }) {
  return (
    <div className={`info-grid stagger-grid ${className}`}>
      {items.map(({ number, title, body, icon: Icon }) => (
        <article key={number} className={title === "IKETERU Consultant" ? "is-featured" : ""}>
          <div className="info-card__top"><span>{number}</span><Icon aria-hidden="true" /></div>
          <h3>{title}</h3>
          <p>{body}</p>
        </article>
      ))}
    </div>
  );
}

function FaqSection() {
  const [active, setActive] = useState<number | null>(0);
  return (
    <section className="faq section" id="faq">
      <div className="section-inner faq-layout">
        <SectionHeading label="FAQ / 09" title="よくある質問" lead="応募前に知っておきたいことをまとめました。" light />
        <div className="faq-list reveal">
          {faqs.map(([question, answer], index) => {
            const isOpen = active === index;
            return (
              <article className={`faq-item ${isOpen ? "is-open" : ""}`} key={question}>
                <button type="button" aria-expanded={isOpen} onClick={() => setActive(isOpen ? null : index)}>
                  <span>Q{String(index + 1).padStart(2, "0")}</span><b>{question}</b><Plus aria-hidden="true" />
                </button>
                <div className="faq-answer" aria-hidden={!isOpen}><div><p>{answer}</p></div></div>
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
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

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
    lastFocusedRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    document.body.classList.add("modal-open");

    const focusableSelector = [
      "a[href]",
      "button:not([disabled])",
      "input:not([disabled])",
      "select:not([disabled])",
      "textarea:not([disabled])",
      '[tabindex]:not([tabindex="-1"])',
    ].join(",");

    const focusFirstControl = () => {
      const first = dialog?.querySelector<HTMLElement>(focusableSelector);
      (first ?? dialog)?.focus();
    };
    const frame = requestAnimationFrame(focusFirstControl);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setPreview(null);
        return;
      }
      if (event.key !== "Tab" || !dialog) return;

      const controls = Array.from(dialog.querySelectorAll<HTMLElement>(focusableSelector));
      if (!controls.length) {
        event.preventDefault();
        dialog.focus();
        return;
      }
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("modal-open");
      const lastFocused = lastFocusedRef.current;
      requestAnimationFrame(() => lastFocused?.focus());
    };
  }, [preview]);

  return (
    <section className="entry section" id="entry">
      <div className="section-inner entry-layout">
        <div className="entry-copy reveal">
          <p className="eyebrow">ENTRY / 10</p>
          <h2>ここから、<br />次の成長へ。</h2>
          <p>選考についての質問も、まずはフォームからお知らせください。</p>
          <div className="entry-note"><Check />入力内容は送信前に確認できます</div>
        </div>
        <form className="entry-form reveal" ref={formRef} onSubmit={submit} noValidate>
          <div className="form-grid">
            <label className={errors.name ? "has-error" : ""}><span>お名前 <b>必須</b></span><input name="name" placeholder="例）山田 太郎" aria-invalid={Boolean(errors.name)} />{errors.name && <small>{errors.name}</small>}</label>
            <label className={errors.email ? "has-error" : ""}><span>メールアドレス <b>必須</b></span><input name="email" type="email" placeholder="name@example.com" aria-invalid={Boolean(errors.email)} />{errors.email && <small>{errors.email}</small>}</label>
            <label className={errors.role ? "has-error" : ""}><span>希望職種 <b>必須</b></span><select name="role" defaultValue="" aria-invalid={Boolean(errors.role)}><option value="" disabled>選択してください</option><option>システムエンジニア</option><option>ITコンサルタント</option><option>まだ決めていない</option></select>{errors.role && <small>{errors.role}</small>}</label>
            <label className={errors.message ? "has-error" : ""}><span>メッセージ <b>必須</b></span><textarea name="message" placeholder="ご質問・ご相談をご記入ください" aria-invalid={Boolean(errors.message)} />{errors.message && <small>{errors.message}</small>}</label>
          </div>
          <label className={`privacy-check ${errors.privacy ? "has-error" : ""}`}><input name="privacy" type="checkbox" value="accepted" aria-invalid={Boolean(errors.privacy)} /><span>個人情報の取り扱いに同意する</span>{errors.privacy && <small>{errors.privacy}</small>}</label>
          <button className="confirm-button" type="submit">入力内容を確認する <ArrowRight /></button>
          <p className="form-caption">この公開デモでは確認画面まで動作します。情報の送信は行いません。</p>
        </form>
      </div>
      {preview && (
        <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setPreview(null)}>
          <section ref={dialogRef} className="confirm-modal" role="dialog" aria-modal="true" aria-labelledby="confirm-title" aria-describedby="confirm-description" tabIndex={-1}>
            <button className="modal-close" type="button" onClick={() => setPreview(null)} aria-label="確認画面を閉じる"><X /></button>
            <p className="eyebrow">CONFIRM</p><h2 id="confirm-title">入力内容の確認</h2>
            <p id="confirm-description" className="modal-description">送信前の確認画面です。この公開デモでは情報は送信されません。</p>
            <dl><div><dt>お名前</dt><dd>{preview.name}</dd></div><div><dt>メールアドレス</dt><dd>{preview.email}</dd></div><div><dt>希望職種</dt><dd>{preview.role}</dd></div><div><dt>メッセージ</dt><dd>{preview.message}</dd></div></dl>
            <div className="modal-actions"><button type="button" onClick={() => setPreview(null)}>修正する</button><button type="button" disabled>送信する（未接続）</button></div>
          </section>
        </div>
      )}
    </section>
  );
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("menu-open", menuOpen);
    return () => document.body.classList.remove("menu-open");
  }, [menuOpen]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;
    const context = gsap.context(() => {
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .fromTo(".hero__image", { scale: 1.18, filter: "saturate(.65)" }, { scale: 1, filter: "saturate(1)", duration: 1.45 })
        .fromTo(".brand-lockup > *", { y: 26, opacity: 0, rotate: -3 }, { y: 0, opacity: 1, rotate: 0, duration: 0.55, stagger: 0.1 }, 0.15)
        .fromTo(".hero__kicker, .hero h1, .hero__lead, .hero__actions", { y: 45, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.13 }, 0.55);

      gsap.to(".hero__image", { yPercent: 12, scale: 1.08, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 } });
      gsap.to(".scroll-progress__bar", { scaleY: 1, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: 0.35 } });

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((element) => {
        gsap.fromTo(element, { y: 46, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 86%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".reveal-media").forEach((element) => {
        gsap.fromTo(element, { clipPath: "inset(0 0 100% 0)", scale: 1.08 }, { clipPath: "inset(0 0 0% 0)", scale: 1, duration: 1.15, ease: "power3.inOut", scrollTrigger: { trigger: element, start: "top 84%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".stagger-grid").forEach((grid) => {
        gsap.fromTo(Array.from(grid.children), { y: 55, opacity: 0, rotateX: 10 }, { y: 0, opacity: 1, rotateX: 0, duration: 0.75, stagger: 0.09, ease: "power3.out", scrollTrigger: { trigger: grid, start: "top 80%", once: true } });
      });
      gsap.utils.toArray<HTMLElement>(".career-path").forEach((path) => {
        const line = path.querySelector(".career-line");
        const cards = path.querySelectorAll(".career-card");
        if (line) gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: "none", scrollTrigger: { trigger: path, start: "top 72%", end: "bottom 55%", scrub: 0.5 } });
        cards.forEach((card) => ScrollTrigger.create({ trigger: card, start: "top 62%", end: "bottom 42%", toggleClass: { targets: card, className: "is-active" } }));
      });
    });
    return () => context.revert();
  }, []);

  return (
    <>
      <Header open={menuOpen} setOpen={setMenuOpen} />
      <div className="scroll-progress" aria-hidden="true"><span className="scroll-progress__bar" /></div>
      <main>
        <section className="hero" aria-labelledby="hero-title">
          <img className="hero__image" src={heroTeam} alt="プロジェクトについて話し合うチーム" />
          <div className="hero__shade" aria-hidden="true" />
          <div className="brand-lockup" aria-label="Incubate 0から1、Rise 1から100"><span>Incubate</span><b>(0↗1)</b><i>+</i><span>Rise</span><b>(1↗100)</b></div>
          <div className="hero__content">
            <p className="hero__kicker">INCURISE CONSULTING / RECRUIT</p>
            <h1 id="hero-title">挑戦を、<br className="mobile-only" />成長の実感へ。</h1>
            <p className="hero__lead">0↗1を生み出す力と、1↗100へ育てる力。<br />技術と人間力を掛け合わせ、次のキャリアをつくる。</p>
            <div className="hero__actions"><a className="button-primary" href="#entry">ENTRY <ArrowUpRight /></a><a className="button-secondary" href="#about">私たちを知る <ArrowDown /></a></div>
          </div>
        </section>

        <section className="message section" id="message">
          <div className="section-inner message-layout">
            <SectionHeading label="MESSAGE / 01" title={<>成長は、誰かに<br />与えられるものではない。</>} lead="学び、試し、失敗し、また考える。その積み重ねを仕事の価値へつなげる。" />
            <div className="message-body reveal"><p>IRCは、挑戦を個人だけに任せません。研修、メンター、目標設定、実践の機会をつなぎ、自分で次の一歩を選べる環境をつくります。</p><div><strong>Incubate (0↗1)<br />+ Rise (1↗100)</strong><span>構想を生み、実装し、成長へつなぐ。</span></div></div>
          </div>
        </section>

        <section className="about section" id="about">
          <div className="section-inner">
            <SectionHeading label="ABOUT IRC / 02" title={<>技術力 × 人間力。<br />IKETERU人材を育てる。</>} lead="IRCが大切にするのは、スキルだけではなく、信頼される姿勢と行動です。" light />
            <div className="mission reveal"><span>MISSION</span><h3>IRCに関わるすべての人と企業に、成長と実感を。</h3><p>課題の発見から仕組みづくり、実行まで。</p></div>
            <div className="value-grid stagger-grid">{values.map(([number, en, ja, body]) => <article key={number}><span>{number}</span><h3>{en}</h3><b>{ja}</b><p>{body}</p></article>)}</div>
            <a className="corporate-link reveal" href="https://incurise.co.jp/" target="_blank" rel="noreferrer"><div><span>BUSINESS</span><h3>事業・サービスの詳細は、コーポレートサイトへ。</h3></div><b>incurise.co.jp <ArrowUpRight /></b></a>
          </div>
        </section>

        <section className="starting section">
          <div className="section-inner">
            <SectionHeading label="STARTING POINTS / 03" title={<>入り口は違っても、<br />成長はひとつにつながる。</>} lead="未経験の挑戦も、経験者の次の一手も。" />
            <div className="path-grid">
              <article className="path-card reveal"><div className="path-card__image reveal-media"><img src={pathBeginner} alt="メンターと開発を学ぶ社員" /></div><span>FOR CAREER CHANGERS</span><h3>未経験から、技術を仕事に。</h3><p>3カ月の基礎研修とメンター支援で、学びを実務へつなげます。</p></article>
              <article className="path-card reveal"><div className="path-card__image reveal-media"><img src={pathExperienced} alt="事業課題を議論する社員" /></div><span>FOR EXPERIENCED</span><h3>経験を、次の事業づくりへ。</h3><p>専門性を起点に、リーダー、コンサル、新規事業へ役割を広げます。</p></article>
            </div>
          </div>
        </section>

        <section className="people section" id="people">
          <div className="section-inner">
            <SectionHeading label="PEOPLE / 04" title="成長の途中に、物語がある。" lead="肩書きではなく、変化の軌跡から仕事を知る。" />
            <div className="story-grid stagger-grid">{stories.map((story) => <article key={story.number}><div className="story-image"><img src={story.image} alt={story.alt} /></div><span>{story.number}</span><h3>{story.title}</h3><p>{story.body}</p></article>)}</div>
          </div>
        </section>

        <section className="career section" id="career">
          <div className="section-inner">
            <SectionHeading label="CAREER PATH / 05" title="キャリアは、一本の線ではない。" lead="共通の基礎から、コンサルタントとエンジニアの2ルートへ。志向に合わせて選び直せるキャリアです。" />
            <div className="shared-career stagger-grid">{sharedCareer.map((stage, index) => <CareerCard key={stage.title} stage={stage} index={`STEP 0${index + 1}`} />)}</div>
            <div className="career-routes">
              <div className="career-path career-path--consulting"><span className="career-line" aria-hidden="true" /><header><span>CONSULTING PATH</span><h3>課題整理から、経営・事業の推進へ。</h3></header>{consultingCareer.map((stage, index) => <CareerCard key={stage.title} stage={stage} index={`0${index + 3}`} />)}</div>
              <div className="career-path career-path--engineering"><span className="career-line" aria-hidden="true" /><header><span>ENGINEERING PATH</span><h3>技術を深め、開発チームを導く。</h3></header>{engineeringCareer.map((stage, index) => <CareerCard key={stage.title} stage={stage} index={`0${index + 3}`} />)}</div>
            </div>
            <div className="senior-career stagger-grid">{seniorCareer.map((stage, index) => <CareerCard key={stage.title} stage={stage} index={`STEP 0${index + 5}`} dark />)}</div>
          </div>
        </section>

        <section className="support section" id="support">
          <div className="section-inner">
            <SectionHeading label="CAREER SUPPORT / 06" title="学びと対話で、次の選択を支える。" lead="研修だけで終わらず、現場・面談・資格支援をつなぎます。" />
            <div className="support-visuals"><div className="reveal-media"><img src={growthMentor} alt="メンターとキャリアについて話す社員" /></div><div className="reveal-media"><img src={growthWorkshop} alt="チームで研修を受ける社員" /></div></div>
            <InfoGrid items={supportItems} />
          </div>
        </section>

        <section className="benefits section" id="benefits">
          <div className="section-inner">
            <SectionHeading label="BENEFITS & CULTURE / 07" title="働き続けるための、制度とカルチャー。" lead="学び、休み、つながり、挑戦。そのすべてを制度として支えます。" />
            <InfoGrid items={benefitItems} className="benefit-grid" />
          </div>
        </section>

        <section className="jobs section" id="jobs">
          <div className="section-inner">
            <SectionHeading label="JOBS / 08" title="あなたの強みが、次の役割になる。" lead="募集要項の詳細は、選考の中でも丁寧にお伝えします。" />
            <div className="job-grid stagger-grid"><article><Code2 /><span>ENGINEERING</span><h3>システムエンジニア</h3><p>要件整理、設計、開発を通じて、事業を支える仕組みをつくる。</p><a href="#entry">この職種で応募する <ArrowRight /></a></article><article><BriefcaseBusiness /><span>CONSULTING</span><h3>ITコンサルタント</h3><p>顧客の課題を捉え、技術と実行をつないで変革を前へ進める。</p><a href="#entry">この職種で応募する <ArrowRight /></a></article></div>
            <div className="selection reveal"><span>SELECTION FLOW</span><div><b>01</b><h3>一次選考</h3><ArrowRight /><b>02</b><h3>最終選考</h3></div><p>書類確認後、面接は2段階で実施します。</p></div>
          </div>
        </section>

        <FaqSection />
        <EntrySection />
      </main>

      <footer className="site-footer"><div><img src={logo} alt="INCURISE Consulting" /><p>Incubate (0↗1) + Rise (1↗100)</p></div><nav>{navItems.slice(0, 6).map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav><div className="footer-links"><a href="https://incurise.co.jp/" target="_blank" rel="noreferrer">Corporate <ArrowUpRight /></a><a href="https://www.wantedly.com/companies/company_4522961" target="_blank" rel="noreferrer">Wantedly <ArrowUpRight /></a><span>© INCURISE Consulting</span></div></footer>
    </>
  );
}

export default App;

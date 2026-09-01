import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { Menu, X } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import logo from "./assets/preview/incurise-logo.png";
import hero from "./assets/preview/hero.png";
import heroMobile from "./assets/preview/hero-mobile.png";
import growthArrow from "./assets/preview/growth-arrow.png";
import buttonArrowDark from "./assets/preview/button-arrow-dark.png";
import buttonArrowWhite from "./assets/preview/button-arrow-white.png";
import wantedly from "./assets/preview/wantedly.png";
import notion from "./assets/preview/notion.png";
import {
  MAX_RECRUIT_FILE_BYTES,
  parseRecruitEndpoint,
  submitRecruitApplication,
  wpcf7FieldToFormField,
  type RecruitApplication,
} from "./recruitSubmission";

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  ["ABOUT", "#about"],
  ["CAREER", "#career"],
  ["SUPPORT & BENEFIT", "#support"],
  ["JOBS", "#jobs"],
  ["FAQ", "#faq"],
  ["ENTRY", "#entry"],
] as const;

const iketeruValues = [
  {
    number: "01",
    ja: "自信",
    en: "Confidence",
    title: "自信がある人が “IKETERU”",
    body: "自然体で堂々とした姿勢を持ち、他人の前で自分の意見やアイデアをしっかりと伝えれる人。ボディランゲージや表情にも自信が溢れ、その自信が周囲にも影響を与える人。",
  },
  {
    number: "02",
    ja: "誠実",
    en: "Integrity",
    title: "誠実な人が “IKETERU”",
    body: "自分の言葉や行動に一貫性があり、周囲からも信頼される人。公平な態度で接し、他人の気持ちを共感することで、周囲と信頼関係を築ける人。",
  },
  {
    number: "03",
    ja: "貪欲",
    en: "Hungry",
    title: "貪欲な人が “IKETERU”",
    body: "現状に満足することなく、絶えず目標に向かって努力できる人。目標達成のためには、泥臭いことや他社がやりたがらない業務も前向きに望める人。",
  },
  {
    number: "04",
    ja: "行動力",
    en: "Proactivity",
    title: "行動力がある人が “IKETERU”",
    body: "新しい機会や挑戦に対して、前向きに積極的に取り組める人。困難な障害があっても、目標に向かって粘り強く努力出来る人。",
  },
  {
    number: "05",
    ja: "柔軟性",
    en: "Flexibility",
    title: "柔軟性がある人が “IKETERU”",
    body: "困難や失敗に対して冷静に対処し、前向きな姿勢を持ち、成長機会と捉え努力出来る人。他人との協力や協調を重んじ、チームワークを大切にできる人。",
  },
  {
    number: "06",
    ja: "格好",
    en: "Style",
    title: "格好がいい人が “IKETERU”",
    body: "第一印象を大切にし、常に清潔で整った外見を保つ人。自信に満ち溢れた表情や、明るく親しみやすい言動が出来る人。",
  },
] as const;

const supportItems = [
  ["01", "プログラミング研修", "プログラミングスキルを継続的に学ぶ環境を提供しています。"],
  ["02", "eラーニング", "待機期間を含め、オンライン教材を使って時間や場所を選ばず継続的に学べます。"],
  ["03", "コンサルタント研修", "コンサルタントに必要な基礎・実践スキルを早期に身につけるための研修制度です。"],
  ["04", "メンター制度", "役員がキャリア形成のための相談相手として、直接サポートします。"],
  ["05", "サポーター制度", "新入社員一人ひとりに先輩社員1名がサポーターとして付き、入社から立ち上がりまで支援します。"],
  ["06", "資格取得補助制度", "資格試験に合格した場合に、受験料とお祝い金を支給します。"],
  ["07", "各種休暇", "夏季休暇・冬期休暇、産前・産後休暇／育児休暇が利用可能です。"],
  ["08", "ちょ、帰社する？制度", "帰社時に社員同士で飲食する場合、飲食代を補助します。食事やゲームを通じて交流する制度です。"],
  ["09", "リファラル採用制度", "社員からの紹介で候補者が入社した場合、紹介者へ定額の報奨金を支給します。"],
  ["10", "イベント制度", "隔月で経営陣と社員が参加するイベントを開催します。BBQやゲームを通じて交流します。"],
  ["11", "IKETERU Consultant制度", "コンサルタントへのキャリアチェンジを成功させた方に、スーツ一式をプレゼントする制度です。"],
  ["12", "全社員集会", "企業理念の共有や新入社員の紹介などを行う全社員集会を、隔月で開催します。"],
  ["13", "決起集会", "年1回、翌年に向けた重要事項を発表します。景品付きのビンゴ大会も行います。"],
  ["14", "住宅仲介手数料補助制度", "賃貸・売買を問わず、提携不動産仲介会社を利用した場合に仲介手数料の割引を受けられます。"],
  ["15", "ディズニー/USJ施設優待制度", "「たくさん歩いて健康促進」を目標に、上記テーマパークの入園料の一部を負担する制度です。"],
] as const;

type CareerStage = { meta: string; title: string; body: ReactNode };

const commonCareer: CareerStage[] = [
  { meta: "STEP 01 / 280–320万円", title: "Trainer / トレーニー", body: "研修を経て初現場を経験し、SEとしてのINPUT期間をつくる。" },
  { meta: "STEP 02 / 300–420万円", title: "SE", body: "開発メンバーとして自走し、プロジェクトと社内タスクに挑戦する。" },
];

const consultingCareer: CareerStage[] = [
  { meta: "STEP 03 / 400–500万円", title: "Associate", body: "上長の支援を受けながら、コンサルワークと価値提供を理解する。" },
  { meta: "STEP 04 / 480–600万円", title: "Consultant", body: "コンサルメンバーとして自走し、顧客の課題解決を前へ進める。" },
  { meta: "STEP 05 / 600–800万円", title: "Senior Consultant", body: "1プロジェクトを主導し、現場営業とチーム育成を担う。" },
];

const engineeringCareer: CareerStage[] = [
  { meta: "STEP 03 / 420–600万円", title: "SE Lead", body: "開発チームの運営を担い、メンバーを技術面から支える。" },
  { meta: "STEP 04 / 500–800万円", title: "Tech Lead", body: "設計・技術判断・プロジェクトマネジメントの中核を担う。" },
  { meta: "STEP 05 / 役割連動", title: "Specialist", body: "専門性を深め、技術から事業と組織の価値を広げる。" },
];

const faqs: ReadonlyArray<{ question: string; answer: ReactNode }> = [
  {
    question: "未経験でも応募することはできますか？",
    answer: <p>はい、応募できます。まずはSEとして経験を積み、その後コンサルタントへのキャリアを目指すことができます。3カ月間のJava研修を用意しており、業界未経験の方でも着実にステップアップできます。</p>,
  },
  {
    question: "評価基準を教えてください",
    answer: <><p>評価基準は「AKGK」の4軸です。</p><dl className="pc-faq-akgk"><div><dt>A</dt><dd><strong>粗利</strong><span>個人の粗利率</span></dd></div><div><dt>K</dt><dd><strong>稼働率</strong><span>個人の稼働率</span></dd></div><div><dt>G</dt><dd><strong>現場評価</strong><span>個人の現場評価</span></dd></div><div><dt>K</dt><dd><strong>会社貢献</strong></dd></div></dl></>,
  },
  {
    question: "配属やプロジェクトはどのように決まりますか？",
    answer: <><p>これまでの経験、希望する領域、プロジェクトの状況を踏まえ、営業担当と相談しながら決定します。</p><ol className="pc-faq-steps"><li><b>1</b><span>希望する配属先について営業担当とすり合わせ</span></li><li><b>2</b><span>営業担当が希望に合うプロジェクトを収集</span></li><li><b>3</b><span>クライアントとの面談後に配属</span></li></ol></>,
  },
  {
    question: "リモートで働く環境はありますか",
    answer: <p>リモート勤務が可能なプロジェクトもありますが、すべてではありません。原則として出社を前提にご入社ください。</p>,
  },
  {
    question: "副業は可能ですか",
    answer: <p>申請を行い、社内承認を得た場合は可能です。ただし、本業に影響しないことが条件です。</p>,
  },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1899 }, (_, index) => String(currentYear - index));
const months = Array.from({ length: 12 }, (_, index) => String(index + 1));
const days = Array.from({ length: 31 }, (_, index) => String(index + 1));

function goTo(href: string) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelector<HTMLElement>(href)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
}

function goToTop() {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
}

function formatFile(file?: File) {
  if (!file) return "なし";
  const size = file.size < 1024 * 1024 ? `${Math.max(1, Math.round(file.size / 1024))}KB` : `${(file.size / 1024 / 1024).toFixed(1)}MB`;
  return `${file.name}（${size}）`;
}

function ArrowAsset({ theme = "dark", className = "" }: { theme?: "dark" | "white"; className?: string }) {
  return <img className={`pc-arrow-asset ${className}`} src={theme === "white" ? buttonArrowWhite : buttonArrowDark} alt="" aria-hidden="true" />;
}

function GrowthMark({ direction, compact = false }: { direction: "0-1" | "1-100"; compact?: boolean }) {
  return (
    <span className={`pc-growth-mark ${compact ? "is-compact" : ""}`} aria-label={direction === "0-1" ? "0から1" : "1から100"}>
      <span>(</span><span>{direction === "0-1" ? "0" : "1"}</span>
      <span className="pc-growth-arrow"><img src={growthArrow} alt="" /></span>
      <strong>{direction === "0-1" ? "1" : "100"}</strong><span>)</span>
    </span>
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
      if (event.key === "Escape") { event.preventDefault(); setOpen(false); return; }
      if (event.key !== "Tab" || !menu) return;
      const controls = Array.from(menu.querySelectorAll<HTMLElement>(selector));
      const first = controls[0];
      const last = controls.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", keydown);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("keydown", keydown); document.body.classList.remove("pc-menu-open"); requestAnimationFrame(() => triggerRef.current?.focus()); };
  }, [open]);
  const navigate = (href: string) => { setOpen(false); requestAnimationFrame(() => goTo(href)); };
  return <>
    <header className="pc-header">
      <button className="pc-brand" type="button" onClick={goToTop} aria-label="ページ上部へ"><img src={logo} alt="INCURISE Consulting" /><span>RECRUIT 2026</span></button>
      <nav className="pc-nav" aria-label="主要ナビゲーション">{navItems.slice(0, -1).map(([label, href]) => <button type="button" key={href} onClick={() => goTo(href)}>{label}</button>)}</nav>
      <button className="pc-header-entry" type="button" onClick={() => goTo("#entry")}>ENTRY <ArrowAsset theme="white" /></button>
      <button ref={triggerRef} className="pc-menu-trigger" type="button" aria-label={open ? "メニューを閉じる" : "メニューを開く"} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => setOpen((value) => !value)}>{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
    </header>
    <div ref={menuRef} id="mobile-navigation" className={`pc-mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}><nav aria-label="モバイルナビゲーション">{navItems.map(([label, href], index) => <button type="button" key={href} onClick={() => navigate(href)}><span>{String(index + 1).padStart(2, "0")}</span>{label}</button>)}</nav></div>
  </>;
}

function SectionHeading({ label, title, lead, light = false, center = false }: { label: string; title: ReactNode; lead: string; light?: boolean; center?: boolean }) {
  return <header className={`pc-section-heading pc-motion-heading ${light ? "is-light" : ""} ${center ? "is-centered" : ""}`}><p className="pc-eyebrow">{label}</p><h2>{title}</h2><p>{lead}</p></header>;
}

function CareerCard({ stage, dark = false }: { stage: CareerStage; dark?: boolean }) {
  return <article className={`pc-career-card pc-motion-card ${dark ? "is-dark" : ""}`}><span>{stage.meta}</span><h4>{stage.title}</h4><p>{stage.body}</p></article>;
}

function IketeruSection() {
  return <section className="pc-section pc-iketeru" id="about"><div className="pc-container">
    <header className="pc-iketeru-intro pc-motion-heading"><p>ABOUT / 01</p><h2>さらなる成長と成功へ、<br />共に挑戦する</h2><strong>技術力×人間力。IKETERU人材を育てる。</strong></header>
    <div className="pc-dna-layout"><aside className="pc-dna-visual pc-motion-reveal">
      <p className="pc-dna-label">( Incurise DNA )</p>
      <div className="pc-dna-orb"><span>“IKETERU”</span><b>の探求</b></div>
    </aside>
      <div className="pc-definition-panel">
        <header className="pc-definition-heading pc-motion-heading"><h2>DEFINITION</h2><span>〜 IKETERUの定義 〜</span></header>
        <div className="pc-definition-list pc-motion-stagger">{iketeruValues.map((value) => {
          const qualifier = value.title.replace(value.ja, "").replace("“IKETERU”", "").trim();
          const sentences = value.body.split("。").filter(Boolean).map((sentence) => `${sentence}。`);
          return <article key={value.number}><div className="pc-definition-title"><h3><mark># {value.ja}<em>({value.en})</em></mark><small>{qualifier}</small><strong>“IKETERU”</strong></h3></div><ul>{sentences.map((sentence) => <li key={sentence}>{sentence}</li>)}</ul></article>;
        })}</div>
      </div>
    </div>
  </div></section>;
}

function SupportSection() {
  const [active, setActive] = useState<number | null>(null);
  const pointerFocusRef = useRef(false);
  return <section className="pc-section pc-support" id="support"><div className="pc-container">
    <SectionHeading label="SUPPORT & BENEFIT / 03" title={<>“IKETERU”あなたを<br />支える仕組み</>} lead="学び、対話、休息、つながり。挑戦を続けるための制度を、一人ひとりの成長につなげます。" />
    <p className="pc-support-guide pc-motion-reveal">項目を選ぶと、制度の詳細を確認できます。</p>
    <div className="pc-support-grid pc-motion-stagger">{supportItems.map(([number, title, body], index) => { const open = active === index; return <article className={open ? "is-open" : ""} key={number} onMouseEnter={() => window.matchMedia("(hover: hover) and (pointer: fine)").matches && setActive(index)} onMouseLeave={() => window.matchMedia("(hover: hover) and (pointer: fine)").matches && setActive((current) => current === index ? null : current)} onPointerDown={() => { pointerFocusRef.current = true; }} onFocus={() => { if (!pointerFocusRef.current) setActive(index); pointerFocusRef.current = false; }} onBlur={(event) => { const next = event.relatedTarget; if (!(next instanceof Node) || !event.currentTarget.contains(next)) setActive((current) => current === index ? null : current); }}><button type="button" aria-expanded={open} aria-controls={`support-detail-${index}`} onClick={() => { pointerFocusRef.current = false; setActive(open ? null : index); }}><span>{number}</span><h3>{title}</h3><i aria-hidden="true">{open ? "−" : "＋"}</i></button><div id={`support-detail-${index}`} className="pc-support-detail" aria-hidden={!open}><p>{body}</p></div></article>; })}</div>
  </div></section>;
}

function FaqSection() {
  const [active, setActive] = useState(0);
  return <section className="pc-section pc-faq" id="faq"><div className="pc-container pc-faq-layout"><SectionHeading label="FAQ / 05" title="よくある質問" lead="応募前に知っておきたいことをまとめました。" /><div className="pc-faq-list pc-motion-reveal">{faqs.map(({ question, answer }, index) => { const open = active === index; return <article className={open ? "is-open" : ""} key={question}><button type="button" aria-expanded={open} aria-controls={`faq-answer-${index}`} onClick={() => setActive(open ? -1 : index)}><span>Q{String(index + 1).padStart(2, "0")}</span><b>{question}</b><i aria-hidden="true">{open ? "×" : "＋"}</i></button><div id={`faq-answer-${index}`} className="pc-faq-answer" aria-hidden={!open}><div className="pc-faq-answer-inner">{answer}</div></div></article>; })}</div></div></section>;
}

type FormErrors = Record<string, string>;

function formControlName(target: EventTarget | null) {
  return target instanceof HTMLInputElement || target instanceof HTMLSelectElement ? target.name : "";
}

function fileError(file: File | null, required: boolean) {
  if (!file || !file.name) return required ? "PDFファイルを選択してください" : "";
  const hasPdfExtension = file.name.toLowerCase().endsWith(".pdf");
  const hasPdfMime = file.type === "application/pdf" || file.type === "";
  if (!hasPdfExtension || !hasPdfMime) return "PDF形式のファイルを選択してください";
  if (file.size > MAX_RECRUIT_FILE_BYTES) return "ファイルサイズは5MB以内にしてください";
  return "";
}

function validateForm(form: HTMLFormElement) {
  const data = new FormData(form);
  const errors: FormErrors = {};
  const value = (name: string) => String(data.get(name) ?? "").trim();
  if (!value("name")) errors.name = "氏名を入力してください";
  if (!value("kana")) errors.kana = "ふりがなを入力してください"; else if (!/^[ぁ-んー\s]+$/.test(value("kana"))) errors.kana = "ひらがなで入力してください";
  if (!value("birthYear") || !value("birthMonth") || !value("birthDay")) errors.birth = "生年月日を選択してください"; else { const year = Number(value("birthYear")); const month = Number(value("birthMonth")); const day = Number(value("birthDay")); const date = new Date(year, month - 1, day); const today = new Date(); if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day || date > today) errors.birth = "正しい日付を選択してください"; }
  if (!value("gender")) errors.gender = "性別を選択してください";
  if (!value("phone")) errors.phone = "電話番号を入力してください"; else if (!/^[0-9+()\-\s]{10,20}$/.test(value("phone"))) errors.phone = "電話番号の形式を確認してください";
  if (!value("email")) errors.email = "メールアドレスを入力してください"; else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email"))) errors.email = "メールアドレスの形式を確認してください";
  if (!value("address")) errors.address = "住所を入力してください";
  const resumeError = fileError(data.get("resume") as File | null, true); const historyError = fileError(data.get("workHistory") as File | null, true); const otherError = fileError(data.get("otherDocument") as File | null, false);
  if (resumeError) errors.resume = resumeError; if (historyError) errors.workHistory = historyError; if (otherError) errors.otherDocument = otherError;
  if (data.get("privacy") !== "accepted") errors.privacy = "個人情報の取り扱いへの同意が必要です";
  return errors;
}

function applicationFromForm(form: HTMLFormElement): RecruitApplication {
  const data = new FormData(form);
  return { name: String(data.get("name") ?? "").trim(), kana: String(data.get("kana") ?? "").trim(), birthYear: String(data.get("birthYear") ?? ""), birthMonth: String(data.get("birthMonth") ?? ""), birthDay: String(data.get("birthDay") ?? ""), gender: String(data.get("gender") ?? ""), phone: String(data.get("phone") ?? "").trim(), email: String(data.get("email") ?? "").trim(), address: String(data.get("address") ?? "").trim(), resume: data.get("resume") as File, workHistory: data.get("workHistory") as File, otherDocument: (data.get("otherDocument") as File)?.name ? data.get("otherDocument") as File : undefined };
}

declare global { interface Window { turnstile?: { render: (element: HTMLElement, options: Record<string, unknown>) => string; remove: (widgetId: string) => void; }; } }

function TurnstileWidget({ siteKey, onToken, onError }: { siteKey: string; onToken: (token: string) => void; onError: (message: string) => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let widgetId = ""; let cancelled = false; let interval = 0; let loadTimeout = 0;
    const render = () => { if (cancelled || !containerRef.current || !window.turnstile || widgetId) return; widgetId = window.turnstile.render(containerRef.current, { sitekey: siteKey, theme: "light", callback: (token: string) => { onError(""); onToken(token); }, "expired-callback": () => { onToken(""); onError("セキュリティ確認の有効期限が切れました。もう一度確認してください。"); }, "timeout-callback": () => { onToken(""); onError("セキュリティ確認がタイムアウトしました。もう一度お試しください。"); }, "error-callback": () => { onToken(""); onError("セキュリティ確認を読み込めませんでした。通信環境を確認してください。"); }, "refresh-expired": "auto", "refresh-timeout": "auto" }); if (interval) window.clearInterval(interval); if (loadTimeout) window.clearTimeout(loadTimeout); };
    interval = window.setInterval(render, 100);
    loadTimeout = window.setTimeout(() => { if (!widgetId) onError("セキュリティ確認を読み込めませんでした。ページを再読み込みしてください。"); }, 10_000);
    const existing = document.querySelector<HTMLScriptElement>('script[data-recruit-turnstile="true"]');
    if (existing) { if (window.turnstile) render(); else existing.addEventListener("load", render, { once: true }); } else { const script = document.createElement("script"); script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"; script.async = true; script.defer = true; script.dataset.recruitTurnstile = "true"; script.addEventListener("load", render, { once: true }); script.addEventListener("error", () => onError("セキュリティ確認を読み込めませんでした。通信環境を確認してください。"), { once: true }); document.head.append(script); }
    return () => { cancelled = true; window.clearInterval(interval); window.clearTimeout(loadTimeout); if (widgetId) window.turnstile?.remove(widgetId); onToken(""); onError(""); };
  }, [onError, onToken, siteKey]);
  return <div className="pc-turnstile" ref={containerRef} aria-label="セキュリティ確認" />;
}

function EntrySection({ allowSubmission }: { allowSubmission: boolean }) {
  const [errors, setErrors] = useState<FormErrors>({}); const [preview, setPreview] = useState<RecruitApplication | null>(null); const [turnstileToken, setTurnstileToken] = useState(""); const [turnstileAttempt, setTurnstileAttempt] = useState(0); const [turnstileError, setTurnstileError] = useState(""); const [submissionError, setSubmissionError] = useState(""); const [sentMessage, setSentMessage] = useState(""); const [submitting, setSubmitting] = useState(false); const [dirty, setDirty] = useState(false);
  const dialogRef = useRef<HTMLElement>(null); const formRef = useRef<HTMLFormElement>(null); const successRef = useRef<HTMLDivElement>(null); const lastFocused = useRef<HTMLElement | null>(null); const submittingRef = useRef(false); const restoreFocusRef = useRef(true);
  const endpoint = import.meta.env.VITE_RECRUIT_WPCF7_ENDPOINT; const turnstileSiteKey = import.meta.env.VITE_RECRUIT_TURNSTILE_SITE_KEY; const configured = allowSubmission && Boolean(parseRecruitEndpoint(endpoint) && turnstileSiteKey?.trim());
  const validateOne = (name: string) => { const form = formRef.current; if (!form || !name) return; const next = validateForm(form); const group = ["birthYear", "birthMonth", "birthDay"].includes(name) ? "birth" : name; setErrors((current) => { const copy = { ...current }; if (next[group]) copy[group] = next[group]; else delete copy[group]; return copy; }); };
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); const form = event.currentTarget; const next = validateForm(form); setErrors(next); if (Object.keys(next).length) { const first = Object.keys(next)[0]; requestAnimationFrame(() => form.querySelector<HTMLElement>(first === "birth" ? "[name='birthYear']" : `[name='${first}']`)?.focus()); return; } restoreFocusRef.current = true; setSubmissionError(""); setPreview(applicationFromForm(form)); };
  useEffect(() => { const beforeUnload = (event: BeforeUnloadEvent) => { if (!dirty) return; event.preventDefault(); event.returnValue = ""; }; window.addEventListener("beforeunload", beforeUnload); return () => window.removeEventListener("beforeunload", beforeUnload); }, [dirty]);
  useEffect(() => { submittingRef.current = submitting; }, [submitting]);
  useEffect(() => { if (sentMessage) successRef.current?.focus(); }, [sentMessage]);
  useEffect(() => {
    if (!preview) return; const dialog = dialogRef.current; lastFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; document.body.classList.add("pc-modal-open"); const selector = "a[href],button:not([disabled]),input:not([disabled]),iframe,[tabindex]:not([tabindex='-1'])"; const frame = requestAnimationFrame(() => (dialog?.querySelector<HTMLElement>(selector) ?? dialog)?.focus());
    const keydown = (event: KeyboardEvent) => { if (event.key === "Escape" && !submittingRef.current) { event.preventDefault(); setPreview(null); return; } if (event.key !== "Tab" || !dialog) return; const controls = Array.from(dialog.querySelectorAll<HTMLElement>(selector)); const first = controls[0]; const last = controls.at(-1); if (!first || !last) { event.preventDefault(); dialog.focus(); return; } if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); } else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); } };
    window.addEventListener("keydown", keydown); return () => { cancelAnimationFrame(frame); window.removeEventListener("keydown", keydown); document.body.classList.remove("pc-modal-open"); setTurnstileToken(""); if (restoreFocusRef.current) requestAnimationFrame(() => lastFocused.current?.focus()); };
  }, [preview]);
  const send = async () => { if (!preview || !configured || !turnstileToken) return; setSubmitting(true); setSubmissionError(""); const result = await submitRecruitApplication(preview, turnstileToken, endpoint); setSubmitting(false); if (result.ok) { restoreFocusRef.current = false; formRef.current?.reset(); setErrors({}); setDirty(false); setPreview(null); setSentMessage(result.message || "応募を受け付けました。担当者よりご連絡します。ありがとうございました。"); return; } if (result.kind === "validation" && result.invalidFields?.length) { const mapped: FormErrors = {}; result.invalidFields.forEach((item) => { const rawName = wpcf7FieldToFormField[item.field] ?? item.field; mapped[rawName.startsWith("birth") ? "birth" : rawName] = item.message; }); restoreFocusRef.current = false; setErrors((current) => ({ ...current, ...mapped })); setPreview(null); const field = Object.keys(mapped)[0]; requestAnimationFrame(() => formRef.current?.querySelector<HTMLElement>(field === "birth" ? "[name='birthYear']" : `[name='${field}']`)?.focus()); return; } setSubmissionError(result.message); setTurnstileToken(""); setTurnstileAttempt((attempt) => attempt + 1); };
  const fieldError = (name: string) => errors[name] ? <small id={`${name}-error`} role="alert">{errors[name]}</small> : null; const describedBy = (name: string) => errors[name] ? `${name}-error` : undefined;
  return <section className="pc-section pc-entry" id="entry"><div className="pc-container pc-entry-layout"><SectionHeading label="ENTRY / 06" title={<>ここから、<br />次の成長へ。</>} lead="必要事項と応募書類を入力し、確認画面へ進んでください。" />{sentMessage && <div ref={successRef} className="pc-form-success" role="status" tabIndex={-1}><strong>応募を受け付けました。</strong><p>{sentMessage}</p></div>}
    <form ref={formRef} className="pc-entry-form pc-motion-reveal" onSubmit={submit} onInput={() => setDirty(true)} onChange={() => setDirty(true)} onBlur={(event) => validateOne(formControlName(event.target))} noValidate>
      <fieldset className="pc-form-section"><legend>基本情報</legend><div className="pc-form-grid">
        <label><span>氏名 <b>必須</b></span><input name="name" required autoComplete="name" placeholder="山田 太郎" aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("name")} />{fieldError("name")}</label>
        <label><span>ふりがな <b>必須</b></span><input name="kana" required autoComplete="off" placeholder="やまだ たろう" aria-invalid={Boolean(errors.kana)} aria-describedby={describedBy("kana")} />{fieldError("kana")}</label>
        <fieldset className="pc-field pc-birth-field" aria-describedby={describedBy("birth")}><legend>生年月日 <b>必須</b></legend><div><label><span className="pc-sr-only">年</span><select name="birthYear" required defaultValue="" aria-invalid={Boolean(errors.birth)}><option value="" disabled>年</option>{years.map((year) => <option key={year}>{year}</option>)}</select></label><label><span className="pc-sr-only">月</span><select name="birthMonth" required defaultValue="" aria-invalid={Boolean(errors.birth)}><option value="" disabled>月</option>{months.map((month) => <option key={month}>{month}</option>)}</select></label><label><span className="pc-sr-only">日</span><select name="birthDay" required defaultValue="" aria-invalid={Boolean(errors.birth)}><option value="" disabled>日</option>{days.map((day) => <option key={day}>{day}</option>)}</select></label></div>{fieldError("birth")}</fieldset>
        <fieldset className="pc-field pc-gender"><legend>性別 <b>必須</b></legend><div>{["男性", "女性", "その他", "回答しない"].map((option) => <label key={option}><input type="radio" name="gender" value={option} required aria-invalid={Boolean(errors.gender)} aria-describedby={describedBy("gender")} /><span>{option}</span></label>)}</div>{fieldError("gender")}</fieldset>
        <label><span>電話番号 <b>必須</b></span><input name="phone" type="tel" required inputMode="tel" autoComplete="tel" placeholder="090-1234-5678" aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy("phone")} />{fieldError("phone")}</label>
        <label><span>メールアドレス <b>必須</b></span><input name="email" type="email" required inputMode="email" autoComplete="email" spellCheck={false} placeholder="name@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} />{fieldError("email")}</label>
        <label className="pc-field-wide"><span>住所 <b>必須</b></span><input name="address" required autoComplete="street-address" placeholder="東京都港区三田1-3-33" aria-invalid={Boolean(errors.address)} aria-describedby={describedBy("address")} />{fieldError("address")}</label>
      </div></fieldset>
      <fieldset className="pc-form-section pc-file-section"><legend>応募書類</legend><p>PDF形式・各5MB以内でアップロードしてください。</p><div className="pc-form-grid"><label className="pc-file-field"><span>履歴書 <b>必須</b></span><input name="resume" type="file" required accept="application/pdf,.pdf" onChange={() => requestAnimationFrame(() => validateOne("resume"))} aria-invalid={Boolean(errors.resume)} aria-describedby={describedBy("resume")} />{fieldError("resume")}</label><label className="pc-file-field"><span>職務経歴書 <b>必須</b></span><input name="workHistory" type="file" required accept="application/pdf,.pdf" onChange={() => requestAnimationFrame(() => validateOne("workHistory"))} aria-invalid={Boolean(errors.workHistory)} aria-describedby={describedBy("workHistory")} />{fieldError("workHistory")}</label><label className="pc-file-field pc-field-wide"><span>その他書類 <i>任意</i></span><input name="otherDocument" type="file" accept="application/pdf,.pdf" onChange={() => requestAnimationFrame(() => validateOne("otherDocument"))} aria-invalid={Boolean(errors.otherDocument)} aria-describedby={describedBy("otherDocument")} />{fieldError("otherDocument")}</label></div></fieldset>
      <label className="pc-privacy"><input name="privacy" type="checkbox" required value="accepted" aria-invalid={Boolean(errors.privacy)} aria-describedby={describedBy("privacy")} /><span><a href="https://incurise.co.jp/privacy-policy/" target="_blank" rel="noreferrer">個人情報の取り扱い</a>を確認し、同意します。</span>{fieldError("privacy")}</label>
      <button className="pc-confirm" type="submit">同意して入力内容の確認へ <ArrowAsset theme="white" /></button><p className="pc-form-caption">入力内容やファイルをブラウザに保存しません。送信は確認画面で行います。</p>
    </form></div>
    {preview && <div className="pc-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && !submitting && setPreview(null)}><section ref={dialogRef} className="pc-confirm-modal" role="dialog" aria-modal="true" aria-labelledby="pc-confirm-title" aria-describedby="pc-confirm-description" tabIndex={-1}><button className="pc-modal-close" type="button" onClick={() => setPreview(null)} disabled={submitting} aria-label="確認画面を閉じる"><X /></button><p className="pc-eyebrow">CONFIRM</p><h2 id="pc-confirm-title">入力内容の確認</h2><p id="pc-confirm-description">内容と添付ファイルを確認してください。</p><dl><div><dt>氏名</dt><dd>{preview.name}</dd></div><div><dt>ふりがな</dt><dd>{preview.kana}</dd></div><div><dt>生年月日</dt><dd>{preview.birthYear}年{preview.birthMonth}月{preview.birthDay}日</dd></div><div><dt>性別</dt><dd>{preview.gender}</dd></div><div><dt>電話番号</dt><dd>{preview.phone}</dd></div><div><dt>メールアドレス</dt><dd>{preview.email}</dd></div><div><dt>住所</dt><dd>{preview.address}</dd></div><div><dt>履歴書</dt><dd>{formatFile(preview.resume)}</dd></div><div><dt>職務経歴書</dt><dd>{formatFile(preview.workHistory)}</dd></div><div><dt>その他書類</dt><dd>{formatFile(preview.otherDocument)}</dd></div></dl>{!configured && <p className="pc-config-notice" role="status">{allowSubmission ? "応募受付システムの準備中です。入力内容の確認までは利用できます。" : "静止プレビューでは入力内容の確認まで利用できます。応募送信は正式サイトから行ってください。"}</p>}{configured && turnstileSiteKey && <TurnstileWidget key={turnstileAttempt} siteKey={turnstileSiteKey} onToken={setTurnstileToken} onError={setTurnstileError} />}{turnstileError && <p className="pc-submit-error" role="alert">{turnstileError}</p>}{submissionError && <p className="pc-submit-error" role="alert">{submissionError}</p>}<div className="pc-modal-actions"><button type="button" onClick={() => setPreview(null)} disabled={submitting}>修正する</button><button type="button" data-testid="recruit-submit" onClick={send} disabled={!configured || !turnstileToken || submitting}>{!configured ? "応募する（準備中）" : submitting ? "送信中…" : "応募する"}</button></div></section></div>}
  </section>;
}

type RecruitSiteProps = { motion?: boolean; preview?: boolean };

export function RecruitSite({ motion = true, preview = false }: RecruitSiteProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const root = rootRef.current; if (!root || !motion) return; const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches; if (reduceMotion) { root.dataset.motionReady = "reduced"; return; } root.dataset.motionReady = "true";
    const context = gsap.context(() => { const intro = gsap.timeline({ defaults: { ease: "power3.out" } }); intro.fromTo(".pc-hero-image", { scale: 1.08 }, { scale: 1, duration: 1.1 }).fromTo(".pc-hero-progression > *", { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: .5, stagger: .06 }, .15).fromTo(".pc-hero-copy > p, .pc-hero-copy > h1, .pc-hero-lead, .pc-hero-actions", { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: .65, stagger: .09 }, .35); gsap.to(".pc-hero-image", { yPercent: 8, scale: 1.04, ease: "none", scrollTrigger: { trigger: ".pc-hero", start: "top top", end: "bottom top", scrub: .6 } }); gsap.to(".pc-scroll-progress-bar", { scaleY: 1, scaleX: 1, ease: "none", scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: .2 } }); gsap.utils.toArray<HTMLElement>(".pc-motion-heading, .pc-motion-reveal").forEach((element) => gsap.fromTo(element, { y: 32, opacity: 0 }, { y: 0, opacity: 1, duration: .7, ease: "power3.out", scrollTrigger: { trigger: element, start: "top 86%", once: true } })); gsap.utils.toArray<HTMLElement>(".pc-motion-stagger").forEach((grid) => gsap.fromTo(Array.from(grid.children), { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: .6, stagger: .05, ease: "power3.out", scrollTrigger: { trigger: grid, start: "top 84%", once: true } })); gsap.utils.toArray<HTMLElement>(".pc-career-route").forEach((route) => { const line = route.querySelector(".pc-career-line"); if (line) gsap.fromTo(line, { scaleY: 0 }, { scaleY: 1, ease: "none", transformOrigin: "top center", scrollTrigger: { trigger: route, start: "top 70%", end: "bottom 55%", scrub: .35 } }); route.querySelectorAll(".pc-career-card").forEach((card) => ScrollTrigger.create({ trigger: card, start: "top 68%", end: "bottom 45%", toggleClass: { targets: card, className: "is-active" } })); }); }, root);
    const refresh = () => ScrollTrigger.refresh(); document.fonts.ready.then(refresh).catch(() => undefined); window.addEventListener("load", refresh, { once: true }); return () => { window.removeEventListener("load", refresh); context.revert(); delete root.dataset.motionReady; };
  }, [motion]);
  return <div ref={rootRef} className={`pc-site ${motion ? "has-motion" : "is-static-preview"}`} data-preview={preview || undefined}><Header />{motion && <div className="pc-scroll-progress" aria-hidden="true"><span className="pc-scroll-progress-bar" /></div>}<main>
    <section className="pc-hero" aria-labelledby="pc-hero-title"><picture><source media="(max-width: 767px)" srcSet={heroMobile} /><img className="pc-hero-image" src={hero} alt="プロジェクトについて話し合うチーム" fetchPriority="high" /></picture><div className="pc-hero-overlay" aria-hidden="true" /><div className="pc-hero-progression" aria-hidden="true"><span>0</span><img src={growthArrow} alt="" /><strong>1</strong><img src={growthArrow} alt="" /><strong>100</strong></div><div className="pc-hero-copy"><p>INCURISE CONSULTING / RECRUIT 2026</p><h1 id="pc-hero-title" aria-label="0から1の挑戦を、1から100の成長へ。"><span>0</span><img src={growthArrow} alt="" /><strong>1</strong>の挑戦を、<br /><span>1</span><img src={growthArrow} alt="" /><strong>100</strong>の成長へ。</h1><div className="pc-hero-lead">未経験から技術を仕事にする人も、経験を次の事業へつなぐ人も。<br />一人ひとりの現在地から、成長の続きをつくる。</div><div className="pc-hero-actions"><a href="https://incurise.co.jp/about/">私たちを知る <ArrowAsset theme="white" /></a></div></div></section>
    <IketeruSection />
    <section className="pc-section pc-career" id="career"><div className="pc-container"><SectionHeading label="CAREER PATH / 02" title="キャリアは、一本の線ではない。" lead="SEとして技術と現場を理解した先に、ConsultingとEngineeringの2つの道があります。志向や強みに合わせて、選び直せるキャリアです。" /><div className="pc-career-start pc-motion-reveal"><span>COMMON FOUNDATION</span><h3>技術を知ることから、すべてのキャリアが始まる。</h3><div className="pc-common-career">{commonCareer.map((stage) => <CareerCard key={stage.title} stage={stage} />)}</div></div><div className="pc-career-choice pc-motion-reveal"><span>CHOOSE YOUR PATH</span><p>経験と目標をすり合わせ、進むルートを選択します。</p></div><div className="pc-career-routes"><div className="pc-career-route"><span className="pc-career-line" aria-hidden="true" /><header><span>CONSULTING PATH</span><h3>課題整理から、経営・事業の推進へ。</h3></header>{consultingCareer.map((stage) => <CareerCard key={stage.title} stage={stage} />)}</div><div className="pc-career-route"><span className="pc-career-line" aria-hidden="true" /><header><span>ENGINEERING PATH</span><h3>技術を深め、開発チームを導く。</h3></header>{engineeringCareer.map((stage) => <CareerCard key={stage.title} stage={stage} />)}</div></div><div className="pc-senior-career pc-motion-stagger"><CareerCard dark stage={{ meta: "STEP 06 / 800–1200万円", title: "Manager / マネージャー", body: "複数プロジェクトと組織の成長を担い、成約まで現場営業を主導する。" }} /><CareerCard dark stage={{ meta: "STEP 07 / 売上連動", title: "Partner / パートナー", body: <span className="pc-partner-copy">経営視点で事業をつくり、次の<GrowthMark compact direction="0-1" />を生み出す。</span> }} /></div></div></section>
    <SupportSection />
    <section className="pc-section pc-jobs" id="jobs"><div className="pc-container"><SectionHeading label="JOBS / 04" title="あなたの強みが、次の役割になる。" lead="募集要項の詳細は、選考の中でも丁寧にお伝えします。" /><div className="pc-job-grid pc-motion-stagger"><article><span>ENGINEERING</span><h3>システムエンジニア</h3><p>要件整理、設計、開発を通じて、事業を支える仕組みをつくる。</p></article><article><span>CONSULTING</span><h3>ITコンサルタント</h3><p>顧客の課題を捉え、技術と実行をつないで変革を前へ進める。</p></article></div><div className="pc-selection pc-motion-reveal"><span>SELECTION FLOW</span><div>{["応募", "書類選考", "一次選考", "最終選考"].map((step, index) => <article key={step}><b>{String(index + 1).padStart(2, "0")}</b><h3>{step}</h3>{index < 3 && <ArrowAsset className="pc-selection-arrow" />}</article>)}</div></div></div></section>
    <FaqSection /><EntrySection allowSubmission={!preview} />
  </main><footer className="pc-footer"><div className="pc-footer-top"><a href="https://incurise.co.jp/" aria-label="インキュライズ公式サイト"><img src={logo} alt="INCURISE Consulting" /></a><div><a href="https://www.wantedly.com/companies/company_4522961" target="_blank" rel="noreferrer" aria-label="Wantedly"><img src={wantedly} alt="" /></a><a href="https://www.notion.so/Incurise-Consulting-1850e0dd05818078a32ff9df118ce9ff" target="_blank" rel="noreferrer" aria-label="Notion"><img src={notion} alt="" /></a></div></div><div className="pc-footer-bottom"><p>© INCURISE Consulting</p><nav aria-label="フッターナビゲーション">{navItems.map(([label, href]) => <a key={href} href={href}>{label}</a>)}</nav></div></footer></div>;
}

export default function PreviewApp() { return <RecruitSite motion={false} preview />; }

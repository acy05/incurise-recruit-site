import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import { Menu, X } from "lucide-react";

import logo from "./assets/preview/incurise-logo.png";
import hero from "./assets/preview/hero.png";
import heroMobile from "./assets/preview/hero-mobile.png";
import growthArrow from "./assets/preview/growth-arrow.png";
import buttonArrowDark from "./assets/preview/button-arrow-dark.png";
import buttonArrowWhite from "./assets/preview/button-arrow-white.png";
import wantedly from "./assets/preview/wantedly.png";
import notion from "./assets/preview/notion.png";

const navItems = [
  ["ABOUT", "#cr2-about"],
  ["CAREER", "#cr2-career"],
  ["SUPPORT & BENEFIT", "#cr2-support"],
  ["JOBS", "#cr2-jobs"],
  ["FAQ", "#cr2-faq"],
  ["ENTRY", "#cr2-entry"],
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

const careerRoutes = {
  se: {
    label: "SEプロフェッショナル",
    roles: ["Trainer", "SE", "SE Lead", "Tech Lead", "Manager", "Partner"],
  },
  consultant: {
    label: "コンサルタントプロフェッショナル",
    roles: ["Trainer", "SE", "Associate", "Consultant", "Senior Consultant", "Manager", "Partner"],
  },
} as const;

type CareerRoute = keyof typeof careerRoutes;

const supportItems: ReadonlyArray<{
  number: string;
  title: string;
  body: readonly string[];
}> = [
  { number: "01", title: "プログラミング研修", body: ["プログラミングスキルを継続的に学ぶ環境を提供しています。"] },
  { number: "02", title: "eラーニング", body: ["待機期間を含め、オンライン教材を使って時間や場所を選ばず継続的に学べます。"] },
  { number: "03", title: "コンサルタント研修", body: ["コンサルタントに必要な基礎・実践スキルを早期に身につけるための研修制度です。"] },
  { number: "04", title: "メンター制度", body: ["あなたのキャリア形成の後押し役として、役員が直接相談にのります。"] },
  {
    number: "05",
    title: "サポーター制度",
    body: [
      "全新入社員に1人、先輩社員がサポーターとしてアサインされます。",
      "入社直後から立ち上がりまでの支援を行います。",
    ],
  },
  { number: "06", title: "資格取得補助制度", body: ["資格試験に合格した際に、受験料とお祝い金が支給される制度です。"] },
  { number: "07", title: "各種休暇", body: ["夏季冬期、産前・産後休暇/育児休暇が利用いただけます。"] },
  {
    number: "08",
    title: "ちょ、帰社する？制度",
    body: ["メンバーと一緒に本社に帰社した際に、飲食代を補助する制度です。食事やゲームをしながら社員同士で交流を深めることができます。"],
  },
  { number: "09", title: "リファラル採用制度", body: ["紹介された候補者が入社すると一定の報奨金が支給される制度です。"] },
  {
    number: "10",
    title: "イベント制度",
    body: [
      "隔月で役員も参加するイベントを開催しています。",
      "BBQやゲーム大会などを通して、様々なメンバーと交流することができます。",
    ],
  },
  { number: "11", title: "IKETERU Consultant制度", body: ["コンサルタントへのキャリアチェンジを成功させた方に、スーツ一式をプレゼントする制度です。"] },
  {
    number: "12",
    title: "全社員集会",
    body: ["経営層から全社員に向けて理念を伝え、新入社員の紹介などを行う、隔月の集会です。"],
  },
  {
    number: "13",
    title: "決起集会",
    body: ["年に1度全社員が集まり、経営層から翌年に向けた重要な発表があります。豪華な景品が出るビンゴ大会も開催される、特別な集会です。"],
  },
  {
    number: "14",
    title: "住宅仲介手数料補助制度",
    body: ["住宅の賃貸・売買の際、会社と提供している不動産仲介会社を通して成約した場合、不動産仲介手数料が割引となる制度です。"],
  },
  { number: "15", title: "ディズニー/USJ施設優待制度", body: ["「たくさん歩いて健康促進」を目標に、上記テーマパークの入園料の一部を負担する制度です。"] },
];

const faqItems: ReadonlyArray<{ question: string; answer: ReactNode }> = [
  {
    question: "Q1.未経験でも応募することはできますか",
    answer: (
      <>
        <p>はい。インキュライズでは、まずSEとして経験を積み、そこからコンサルタントへとキャリアアップしていく道を用意しています</p>
        <p>入社後はJavaを中心とした3ヶ月間の研修に集中できる環境が整っており、業界未経験の方でも着実にステップを踏んでいただけます</p>
      </>
    ),
  },
  {
    question: "Q2.評価基準を教えてください",
    answer: (
      <>
        <p>「AKGK」の4軸で評価されます</p>
        <dl className="cr2-akgk">
          <div><dt>A</dt><dd>粗利（個人の粗利率）</dd></div>
          <div><dt>K</dt><dd>稼働率（個人の稼働率）</dd></div>
          <div><dt>G</dt><dd>現場評価（個人の現場評価）</dd></div>
          <div><dt>K</dt><dd>会社貢献</dd></div>
        </dl>
      </>
    ),
  },
  {
    question: "Q3.配属やプロジェクトはどのように決まりますか？",
    answer: (
      <>
        <p>経験、伸ばしたい領域、プロジェクト状況を確認しながら、営業担当と相談して決定します</p>
        <p>大まかな流れは下記になります</p>
        <ol>
          <li>営業担当と配属先の希望をすり合わせます</li>
          <li>営業担当が、希望に沿った案件情報を集めます</li>
          <li>クライアント企業との面談を経て、アサイン先が決まります</li>
        </ol>
      </>
    ),
  },
  {
    question: "Q4.リモートで働く環境はありますか",
    answer: <p>リモート可能な案件もありますが、全てではないため出社前提でご入社いただくことになります</p>,
  },
  {
    question: "Q5.副業は可能ですか",
    answer: (
      <>
        <p>申請いただき、社内確認の上で可能となります</p>
        <p>本業に一切の影響がないことが条件となります</p>
      </>
    ),
  },
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 1949 }, (_, index) => String(currentYear - index));
const months = Array.from({ length: 12 }, (_, index) => String(index + 1));
const days = Array.from({ length: 31 }, (_, index) => String(index + 1));
const maxFileBytes = 5 * 1024 * 1024;

function scrollToSection(selector: string) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelector<HTMLElement>(selector)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
}

function ArrowAsset({ light = false }: { light?: boolean }) {
  return <img className="cr2-arrow-asset" src={light ? buttonArrowWhite : buttonArrowDark} width="61" height="15" alt="" aria-hidden="true" />;
}

function Header() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.classList.toggle("cr2-menu-open", open);
    if (!open) return;
    const menu = dialogRef.current;
    const selector = "button:not([disabled]),a[href]";
    const frame = requestAnimationFrame(() => menu?.querySelector<HTMLElement>(selector)?.focus());
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab" || !menu) return;
      const controls = Array.from(menu.querySelectorAll<HTMLElement>(selector));
      const first = controls[0];
      const last = controls.at(-1);
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("cr2-menu-open");
      requestAnimationFrame(() => triggerRef.current?.focus());
    };
  }, [open]);

  const navigate = (target: string) => {
    setOpen(false);
    requestAnimationFrame(() => scrollToSection(target));
  };

  return (
    <>
      <header className="cr2-header">
        <button type="button" className="cr2-brand" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="ページ上部へ">
          <img src={logo} width="390" height="302" alt="INCURISE Consulting" />
          <span>RECRUIT 2026</span>
        </button>
        <nav className="cr2-desktop-nav" aria-label="主要ナビゲーション">
          {navItems.slice(0, -1).map(([label, target]) => (
            <button type="button" key={target} onClick={() => scrollToSection(target)}>{label}</button>
          ))}
        </nav>
        <button type="button" className="cr2-entry-button" onClick={() => scrollToSection("#cr2-entry")}>ENTRY <ArrowAsset light /></button>
        <button
          ref={triggerRef}
          type="button"
          className="cr2-menu-button"
          aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          aria-expanded={open}
          aria-controls="cr2-mobile-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </header>
      <div ref={dialogRef} id="cr2-mobile-navigation" className={`cr2-mobile-menu ${open ? "is-open" : ""}`} aria-hidden={!open}>
        <nav aria-label="モバイルナビゲーション">
          {navItems.map(([label, target], index) => (
            <button type="button" key={target} onClick={() => navigate(target)}><span>{String(index + 1).padStart(2, "0")}</span>{label}</button>
          ))}
        </nav>
      </div>
    </>
  );
}

function OfficialLabel({ children }: { children: ReactNode }) {
  return <div className="cr2-official-label"><em>{children}</em><span className="cr2-official-mark" aria-hidden="true"><i /><b /></span></div>;
}

function SectionHeading({ index, label, title, lead }: { index: string; label: string; title: ReactNode; lead: string }) {
  return (
    <header className="cr2-section-heading">
      <p>{label} / {index}</p>
      <h2>{title}</h2>
      <div>{lead}</div>
    </header>
  );
}

function Hero() {
  return (
    <section className="cr2-hero" aria-labelledby="cr2-hero-title">
      <picture>
        <source media="(max-width: 767px)" srcSet={heroMobile} />
        <img src={hero} width="1586" height="992" alt="プロジェクトについて話し合うチーム" fetchPriority="high" />
      </picture>
      <div className="cr2-hero-shade" aria-hidden="true" />
      <div className="cr2-growth-sequence" aria-hidden="true">
        <span>0</span><img src={growthArrow} width="39" height="16" alt="" /><strong>1</strong><img src={growthArrow} width="39" height="16" alt="" /><strong>100</strong>
      </div>
      <div className="cr2-hero-copy">
        <p>INCURISE CONSULTING / RECRUIT 2026</p>
        <h1 id="cr2-hero-title" aria-label="0から1の挑戦を、1から100の成長へ。">
          <span>0</span><img src={growthArrow} width="39" height="16" alt="" /><strong>1</strong>の挑戦を、<br />
          <span>1</span><img src={growthArrow} width="39" height="16" alt="" /><strong>100</strong>の成長へ。
        </h1>
        <div className="cr2-hero-lead">未経験から技術を仕事にする人も、経験を次の事業へつなぐ人も。<br />一人ひとりの現在地から、成長の続きをつくる。</div>
        <a href="https://incurise.co.jp/about/">私たちを知る <ArrowAsset light /></a>
      </div>
    </section>
  );
}

function IketeruSection() {
  return (
    <section className="cr2-iketeru" id="cr2-about">
      <div className="cr2-container">
        <header className="cr2-iketeru-intro">
          <OfficialLabel>ABOUT / IKETERU</OfficialLabel>
          <h2>さらなる成長と成功へ、<br />共に挑戦する</h2>
          <p>技術だけでも、人間力だけでもない。クライアントと並走し、課題の本質へ向き合うために、私たちが大切にする6つの価値観です。</p>
        </header>
        <h3 className="cr2-iketeru-grid-intro">技術力×人間力。IKETERU人材を育てる。</h3>
        <div className="cr2-iketeru-grid">
          {iketeruValues.map((value) => (
            <article key={value.number}>
              <span>{value.number}</span>
              <p>{value.en}</p>
              <h3>{value.ja}</h3>
              <strong>{value.title}</strong>
              <div>{value.body}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CareerSection() {
  const [active, setActive] = useState<CareerRoute>("se");
  const tabRefs = useRef<Record<CareerRoute, HTMLButtonElement | null>>({ se: null, consultant: null });
  const routeKeys = Object.keys(careerRoutes) as CareerRoute[];
  const route = careerRoutes[active];

  const onTabKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>, current: CareerRoute) => {
    const index = routeKeys.indexOf(current);
    let nextIndex = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % routeKeys.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + routeKeys.length) % routeKeys.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = routeKeys.length - 1;
    else return;
    event.preventDefault();
    const next = routeKeys[nextIndex];
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section className="cr2-career" id="cr2-career">
      <div className="cr2-container">
        <SectionHeading
          index="02"
          label="CAREER PATH"
          title={<>志向に応じて選べる、<br />2つのキャリアパス。</>}
          lead="SEとして技術と現場を理解した先に、専門性を深める道と、課題解決を担う道があります。"
        />
        <div className="cr2-career-shell">
          <div className="cr2-career-tabs" role="tablist" aria-label="キャリアパスを選択">
            {routeKeys.map((key) => (
              <button
                key={key}
                ref={(node) => { tabRefs.current[key] = node; }}
                id={`cr2-career-tab-${key}`}
                type="button"
                role="tab"
                aria-selected={active === key}
                aria-controls={`cr2-career-panel-${key}`}
                tabIndex={active === key ? 0 : -1}
                className={active === key ? "is-active" : ""}
                onClick={() => setActive(key)}
                onKeyDown={(event) => onTabKeyDown(event, key)}
              >
                {careerRoutes[key].label}<i aria-hidden="true" />
              </button>
            ))}
          </div>
          <section
            key={active}
            id={`cr2-career-panel-${active}`}
            role="tabpanel"
            aria-labelledby={`cr2-career-tab-${active}`}
            className="cr2-career-panel"
            tabIndex={0}
          >
            <p>{route.label}</p>
            <ol>
              {route.roles.map((role, index) => (
                <li key={role}>
                  <span>Step {index + 1}</span>
                  <strong>{role}</strong>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>
    </section>
  );
}

function SupportSection() {
  const [active, setActive] = useState<number | null>(null);
  const pointerFocusRef = useRef(false);
  const supportsHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  return (
    <section className="cr2-support" id="cr2-support">
      <div className="cr2-container">
        <SectionHeading
          index="03"
          label="SUPPORT & BENEFIT"
          title={<>“IKETERU”あなたを<br />支える仕組み</>}
          lead="制度名を選ぶと詳細を確認できます。PCではカーソル、スマホではタップ、キーボードではEnterまたはSpaceで操作できます。"
        />
        <div className="cr2-support-grid">
          {supportItems.map((item, index) => {
            const open = active === index;
            return (
              <article
                key={item.number}
                className={open ? "is-open" : ""}
                onMouseEnter={() => supportsHover() && setActive(index)}
                onMouseLeave={() => supportsHover() && setActive((current) => current === index ? null : current)}
                onPointerDown={() => { pointerFocusRef.current = true; }}
                onFocus={() => {
                  if (!pointerFocusRef.current) setActive(index);
                  pointerFocusRef.current = false;
                }}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                    setActive((current) => current === index ? null : current);
                  }
                }}
              >
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`cr2-support-detail-${index}`}
                  onClick={() => setActive(open ? null : index)}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter" && event.key !== " ") return;
                    event.preventDefault();
                    setActive(index);
                  }}
                >
                  <span>{item.number}</span>
                  <h3>{item.title}</h3>
                  <i aria-hidden="true">{open ? "−" : "＋"}</i>
                </button>
                {open && (
                  <div id={`cr2-support-detail-${index}`} className="cr2-support-detail">
                    {item.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function JobsSection() {
  return (
    <section className="cr2-jobs" id="cr2-jobs">
      <div className="cr2-container">
        <SectionHeading
          index="04"
          label="JOBS"
          title={<>あなたの強みが、<br />次の役割になる。</>}
          lead="募集要項の詳細は、選考の中でも丁寧にお伝えします。"
        />
        <div className="cr2-job-grid">
          <article><span>ENGINEERING</span><h3>システムエンジニア</h3><p>要件整理、設計、開発を通じて、事業を支える仕組みをつくる。</p></article>
          <article><span>CONSULTING</span><h3>ITコンサルタント</h3><p>顧客の課題を捉え、技術と実行をつないで変革を前へ進める。</p></article>
        </div>
        <div className="cr2-selection">
          <p>SELECTION FLOW</p>
          <ol>
            {["応募", "書類選考", "一次選考", "最終選考"].map((step, index) => (
              <li key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong></li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

function FaqSection() {
  const [active, setActive] = useState<number | null>(null);
  return (
    <section className="cr2-faq" id="cr2-faq">
      <div className="cr2-container cr2-faq-layout">
        <SectionHeading index="05" label="FAQ" title="よくある質問" lead="応募前に知っておきたいことをまとめました。" />
        <div className="cr2-faq-list">
          {faqItems.map((item, index) => {
            const open = active === index;
            return (
              <article key={item.question} className={open ? "is-open" : ""}>
                <button type="button" aria-expanded={open} aria-controls={`cr2-faq-answer-${index}`} onClick={() => setActive(open ? null : index)}>
                  <b>{item.question}</b><i aria-hidden="true">{open ? "−" : "＋"}</i>
                </button>
                {open && <div id={`cr2-faq-answer-${index}`} className="cr2-faq-answer">{item.answer}</div>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

type FormErrors = Record<string, string>;
type ApplicationPreview = {
  name: string;
  kana: string;
  birthYear: string;
  birthMonth: string;
  birthDay: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  resume?: File;
  workHistory?: File;
  otherDocument?: File;
};

function fileError(file: File | undefined, required: boolean) {
  if (!file) return required ? "PDFファイルを選択してください" : "";
  if (!file.name.toLowerCase().endsWith(".pdf") || (file.type && file.type !== "application/pdf")) return "PDF形式のファイルを選択してください";
  if (file.size > maxFileBytes) return "ファイルサイズは5MB以内にしてください";
  return "";
}

function getFile(data: FormData, name: string) {
  const value = data.get(name);
  return value instanceof File && value.name ? value : undefined;
}

function validateForm(form: HTMLFormElement) {
  const data = new FormData(form);
  const value = (name: string) => String(data.get(name) ?? "").trim();
  const errors: FormErrors = {};
  if (!value("name")) errors.name = "氏名を入力してください";
  if (!value("kana")) errors.kana = "ふりがなを入力してください";
  else if (!/^[ぁ-んー\s]+$/.test(value("kana"))) errors.kana = "ひらがなで入力してください";
  if (!value("birthYear") || !value("birthMonth") || !value("birthDay")) errors.birth = "生年月日を選択してください";
  else {
    const year = Number(value("birthYear"));
    const month = Number(value("birthMonth"));
    const day = Number(value("birthDay"));
    const date = new Date(year, month - 1, day);
    if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day || date > new Date()) errors.birth = "正しい日付を選択してください";
  }
  if (!value("gender")) errors.gender = "性別を選択してください";
  if (!value("phone")) errors.phone = "電話番号を入力してください";
  else if (!/^[0-9+()\-\s]{10,20}$/.test(value("phone"))) errors.phone = "電話番号の形式を確認してください";
  if (!value("email")) errors.email = "メールアドレスを入力してください";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value("email"))) errors.email = "メールアドレスの形式を確認してください";
  if (!value("address")) errors.address = "住所を入力してください";
  const resumeError = fileError(getFile(data, "resume"), true);
  const workError = fileError(getFile(data, "workHistory"), true);
  const otherError = fileError(getFile(data, "otherDocument"), false);
  if (resumeError) errors.resume = resumeError;
  if (workError) errors.workHistory = workError;
  if (otherError) errors.otherDocument = otherError;
  if (!value("privacy")) errors.privacy = "個人情報の取り扱いへの同意が必要です";
  return errors;
}

function createPreview(form: HTMLFormElement): ApplicationPreview {
  const data = new FormData(form);
  const value = (name: string) => String(data.get(name) ?? "").trim();
  return {
    name: value("name"),
    kana: value("kana"),
    birthYear: value("birthYear"),
    birthMonth: value("birthMonth"),
    birthDay: value("birthDay"),
    gender: value("gender"),
    phone: value("phone"),
    email: value("email"),
    address: value("address"),
    resume: getFile(data, "resume"),
    workHistory: getFile(data, "workHistory"),
    otherDocument: getFile(data, "otherDocument"),
  };
}

function formatFile(file?: File) {
  if (!file) return "なし";
  const size = file.size < 1024 * 1024 ? `${Math.max(1, Math.round(file.size / 1024))}KB` : `${(file.size / 1024 / 1024).toFixed(1)}MB`;
  return `${file.name}（${size}）`;
}

function EntrySection() {
  const formRef = useRef<HTMLFormElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [preview, setPreview] = useState<ApplicationPreview | null>(null);
  const [dirty, setDirty] = useState(false);

  const validateOne = (name: string) => {
    const form = formRef.current;
    if (!form || !name) return;
    const all = validateForm(form);
    const group = ["birthYear", "birthMonth", "birthDay"].includes(name) ? "birth" : name;
    setErrors((current) => {
      const next = { ...current };
      if (all[group]) next[group] = all[group];
      else delete next[group];
      return next;
    });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const next = validateForm(form);
    setErrors(next);
    if (Object.keys(next).length) {
      const first = Object.keys(next)[0];
      requestAnimationFrame(() => form.querySelector<HTMLElement>(first === "birth" ? "[name='birthYear']" : `[name='${first}']`)?.focus());
      return;
    }
    lastFocused.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPreview(createPreview(form));
  };

  useEffect(() => {
    if (!preview) return;
    document.body.classList.add("cr2-modal-open");
    const dialog = dialogRef.current;
    const selector = "button:not([disabled]),a[href],[tabindex]:not([tabindex='-1'])";
    const frame = requestAnimationFrame(() => (dialog?.querySelector<HTMLElement>(selector) ?? dialog)?.focus());
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setPreview(null);
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const controls = Array.from(dialog.querySelectorAll<HTMLElement>(selector));
      const first = controls[0];
      const last = controls.at(-1);
      if (!first || !last) {
        event.preventDefault();
        dialog.focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      document.body.classList.remove("cr2-modal-open");
      requestAnimationFrame(() => lastFocused.current?.focus());
    };
  }, [preview]);

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", beforeUnload);
    return () => window.removeEventListener("beforeunload", beforeUnload);
  }, [dirty]);

  const error = (name: string) => errors[name] ? <small id={`cr2-${name}-error`} role="alert">{errors[name]}</small> : null;
  const describedBy = (name: string) => errors[name] ? `cr2-${name}-error` : undefined;
  const onBlur = (event: React.FocusEvent<HTMLFormElement>) => {
    const target = event.target;
    if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
      const name = target.name;
      requestAnimationFrame(() => validateOne(name));
    }
  };

  return (
    <section className="cr2-entry" id="cr2-entry">
      <div className="cr2-container cr2-entry-layout">
        <SectionHeading index="06" label="ENTRY" title={<>ここから、<br />次の成長へ。</>} lead="必要事項と応募書類を入力し、確認画面へ進んでください。" />
        <form ref={formRef} className="cr2-form" onSubmit={submit} onBlur={onBlur} onInput={() => setDirty(true)} onChange={() => setDirty(true)} noValidate>
          {Object.keys(errors).length > 1 && (
            <div className="cr2-error-summary" role="alert" tabIndex={-1}>
              <strong>入力内容を確認してください</strong>
              <p>{Object.keys(errors).length}件の項目に修正が必要です。</p>
            </div>
          )}
          <fieldset>
            <legend>基本情報</legend>
            <div className="cr2-form-grid">
              <label><span>氏名 <b>必須</b></span><input name="name" autoComplete="name" placeholder="山田 太郎" aria-invalid={Boolean(errors.name)} aria-describedby={describedBy("name")} />{error("name")}</label>
              <label><span>ふりがな <b>必須</b></span><input name="kana" autoComplete="off" placeholder="やまだ たろう" aria-invalid={Boolean(errors.kana)} aria-describedby={describedBy("kana")} />{error("kana")}</label>
              <fieldset className="cr2-field cr2-birth" aria-describedby={describedBy("birth")}>
                <legend>生年月日 <b>必須</b></legend>
                <div>
                  <label><span className="cr2-sr-only">年</span><select name="birthYear" defaultValue="" aria-invalid={Boolean(errors.birth)}><option value="" disabled>年</option>{years.map((year) => <option key={year}>{year}</option>)}</select></label>
                  <label><span className="cr2-sr-only">月</span><select name="birthMonth" defaultValue="" aria-invalid={Boolean(errors.birth)}><option value="" disabled>月</option>{months.map((month) => <option key={month}>{month}</option>)}</select></label>
                  <label><span className="cr2-sr-only">日</span><select name="birthDay" defaultValue="" aria-invalid={Boolean(errors.birth)}><option value="" disabled>日</option>{days.map((day) => <option key={day}>{day}</option>)}</select></label>
                </div>{error("birth")}
              </fieldset>
              <fieldset className="cr2-field cr2-gender">
                <legend>性別 <b>必須</b></legend>
                <div>{["男性", "女性", "その他", "回答しない"].map((option) => <label key={option}><input type="radio" name="gender" value={option} aria-invalid={Boolean(errors.gender)} aria-describedby={describedBy("gender")} /><span>{option}</span></label>)}</div>
                {error("gender")}
              </fieldset>
              <label><span>電話番号 <b>必須</b></span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="090-1234-5678" aria-invalid={Boolean(errors.phone)} aria-describedby={describedBy("phone")} />{error("phone")}</label>
              <label><span>メールアドレス <b>必須</b></span><input name="email" type="email" inputMode="email" autoComplete="email" spellCheck={false} placeholder="name@example.com" aria-invalid={Boolean(errors.email)} aria-describedby={describedBy("email")} />{error("email")}</label>
              <label className="cr2-wide"><span>住所 <b>必須</b></span><input name="address" autoComplete="street-address" placeholder="東京都港区三田1-3-33" aria-invalid={Boolean(errors.address)} aria-describedby={describedBy("address")} />{error("address")}</label>
            </div>
          </fieldset>
          <fieldset>
            <legend>応募書類</legend>
            <p>PDF形式・各5MB以内でアップロードしてください。</p>
            <div className="cr2-form-grid">
              <label className="cr2-file"><span>履歴書 <b>必須</b></span><input name="resume" type="file" accept="application/pdf,.pdf" onChange={() => requestAnimationFrame(() => validateOne("resume"))} aria-invalid={Boolean(errors.resume)} aria-describedby={describedBy("resume")} />{error("resume")}</label>
              <label className="cr2-file"><span>職務経歴書 <b>必須</b></span><input name="workHistory" type="file" accept="application/pdf,.pdf" onChange={() => requestAnimationFrame(() => validateOne("workHistory"))} aria-invalid={Boolean(errors.workHistory)} aria-describedby={describedBy("workHistory")} />{error("workHistory")}</label>
              <label className="cr2-file cr2-wide"><span>その他書類 <i>任意</i></span><input name="otherDocument" type="file" accept="application/pdf,.pdf" onChange={() => requestAnimationFrame(() => validateOne("otherDocument"))} aria-invalid={Boolean(errors.otherDocument)} aria-describedby={describedBy("otherDocument")} />{error("otherDocument")}</label>
            </div>
          </fieldset>
          <label className="cr2-privacy"><input name="privacy" type="checkbox" value="accepted" aria-invalid={Boolean(errors.privacy)} aria-describedby={describedBy("privacy")} /><span><a href="https://incurise.co.jp/privacy-policy/" target="_blank" rel="noreferrer">個人情報の取り扱い</a>を確認し、同意します。</span>{error("privacy")}</label>
          <button className="cr2-confirm" type="submit">同意して入力内容の確認へ <ArrowAsset light /></button>
          <p className="cr2-preview-notice">プレビューのため応募情報は送信されません</p>
        </form>
      </div>
      {preview && (
        <div className="cr2-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setPreview(null)}>
          <div ref={dialogRef} className="cr2-modal" role="dialog" aria-modal="true" aria-labelledby="cr2-modal-title" aria-describedby="cr2-modal-description" tabIndex={-1}>
            <button type="button" className="cr2-modal-close" onClick={() => setPreview(null)} aria-label="確認画面を閉じる"><X aria-hidden="true" /></button>
            <p>CONFIRM</p>
            <h2 id="cr2-modal-title">入力内容の確認</h2>
            <div id="cr2-modal-description">内容と添付ファイルを確認してください。</div>
            <dl>
              <div><dt>氏名</dt><dd>{preview.name}</dd></div>
              <div><dt>ふりがな</dt><dd>{preview.kana}</dd></div>
              <div><dt>生年月日</dt><dd>{preview.birthYear}年{preview.birthMonth}月{preview.birthDay}日</dd></div>
              <div><dt>性別</dt><dd>{preview.gender}</dd></div>
              <div><dt>電話番号</dt><dd>{preview.phone}</dd></div>
              <div><dt>メールアドレス</dt><dd>{preview.email}</dd></div>
              <div><dt>住所</dt><dd>{preview.address}</dd></div>
              <div><dt>履歴書</dt><dd>{formatFile(preview.resume)}</dd></div>
              <div><dt>職務経歴書</dt><dd>{formatFile(preview.workHistory)}</dd></div>
              <div><dt>その他書類</dt><dd>{formatFile(preview.otherDocument)}</dd></div>
            </dl>
            <p className="cr2-modal-notice">プレビューのため応募情報は送信されません</p>
            <div className="cr2-modal-actions"><button type="button" onClick={() => setPreview(null)}>修正する</button><button type="button" disabled>応募する（プレビュー）</button></div>
          </div>
        </div>
      )}
    </section>
  );
}

function Footer() {
  return (
    <footer className="cr2-footer">
      <div className="cr2-footer-top">
        <a href="https://incurise.co.jp/" aria-label="インキュライズ公式サイト"><img src={logo} width="390" height="302" loading="lazy" alt="INCURISE Consulting" /></a>
        <div>
          <a href="https://www.wantedly.com/companies/company_4522961" target="_blank" rel="noreferrer" aria-label="Wantedly"><img src={wantedly} width="80" height="57" loading="lazy" alt="" /></a>
          <a href="https://www.notion.so/Incurise-Consulting-1850e0dd05818078a32ff9df118ce9ff" target="_blank" rel="noreferrer" aria-label="Notion"><img src={notion} width="83" height="84" loading="lazy" alt="" /></a>
        </div>
      </div>
      <div className="cr2-footer-bottom">
        <p>© INCURISE Consulting</p>
        <nav aria-label="フッターナビゲーション">{navItems.map(([label, target]) => <a key={target} href={target}>{label}</a>)}</nav>
      </div>
    </footer>
  );
}

export default function CommentRevisionApp() {
  return (
    <div className="cr2-site">
      <a className="cr2-skip-link" href="#cr2-main">本文へ移動</a>
      <Header />
      <main id="cr2-main">
        <Hero />
        <IketeruSection />
        <CareerSection />
        <SupportSection />
        <JobsSection />
        <FaqSection />
        <EntrySection />
      </main>
      <Footer />
    </div>
  );
}

import { useEffect, useRef, useState } from "react";
import {
  ArrowUp,
  ArrowUpRight,
  Check,
  CheckCheck,
  Copy,
  Menu,
  Pause,
  Play,
  Plus,
  X,
} from "lucide-react";
import { ApproachArtwork, ChapterArtwork, DesignTicker } from "./StudioMotionArtwork";
import "./studio-landing.css";
import FriendlyLaunch from "./FriendlyLaunch";
import "./studio-polish.css";
import "./studio-motion-polish.css";
import "./studio-responsive.css";

const services = [
  {
    n: "01",
    en: "CORPORATE SITE",
    title: "会社の魅力を、信頼に。",
    name: "コーポレートサイト",
    body: "事業の強みや想いを整理し、「この会社と仕事がしたい」と思える接点をつくります。",
    tags: ["企業ブランディング", "サイトリニューアル"],
    theme: "corporate",
  },
  {
    n: "02",
    en: "LANDING PAGE",
    title: "心が動く。その先へ。",
    name: "サービス・商品LP",
    body: "伝わるストーリーと迷わない導線で、興味を相談や購入といった次のアクションへ。",
    tags: ["新規事業", "広告・集客"],
    theme: "landing",
  },
  {
    n: "03",
    en: "RECRUIT SITE",
    title: "ここで働く、をつくる。",
    name: "採用サイト",
    body: "人、仕事、カルチャー。募集要項だけでは伝わらない、あなたの会社らしさを届けます。",
    tags: ["採用ブランディング", "カルチャー発信"],
    theme: "recruit",
  },
];
const faqs = [
  [
    "何も決まっていなくても相談できますか？",
    "もちろんです。「今のサイトをなんとかしたい」「新しい事業を知ってほしい」といった段階からご相談いただけます。お話を伺いながら、目的と優先順位を一緒に整理します。",
  ],
  [
    "制作費用はどのくらいですか？",
    "ページ数、必要な機能、原稿や写真の準備範囲によって変わるため、個別にお見積もりします。初回のご相談と概算のお見積もりは無料です。ご予算に合わせて、必要な範囲からご提案します。",
  ],
  [
    "公開までにどのくらいかかりますか？",
    "サイトの規模や素材の準備状況によって異なります。ご希望の公開時期を伺い、要件整理・制作・確認に必要な期間を含めてスケジュールをご提案します。",
  ],
  [
    "文章や写真の準備もお願いできますか？",
    "はい。伝えたい内容の整理や原稿の構成、撮影・素材の準備方法からご相談いただけます。必要な支援の範囲は、お見積もりの際に明確にします。",
  ],
  [
    "公開後の運用やデータ分析も相談できますか？",
    "はい。更新・保守に加え、アクセス状況の整理や分析、改善提案もご相談いただけます。データ分析と継続改善は、サイト公開後に必要な場合だけ選べる別契約のオプションです。",
  ],
];
const nav = [
  ["サービス", "services"],
  ["私たちの考え方", "approach"],
  ["制作の流れ", "process"],
  ["よくある質問", "faq"],
];
const topics = [
  "新しくサイトをつくりたい",
  "今のサイトをリニューアル",
  "まずは相談してみたい",
];
const consultationEmail = "hp_sales-bounces@isaac-inc.co.jp";

function Consultation({
  topic,
  setTopic,
}: {
  topic: string;
  setTopic: (topic: string) => void;
}) {
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    setCopied(false);
    setCopyError(false);
    clearTimeout(timer.current);
  }, [topic, message]);
  const consultationText = `Web制作のご相談\n相談したいこと：${topic}\n${message ? `補足：${message}` : "詳細はお話ししながら相談したいです。"}`;
  const consultationMailto = `mailto:${consultationEmail}?subject=${encodeURIComponent("Web制作のご相談")}&body=${encodeURIComponent(consultationText)}`;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(consultationText);
      setCopied(true);
      setCopyError(false);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopyError(true);
    }
  };
  return (
    <div className="consultation">
      <div className="consultation-heading">
        <span className="status-dot" />
        LET’S START A CONVERSATION
      </div>
      <h3>
        いま、どんなことを
        <br />
        考えていますか？
      </h3>
      <fieldset>
        <legend>ご相談のきっかけ</legend>
        {topics.map((t) => (
          <label key={t} className={topic === t ? "selected" : ""}>
            <input
              type="radio"
              name="topic"
              checked={topic === t}
              onChange={() => setTopic(t)}
            />
            <span>{t}</span>
            {topic === t ? <Check size={17} /> : <Plus size={17} />}
          </label>
        ))}
      </fieldset>
      <label className="message-label" htmlFor="consultation-message">
        もう少し詳しく <span>任意</span>
      </label>
      <textarea
        id="consultation-message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        maxLength={2000}
        placeholder="例：新サービスのLPをつくりたい。予算や進め方から相談したいです。"
        rows={3}
      />
      <div className="consultation-next">
        <button type="button" className="copy-button" onClick={copy}>
          {copied ? <CheckCheck size={16} /> : <Copy size={16} />}
          {copied ? "コピーしました" : "相談内容をコピー"}
        </button>
        <span aria-live="polite">
          {copyError
            ? "コピーできませんでした。内容を選択してコピーしてください。"
            : "選択した内容は、メール本文にも自動で反映されます。"}
        </span>
      </div>
      {copyError && (
        <div className="manual-copy">
          <label htmlFor="consultation-copy-fallback">
            こちらを選択してコピーしてください
          </label>
          <textarea
            id="consultation-copy-fallback"
            readOnly
            value={consultationText}
            onFocus={(e) => e.currentTarget.select()}
            rows={4}
          />
        </div>
      )}
      <a
        className="button button--orange"
        href={consultationMailto}
      >
        メールで無料相談する
        <ArrowUpRight size={20} />
      </a>
      <p className="contact-note">
        メールアプリが開きます。
        <br />
        内容をご確認のうえ送信してください。
      </p>
    </div>
  );
}

export default function StudioLanding() {
  const [topic, setTopic] = useState(topics[2]);
  const root = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const menuPanel = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [reduced, setReduced] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [faqInstant, setFaqInstant] = useState(false);

  useEffect(() => {
    const query = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReduced(query.matches);
      setPaused(query.matches);
    };
    update();
    query.addEventListener("change", update);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-revealed", "true");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.04, rootMargin: "0px 0px 48px 0px" },
    );
    root.current
      ?.querySelectorAll("[data-reveal]")
      .forEach((el) => observer.observe(el));
    return () => {
      query.removeEventListener("change", update);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const scenes = Array.from(root.current?.querySelectorAll<HTMLElement>("[data-motion-scene]") ?? []);
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle("scene-in-view", entry.isIntersecting));
    }, { rootMargin: "80px" });
    scenes.forEach(scene => observer.observe(scene));
    const visibility = () => root.current?.classList.toggle("page-hidden", document.hidden);
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, []);

  useEffect(() => {
    const wide = matchMedia("(min-width: 901px)");
    const closeOnDesktop = () => {
      if (wide.matches) setMenuOpen(false);
    };
    wide.addEventListener("change", closeOnDesktop);
    return () => wide.removeEventListener("change", closeOnDesktop);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    menuPanel.current?.querySelector<HTMLAnchorElement>("a")?.focus();
    const keydown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const elements = [
        menuButton.current,
        ...Array.from(
          menuPanel.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [],
        ),
      ].filter(Boolean) as HTMLElement[];
      const index = elements.indexOf(document.activeElement as HTMLElement);
      e.preventDefault();
      elements[
        (index + (e.shiftKey ? -1 : 1) + elements.length) % elements.length
      ]?.focus();
    };
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", keydown);
      menuButton.current?.focus({ preventScroll: true });
    };
  }, [menuOpen]);

  useEffect(() => {
    const container = root.current!;
    let request = 0;
    const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    const navigate = async (hash: string, initial = false) => {
      const current = ++request;
      let id: string;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const section = document.getElementById(id);
      if (!section || !container.contains(section)) return;

      // Let the menu close and fonts / FAQ finish changing the page's layout.
      await frame();
      await frame();
      await document.fonts.ready;
      const transitions = Array.from(container.querySelectorAll<HTMLElement>(".faq-answer"))
        .flatMap(answer => answer.getAnimations());
      await Promise.allSettled(transitions.map(animation => animation.finished));
      if (current !== request) return;

      const anchor = section.matches("section")
        ? section.querySelector<HTMLElement>(".section-label, .fd-label") ?? section
        : section;
      // offsetTop measures layout before entrance transforms, even on the first visit.
      let top = 0;
      for (let node: HTMLElement | null = anchor; node; node = node.offsetParent as HTMLElement | null) {
        top += node.offsetTop;
      }
      // The main site's header scrolls away; all section labels share this inset.
      top = id === "top" ? 0 : Math.max(0, top - 32);
      if (!initial && location.hash !== hash) history.pushState(null, "", hash);
      if (!section.hasAttribute("tabindex")) section.tabIndex = -1;
      section.focus({ preventScroll: true });
      const motionOff = matchMedia("(prefers-reduced-motion: reduce)").matches || container.classList.contains("motion-paused");
      window.scrollTo({ top, behavior: initial || motionOff ? "instant" : "smooth" });
    };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href);
      if (!url.hash || url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
      event.preventDefault();
      setMenuOpen(false);
      void navigate(url.hash);
    };
    const hashChange = () => { void navigate(location.hash || "#top", true); };
    const cancel = () => { request++; };
    container.addEventListener("click", click);
    window.addEventListener("hashchange", hashChange);
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    if (location.hash) void navigate(location.hash, true);
    return () => {
      request++;
      container.removeEventListener("click", click);
      window.removeEventListener("hashchange", hashChange);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
    };
  }, []);
  const toggleMotion = () => setPaused((current) => !current);
  return (
    <div
      ref={root}
      className={`studio ${paused ? "motion-paused" : ""} ${reduced ? "motion-reduced" : ""}`}
      id="top"
    >
      <a className="skip-link" href="#main">
        本文へ移動
      </a>
      <header className="studio-header">
        <a className="brand" href="#top" aria-label="ISAAC トップ">
          ISAAC<span>WEB DESIGN STUDIO</span>
        </a>
        <nav className="desktop-nav" aria-label="メインナビゲーション">
          {nav.map(([text, id]) => (
            <a key={id} href={`#${id}`}>
              {text}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <a href="#contact" className="header-contact">
            無料で相談する
          </a>
          <button
            ref={menuButton}
            className="menu-button"
            aria-label={menuOpen ? "メニューを閉じる" : "メニューを開く"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>
      <nav
        ref={menuPanel}
        id="mobile-menu"
        className="mobile-menu"
        aria-label="モバイルナビゲーション"
        hidden={!menuOpen}
      >
        {nav.map(([text, id], i) => (
          <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
            <small>0{i + 1}</small>
            {text}
          </a>
        ))}
        <a href="#contact" onClick={() => setMenuOpen(false)}>
          <small>05</small>無料で相談する
        </a>
      </nav>
      <main id="main">
        <FriendlyLaunch
          theme={topics.indexOf(topic)}
          setTheme={(index) => setTopic(topics[index])}
        />
        <DesignTicker />
        <section className="intro section-shell" id="intro">
          <div className="section-label" data-reveal>
            <span>01 / HELLO, WE’RE ISAAC</span>
            <i />
          </div>
          <div className="intro-grid">
            <h2 data-reveal>
              フルオーダーを、
              <br />
              <span className="orange">もっと身近</span>に。
            </h2>
            <div data-reveal>
              <p className="large-copy">
                見た目も、使いやすさも、
                <br />
                貴社のために一から。
              </p>
              <p>
                テンプレートに事業を合わせるのではなく、
                <br />
                事業の目的や届けたい相手に合わせて設計します。
                <br />
                言葉になっていない段階からご相談ください。
              </p>
              <p>
                ブランドの印象やUIは、人が丁寧に判断する。
                <br />
                コーディングはAIを活用して効率化する。
                <br />
                品質を大切にしながら、工数と納期を抑えます。
              </p>
              <a className="text-link" href="#approach">
                私たちが大切にしていること
              </a>
            </div>
          </div>
        </section>
        <section className="services section-shell" id="services">
          <div className="section-label" data-reveal>
            <span>02 / WHAT WE DO</span>
            <i />
          </div>
          <div className="section-title" data-reveal>
            <h2>
              あなたの「次」に、
              <br />
              ちょうどいいWebを。
            </h2>
            <p>
              コーポレート、LP、採用サイト。
              <br />
              目的に合わせて、ゼロから設計します。
            </p>
          </div>
          <div className="service-grid">
            {services.map((s) => (
              <article
                className="service-card"
                id={`service-${s.theme}`}
                key={s.n}
                data-reveal
              >
                <div className="service-meta">
                  <span>
                    {s.n} / {s.en}
                  </span>
                </div>
                <h3>{s.title}</h3>
                <h4>{s.name}</h4>
                <p>{s.body}</p>
                <div className="tags">
                  {s.tags.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                <a className="service-consult text-link" href="#contact">
                  {s.name}の相談をする
                </a>
              </article>
            ))}
          </div>
          <div className="service-foot" data-reveal>
            <span>
              テンプレートに合わせるのではなく、
              <br className="mobile-only" />
              目的とご予算に合わせて必要な範囲をご提案します。
            </span>
            <a className="text-link" href="#contact">
              こんなこと頼める？と相談する
            </a>
          </div>
        </section>
        <section className="approach" id="approach">
          <ApproachArtwork />
          <div className="approach-content">
            <div className="section-label" data-reveal>
              <span>03 / OUR APPROACH</span>
            </div>
            <h2 data-reveal>
              人とAI、
              <br />
              それぞれの強みで。
            </h2>
            <p className="approach-lead" data-reveal>
              感性と判断は人が。時間のかかる実装はAIで。
              <br />
              品質とスピードを両立します。
            </p>
            {[
              [
                "01",
                "人が、デザインする。",
                "ブランドの世界観、見た目の印象、使いやすさ。センスと判断が必要な部分は、専任者が丁寧に設計します。",
              ],
              [
                "02",
                "AIで、実装を速く。",
                "コーディングや調整にAIを活用し、制作工程を効率化。オリジナルデザインを短い期間で形にします。",
              ],
              [
                "03",
                "動きまで、設計する。",
                "スクロール演出やアニメーションにも対応。見栄えだけでなく、伝わり方まで考えて実装します。",
              ],
            ].map(([n, t, b]) => (
              <article className="approach-item" key={n} data-reveal>
                <span>{n}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{b}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="process section-shell" id="process">
          <div className="section-label" data-reveal>
            <span>04 / HOW WE WORK</span>
            <i />
          </div>
          <div className="section-title" data-reveal>
            <h2>
              はじめの一歩から、
              <br />
              迷わせません。
            </h2>
            <p>
              難しい専門用語は、いりません。
              <br />
              ひとつずつ、対話しながら進めていきます。
            </p>
          </div>
          <div className="process-grid">
            {[
              [
                "01",
                "LISTEN",
                "まずは、お話から。",
                "今のお悩みや叶えたいことを伺います。構想段階でも、お気軽に。",
                "無料相談",
              ],
              [
                "02",
                "PLAN",
                "道筋を、一緒に。",
                "目的や必要な機能を整理。制作範囲・費用・スケジュールをご提案。",
                "企画・お見積もり",
              ],
              [
                "03",
                "CREATE",
                "想いを、かたちに。",
                "構成・デザイン・実装へ。節目ごとにご確認いただきながら制作。",
                "デザイン・開発",
              ],
              [
                "04",
                "LAUNCH",
                "届ける準備を、整える。",
                "PC・スマートフォンの表示や操作を確認し、公開まで伴走します。",
                "確認・公開",
              ],
            ].map(([n, en, t, b, tag]) => (
              <article key={n} data-reveal>
                <div className="step-top">
                  <span>{n}</span>
                </div>
                <p className="step-en">{en}</p>
                <h3>{t}</h3>
                <p>{b}</p>
                <span className="step-tag">{tag}</span>
              </article>
            ))}
          </div>
          <div className="process-note" data-reveal>
            <span>NO PRESSURE, JUST POSSIBILITIES.</span>
            <p>
              ご予算・スケジュールも、
              <br className="mobile-only" />
              無理のない進め方を一緒に考えます。
            </p>
            <a href="#contact">
              まずは気軽に相談する
            </a>
          </div>
          <aside className="aftercare-option" data-reveal aria-labelledby="aftercare-title">
            <div className="aftercare-heading">
              <span>OPTION / AFTER LAUNCH</span>
              <h3 id="aftercare-title">
                公開後は、
                <br />
                データで育てる。
              </h3>
              <p>
                アクセス状況やお問い合わせの動きを整理し、改善の優先順位をご提案します。
                サイト制作後に、必要な場合だけ選べるオプションです。
              </p>
            </div>
            <div className="aftercare-list">
              <article>
                <span>01</span>
                <h4>データを整える</h4>
                <p>目的に必要な情報を整理し、定期的に確認できる形へ。</p>
              </article>
              <article>
                <span>02</span>
                <h4>動きを分析する</h4>
                <p>アクセスや反応を読み取り、課題と改善の仮説を明確に。</p>
              </article>
              <article>
                <span>03</span>
                <h4>改善を続ける</h4>
                <p>優先順位を決め、更新や改修を無理のない範囲で継続。</p>
              </article>
            </div>
            <div className="aftercare-foot">
              <small>データ分析・改善支援は、Webサイト制作とは別契約のオプションです。</small>
              <a className="text-link" href="#contact">公開後の改善について相談する</a>
            </div>
          </aside>
        </section>
        <section className="statement" data-motion-scene>
          <ChapterArtwork />
          <p data-reveal>YOUR NEXT CHAPTER</p>
          <h2 data-reveal>
            その一歩が、
            <br />
            <em>未来を変えていく。</em>
          </h2>
          <span data-reveal>LET’S MAKE IT HAPPEN, TOGETHER.</span>
        </section>
        <section className="faq section-shell" id="faq">
          <div className="faq-heading" data-reveal>
            <div className="section-label">
              <span>05 / FAQ</span>
            </div>
            <h2>
              気になること、
              <br />
              先にお答えします。
            </h2>
            <p>
              ここにないご質問も、
              <br />
              どうぞお気軽に。
            </p>
            <a className="text-link" href="#contact">
              質問してみる
            </a>
          </div>
          <div className="faq-list" data-instant={faqInstant}>
            {faqs.map(([q, a], i) => (
              <article
                className={activeFaq === i ? "faq-open" : ""}
                key={q}
                data-reveal
              >
                <h3>
                  <button
                    aria-expanded={activeFaq === i}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-question-${i}`}
                    onClick={(event) => {
                      setFaqInstant(event.detail === 0);
                      setActiveFaq(activeFaq === i ? null : i);
                    }}
                  >
                    <span>Q.{String(i + 1).padStart(2, "0")}</span>
                    {q}
                    <svg className="faq-toggle-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M5 12h14" />
                      <path className="faq-toggle-stem" d="M12 5v14" />
                    </svg>
                  </button>
                </h3>
                <div
                  className="faq-answer"
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  aria-hidden={activeFaq !== i}
                >
                  <div className="faq-answer-inner"><p>{a}</p></div>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="contact section-shell" id="contact" tabIndex={-1}>
          <div className="contact-copy">
            <div className="section-label">
              <span>06 / LET’S TALK</span>
            </div>
            <h2>
              まずは、
              <br />
              話してみませんか<span>？</span>
            </h2>
            <p>
              うまく説明できなくても大丈夫。
              <br />
              あなたの「こんなことできる？」を
              <br />
              聞かせてください。
            </p>
            <div className="contact-benefits">
              <span>
                <Check size={16} />
                初回相談・お見積もり無料
              </span>
              <span>
                <Check size={16} />
                オンラインで全国対応
              </span>
              <span>
                <Check size={16} />
                構想段階・相見積もりも歓迎
              </span>
            </div>
            <span className="contact-scribble" aria-hidden="true">
              Hello, possibility.
            </span>
          </div>
          <Consultation topic={topic} setTopic={setTopic} />
        </section>
      </main>
      <footer className="studio-footer">
        <div className="footer-top">
          <a className="brand" href="#top">
            ISAAC<span>WEB DESIGN STUDIO</span>
          </a>
          <a href="#top">
            BACK TO TOP
            <ArrowUp size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ISAAC</span>
          <div>
            <a href="https://www.isaac-inc.co.jp/" target="_blank" rel="noreferrer">
              運営会社
              <ArrowUpRight size={12} />
            </a>
            <a
              href="https://www.isaac-inc.co.jp/privacy.php"
              target="_blank"
              rel="noreferrer"
            >
              プライバシーポリシー
              <ArrowUpRight size={12} />
            </a>
          </div>
          <span>IDEAS INTO DIGITAL EXPERIENCES.</span>
        </div>
      </footer>
      <button
        className="motion-control"
        onClick={toggleMotion}
        aria-label={
          paused
            ? "アニメーションを再生"
            : "アニメーションを一時停止"
        }
        aria-pressed={paused}
      >
        {paused ? <Play size={13} /> : <Pause size={13} />}
        <span>MOTION {paused ? "OFF" : "ON"}</span>
      </button>
    </div>
  );
}

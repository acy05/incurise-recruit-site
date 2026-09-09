import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  CheckCheck,
  Copy,
  Menu,
  Minus,
  Pause,
  Play,
  Plus,
  X,
} from "lucide-react";
import heroVideo from "./assets/generated/paper-motion/sunlit-paper-motion.mp4";
import heroPoster from "./assets/generated/paper-motion/sunlit-paper-poster.jpg";
import "./studio-landing.css";
import FriendlyLaunch from "./FriendlyLaunch";
import "./studio-polish.css";

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
    "公開後の更新・運用も相談できますか？",
    "はい。更新しやすい仕組みの導入から、公開後の保守・改善までご相談いただけます。社内の運用体制に合った方法をご提案します。",
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
    <div className="consultation" data-reveal>
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
            : "コピーした内容を、次のフォームに貼り付けられます。"}
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
        href="https://incurise.co.jp/contact/"
        target="_blank"
        rel="noreferrer"
      >
        無料相談へ進む
        <ArrowUpRight size={20} />
      </a>
      <p className="contact-note">
        運営会社の相談フォームが別タブで開きます。
        <br />
        このページで入力した内容は自動送信されません。
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
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
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
    const videos = Array.from(root.current?.querySelectorAll("video") ?? []);
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          const video = e.target as HTMLVideoElement;
          if (e.isIntersecting && !paused && !document.hidden)
            void video.play().catch(() => undefined);
          else video.pause();
        }),
      { threshold: 0.01 },
    );
    videos.forEach((v) => observer.observe(v));
    const visibility = () =>
      videos.forEach((v) => {
        const rect = v.getBoundingClientRect();
        if (
          !document.hidden &&
          !paused &&
          rect.bottom > 0 &&
          rect.top < innerHeight
        )
          void v.play().catch(() => undefined);
        else v.pause();
      });
    visibility();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [paused]);

  useEffect(() => {
    const wide = matchMedia("(min-width: 761px)");
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
      menuButton.current?.focus();
    };
  }, [menuOpen]);

  const toggleMotion = () => setPaused((current) => !current);
  const video = (className: string) => (
    <video
      className={className}
      muted
      loop
      playsInline
      preload="metadata"
      poster={heroPoster}
      aria-hidden="true"
    >
      <source src={heroVideo} type="video/mp4" />
    </video>
  );
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
            <ArrowUpRight size={16} />
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
            <ArrowUpRight />
          </a>
        ))}
        <a href="#contact" onClick={() => setMenuOpen(false)}>
          <small>05</small>無料で相談する
          <ArrowUpRight />
        </a>
      </nav>
      <main id="main">
        <FriendlyLaunch
          theme={topics.indexOf(topic)}
          setTheme={(index) => setTopic(topics[index])}
        />
        <div className="ticker" aria-hidden="true">
          <div>
            {[0, 1, 2, 3].map((i) => (
              <span key={i}>
                IDEAS INTO IMPACT <i>✳</i> DESIGN WITH PURPOSE <i>✳</i>{" "}
              </span>
            ))}
          </div>
        </div>
        <section className="intro section-shell" id="intro">
          <div className="section-label" data-reveal>
            <span>01 / HELLO, WE’RE ISAAC</span>
            <i />
          </div>
          <div className="intro-grid">
            <h2 data-reveal>
              いいWebは、
              <br />
              いい<span className="orange">対話</span>から。
            </h2>
            <div data-reveal>
              <p className="large-copy">
                つくりたいものが、
                <br />
                まだ言葉になっていなくても。
              </p>
              <p>
                「私たちらしさって、なんだろう。」
                <br />
                「もっと、サービスの魅力を届けたい。」
                <br />
                そんな小さな問いから、私たちの制作は始まります。
              </p>
              <p>
                事業を知る。想いを聴く。届け方を考える。
                <br />
                見た目の美しさと、使う人へのやさしさ。
                <br />
                その両方を大切に、あなたの一歩に伴走します。
              </p>
              <a className="text-link" href="#approach">
                私たちが大切にしていること
                <ArrowUpRight size={18} />
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
              目的に合わせて、ゼロから設計。
              <br />
              企画から公開、その先までお手伝いします。
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
                  <ArrowUpRight size={17} />
                </a>
              </article>
            ))}
          </div>
          <div className="service-foot" data-reveal>
            <span>
              小さな改善から、事業の立ち上げまで。
              <br className="mobile-only" />
              ご予算や状況に合わせてご提案します。
            </span>
            <a className="text-link" href="#contact">
              こんなこと頼める？と相談する
              <ArrowUpRight size={18} />
            </a>
          </div>
        </section>
        <section className="approach" id="approach">
          <div className="approach-art" aria-hidden="true">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <div className="orbit orbit-three" />
            <span className="orbit-center">✳</span>
            <span className="orbit-word">THINK. CREATE. GROW.</span>
          </div>
          <div className="approach-content">
            <div className="section-label" data-reveal>
              <span>03 / OUR APPROACH</span>
            </div>
            <h2 data-reveal>
              つくって終わり、
              <br />
              にはしない。
            </h2>
            <p className="approach-lead" data-reveal>
              ビジネスの視点と、クリエイティブの力。
              <br />
              その掛け合わせで、意味のあるWebを。
            </p>
            {[
              [
                "01",
                "本質から、考える。",
                "誰に、何を届け、どうなってほしいのか。デザインの前に、事業の目的と課題を一緒に整理します。",
              ],
              [
                "02",
                "らしさを、かたちに。",
                "言葉、写真、余白、動き。一つひとつに理由を持たせ、あなたの会社ならではの魅力を表現します。",
              ],
              [
                "03",
                "公開の先も、ともに。",
                "スマートフォンでの使いやすさや更新性も大切に。公開後の運用・改善まで見据えて設計します。",
              ],
            ].map(([n, t, b]) => (
              <article className="approach-item" key={n} data-reveal>
                <span>{n}</span>
                <div>
                  <h3>{t}</h3>
                  <p>{b}</p>
                </div>
                <ArrowUpRight size={19} />
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
                "GROW",
                "ここからが、始まり。",
                "表示や操作を確認して公開。運用や更新、改善もご相談ください。",
                "公開・運用",
              ],
            ].map(([n, en, t, b, tag]) => (
              <article key={n} data-reveal>
                <div className="step-top">
                  <span>{n}</span>
                  <ArrowRight size={22} />
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
              <ArrowUpRight size={17} />
            </a>
          </div>
        </section>
        <section className="statement">
          {video("statement-video")}
          <div className="statement-overlay" />
          <p data-reveal>YOUR NEXT CHAPTER</p>
          <h2 data-reveal>
            その一歩が、
            <br />
            未来を変えていく。
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
              <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="faq-list">
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
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  >
                    <span>Q.{String(i + 1).padStart(2, "0")}</span>
                    {q}
                    {activeFaq === i ? <Minus size={18} /> : <Plus size={18} />}
                  </button>
                </h3>
                <div
                  className="faq-answer"
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                  hidden={activeFaq !== i}
                >
                  <p>{a}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
        <section className="contact section-shell" id="contact" tabIndex={-1}>
          <div className="contact-copy" data-reveal>
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
              <ArrowUpRight />
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
            <ArrowUpRight size={17} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} ISAAC</span>
          <div>
            <a href="https://incurise.co.jp/" target="_blank" rel="noreferrer">
              運営会社
              <ArrowUpRight size={12} />
            </a>
            <a
              href="https://incurise.co.jp/privacy-policy/"
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
            ? "背景動画とアニメーションを再生"
            : "背景動画とアニメーションを一時停止"
        }
        aria-pressed={paused}
      >
        {paused ? <Play size={13} /> : <Pause size={13} />}
        <span>MOTION {paused ? "OFF" : "ON"}</span>
      </button>
    </div>
  );
}

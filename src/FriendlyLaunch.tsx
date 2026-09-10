import { AsteriskMark } from "./AsteriskMark";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import team from "./assets/generated/hero/hero-team.webp";
import "./friendly-launch.css";
import "./sample-showcase.css";
import "./sample-fonts.css";
function Cta({ children }: { children: ReactNode }) {
  return (
    <a className="fd-cta" href="#contact">
      {children}
    </a>
  );
}
function CrispTiltCard({ children }: { children: ReactNode }) {
  const shell = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const surface = card.current;
    const frame = shell.current;
    if (!surface || !frame) return;
    // The doubled paint scale is cancelled visually, while text retains finer sampling.
    const measure = () => { frame.style.height = `${surface.offsetHeight}px`; };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(surface);
    return () => observer.disconnect();
  }, []);
  return <div className="fd-c-chat-shell" ref={shell}>
    <div className="fd-c-chat" ref={card}>{children}</div>
  </div>;
}
function Friendly({
  theme,
  setTheme,
}: {
  theme: number;
  setTheme: (value: number) => void;
}) {
  return (
    <div className="fd-friendly">
      <section className="fd-c-body" aria-labelledby="hero-title">
        <div className="fd-c-copy">
          <p className="fd-label">HELLO. WE’RE ISAAC.</p>
          <h1 id="hero-title">
            いいWebを、
            <br />
            いい<span>関係</span>から。
          </h1>
          <p className="fd-c-lead">
            「こんなこと、できる？」から始めましょう。
            <br />
            まだまとまっていない想いも、一緒にかたちに。
            <br />
            企画も、デザインも、公開のその先も。
          </p>
          <div className="fd-c-trust">
            <span>初回相談無料</span>
            <span>オンラインで全国対応</span>
          </div>
        </div>
        <CrispTiltCard>
          <div className="fd-c-chat-head">
            <span className="fd-c-dot" /> LET’S TALK <span>01 / HELLO</span>
          </div>
          <h2>
            いま、どんなことを
            <br />
            考えていますか？
          </h2>
          <div className="fd-c-choices" role="group" aria-label="相談テーマ">
            {[
              "新しくサイトをつくりたい",
              "今のサイトをもっと良くしたい",
              "まずは、相談してみたい",
            ].map((text, i) => (
              <button
                key={text}
                type="button"
                aria-pressed={theme === i}
                onClick={() => setTheme(i)}
              >
                <span aria-hidden="true">0{i + 1}</span>
                {text}
                <b aria-hidden="true">{theme === i ? "✓" : ""}</b>
              </button>
            ))}
          </div>
          <Cta>
            {theme === 0
              ? "新しいサイトについて話す"
              : theme === 1
                ? "リニューアルについて話す"
                : "まずは気軽に話す"}
          </Cta>
          <small>まだ具体的に決まっていなくても大丈夫です。</small>
        </CrispTiltCard>
        <div className="fd-c-flower" aria-hidden="true">
          <svg viewBox="0 0 200 200">
            <path
              d="M100 15C118-5 139 18 134 40C160 27 183 51 164 74C196 80 196 116 164 123C183 146 161 173 135 158C139 187 105 202 91 176C72 203 42 181 53 156C23 163 7 130 33 115C6 94 23 65 49 69C33 39 66 20 84 43C77 18 93 5 100 15Z"
              fill="currentColor"
            />
            <circle cx="79" cy="95" r="5" fill="#fff2de" />
            <circle cx="115" cy="95" r="5" fill="#fff2de" />
            <path
              d="M78 114q20 20 39-2"
              stroke="#fff2de"
              strokeWidth="4"
              fill="none"
            />
          </svg>
        </div>
      </section>
      <footer className="fd-c-foot">
        <strong>
          Small talk.<em> Big possibilities.</em>
        </strong>
        <span>
          相談したから、依頼しなくちゃ。
          <br />
          そんな心配は、いりません。
        </span>
      </footer>
    </div>
  );
}
function WorkCards() {
  const asset = `${import.meta.env.BASE_URL}isaac/samples/`;
  return (
    <div className="fd-work-grid sample-gallery">
      <article className="fd-work">
        <div className="fd-work-art sample-site sample-sora" aria-hidden="true">
          <div className="sample-nav"><strong>SORA<span>ARCHITECTS</span></strong><div>ABOUT　 WORKS　 JOURNAL <span className="sample-menu">＝</span></div></div>
          <div className="sora-visual">
            <img src={`${asset}sora-courtyard.webp`} width={1448} height={1086} loading="lazy" decoding="async" alt="" />
            <div className="sora-title"><span>SPACES FOR A SLOWER LIFE</span><h3>余白と、<br />暮らす。</h3><p>Live with less. Feel a little more.</p></div>
            <span className="sora-index">01 ━━━ 03</span><span className="sora-project">光を紡ぐ家 / 設計を見る</span>
          </div>
          <div className="sora-bottom"><span>OUR PHILOSOPHY</span><p>美しいのは、<br />そこにある日常。</p><i>建築と自然、人と暮らし。<br />そのあいだを、ていねいに。</i></div>
        </div>
        <a className="sample-open" href={`${import.meta.env.BASE_URL}web-production/samples/sora/`} aria-label="SORAのサンプルサイトを見る"><span>サイトを見る</span></a>
        <footer><span>01 / CORPORATE SITE</span><a href={`${import.meta.env.BASE_URL}web-production/samples/sora/`}>SORAを見る</a></footer>
      </article>
      <article className="fd-work">
        <div className="fd-work-art sample-site sample-next" aria-hidden="true">
          <div className="sample-nav"><strong>next<span className="next-dot">.</span></strong><div>PEOPLE　 CULTURE <span className="next-entry">ENTRY</span></div></div>
          <div className="next-copy"><span>YOUR NEXT CHAPTER STARTS HERE.</span><h3>次の自分を、<br /><em>おもしろく。</em></h3><p>まだない答えを、一緒につくろう。</p><span className="next-star" aria-hidden="true"><AsteriskMark /></span></div>
          <div className="next-photo"><img src={team} width={1586} height={992} loading="lazy" decoding="async" alt="" /></div>
          <div className="next-bottom"><strong>その一歩が、<br />チームの未来になる。</strong><span>私たちについて知る</span></div>
        </div>
        <a className="sample-open" href={`${import.meta.env.BASE_URL}web-production/samples/next/`} aria-label="next.のサンプルサイトを見る"><span>サイトを見る</span></a>
        <footer><span>02 / RECRUIT SITE</span><a href={`${import.meta.env.BASE_URL}web-production/samples/next/`}>next.を見る</a></footer>
      </article>
      <article className="fd-work">
        <div className="fd-work-art sample-site sample-mellow" aria-hidden="true">
          <img className="mellow-photo" src={`${asset}mellow-botanical.webp`} width={1122} height={1402} loading="lazy" decoding="async" alt="" />
          <div className="sample-nav"><strong>mellow</strong><div>OUR STORY　 PRODUCTS <span className="sample-menu">＋</span></div></div>
          <div className="mellow-copy"><span>A MOMENT, JUST FOR YOU.</span><h3>A little<br /><em>closer to nature.</em></h3><p>肌にも、心にも。<br />自然体の心地よさを。</p></div>
          <div className="mellow-bottom"><span>THE DAILY RITUAL<br /><strong>Botanical body milk</strong></span><span className="mellow-shop">Discover mellow</span></div>
        </div>
        <a className="sample-open" href={`${import.meta.env.BASE_URL}web-production/samples/mellow/`} aria-label="mellowのサンプルサイトを見る"><span>サイトを見る</span></a>
        <footer><span>03 / LANDING PAGE</span><a href={`${import.meta.env.BASE_URL}web-production/samples/mellow/`}>mellowを見る</a></footer>
      </article>
    </div>
  );
}
function Showcase() {
  return (
    <div className="fd-showcase">
      <section
        className="fd-d-body"
        id="design-samples"
        aria-labelledby="samples-title"
      >
        <div className="fd-d-heading">
          <div>
            <p className="fd-label">DESIGN THAT MOVES YOU.</p>
            <h2 id="samples-title">
              伝わる。
              <br />
              <span>その先まで、</span>つくる。
            </h2>
          </div>
          <div className="fd-d-intro">
            <p>
              会社の顔も、サービスの入口も。
              <br />
              目的に合うデザインで、
              <br />
              次のアクションが生まれるWebへ。
            </p>
            <Cta>つくりたいものを相談する</Cta>
          </div>
        </div>
        <WorkCards />
        <footer className="fd-d-foot">
          <span>DESIGN STUDIES / ORIGINAL CONCEPTS</span>
          <span>
            掲載は制作実績ではなく、オリジナルのデザインサンプルです。
          </span>
        </footer>
      </section>
    </div>
  );
}

export default function FriendlyLaunch({
  theme,
  setTheme,
}: {
  theme: number;
  setTheme: (value: number) => void;
}) {
  return (
    <div className="launch-sections fd-frame">
      <Friendly theme={theme} setTheme={setTheme} />
      <Showcase />
    </div>
  );
}

import { GeometricHero } from "./GeometricHero";
import growthArrow from "./assets/preview/growth-arrow.png";
import linkArrow from "./assets/preview/button-arrow-white.png";
import "./adopted-hero.css";

/** Approved spatial study E, isolated from the other comparison routes. */
export function AdoptedHero() {
  return (
    <section className="cr2-adopted-hero" aria-labelledby="cr2-hero-title">
      <GeometricHero centerShift={-.24} space="scatter" />
      <div className="cr2-e-shade" aria-hidden="true" />
      <div className="cr2-e-copy">
        <p className="cr2-e-label">技術と人で、企業の変革を支える。</p>
        <h1 id="cr2-hero-title" aria-label="0から1の挑戦を、1から100の成長へ。">
          <span className="cr2-e-line">0<img src={growthArrow} alt="" /><strong>1</strong>の挑戦を<span className="cr2-e-punctuation">、</span></span>
          <span className="cr2-e-line">1<img src={growthArrow} alt="" /><strong>100</strong>の成長へ<span className="cr2-e-punctuation">。</span></span>
        </h1>
        <div className="cr2-e-bottom">
          <p className="cr2-e-lead">ITコンサルティングとシステム開発で、企業の挑戦を支える。<br />未経験から技術を仕事にする人も、経験を次の事業へつなぐ人も。<br />一人ひとりの現在地から、成長の続きをつくる。</p>
          <a href="https://incurise.co.jp/about/">私たちを知る<img src={linkArrow} alt="" /></a>
        </div>
      </div>
      <div className="cr2-e-hint" aria-hidden="true">INCUBATE / RISE</div>
    </section>
  );
}

import { GeometricHero } from "./GeometricHero";
import growthArrow from "./assets/preview/growth-arrow.png";
import linkArrow from "./assets/preview/button-arrow-white.png";
import "./adopted-hero.css";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const HERO_REVEAL_START = .3;

/** Approved spatial study E, isolated from the other comparison routes. */
export function AdoptedHero() {
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();
    media.add("(prefers-reduced-motion: no-preference)", () => {
      // The layout/copy retains its approved height, but the outgoing visual
      // must cover tall viewports too. Use pixels so the mask can extend below
      // the layout box without revealing ABOUT at a second, horizontal edge.
      const revealMask = (finished: boolean) => {
        const height = Math.max(hero.offsetHeight, window.innerHeight);
        const upperRight = height * (finished ? -.35 : .35);
        const upperLeft = height * (finished ? -.05 : .65);
        const lowerLeft = height * (finished ? 1.35 : .65);
        const lowerRight = height * (finished ? 1.05 : .35);
        return `polygon(0% 0px,100% 0px,100% ${upperRight}px,0% ${upperLeft}px,0% ${lowerLeft}px,100% ${lowerRight}px,100% ${height}px,0% ${height}px)`;
      };
      // Keep the outgoing surface in view while ABOUT scrolls behind it.
      // No pin spacing: the original hero height is the transition's scroll distance.
      const timeline = gsap.timeline({ scrollTrigger: {
        trigger: hero,
        // Cover the viewport even after the header slides away.
        start: "top top",
        end: () => `+=${hero.offsetHeight}`,
        pin: true, pinSpacing: false, scrub: true,
        invalidateOnRefresh: true,
      } });
      timeline.to(hero.querySelector(".cr2-e-copy"), {
        scale: .92, opacity: 0, ease: "none", duration: .5,
      }, 0);
      timeline.fromTo(hero, {
        clipPath: () => revealMask(false),
      }, {
        clipPath: () => revealMask(true),
        ease: "none", duration: 1 - HERO_REVEAL_START,
      }, HERO_REVEAL_START);
    }, hero);
    return () => media.revert();
  }, []);
  return (
    <div className="cr2-hero-transition">
    <section ref={heroRef} className="cr2-adopted-hero" aria-labelledby="cr2-hero-title">
      <GeometricHero centerShift={-.24} space="scatter" palette="official" />
      <div className="cr2-e-shade" aria-hidden="true" />
      <div className="cr2-e-copy">
        <p className="cr2-e-label">技術と人で、企業の変革を支える。</p>
        <h1 id="cr2-hero-title" aria-label="0から1の挑戦を、1から100の成長へ。">
          <span className="cr2-e-line">0<img src={growthArrow} alt="" /><strong>1</strong>の挑戦を<span className="cr2-e-punctuation">、</span></span>
          <span className="cr2-e-line">1<img src={growthArrow} alt="" /><strong>100</strong>の成長へ<span className="cr2-e-punctuation">。</span></span>
        </h1>
        <div className="cr2-e-bottom">
          <p className="cr2-e-lead"><span><span className="cr2-e-phrase">ITコンサルティングとシステム開発で、</span><span className="cr2-e-phrase">企業の挑戦を支える。</span></span><br /><span><span className="cr2-e-phrase">未経験から技術を身につけ、仕事にする人も。</span><span className="cr2-e-phrase">経験を活かし、次の事業へつなげる人も。</span></span><br /><span>一人ひとりの現在地から、次の可能性をつくる。</span></p>
          <a href="https://incurise.co.jp/about/">私たちを知る<img src={linkArrow} alt="" /></a>
        </div>
      </div>
      <div className="cr2-e-hint" aria-hidden="true">INCUBATE / RISE</div>
    </section>
    </div>
  );
}

# Motion correction, 2026-09-16

User clarification: 「スクロールでファーストビューから次のセクションへ切り替わる演出」.
Additional feedback: 「余白少しありすぎ」「ピンクのモヤは全体ではなく終わるタイミングのことを言っていた」.

Previous attempt is preserved in review-20260916-correction-before/ (three source files).
Git baseline remains 944edaa; existing index.html edit untouched. No push/deploy.
No legacy workflow-state exists; this is a manual correction record, not a fabricated CLI approval.

## Changes

- M2 corrected: pin the single existing hero surface below the header with no
  additional pin spacing. Over the hero's own height of scrolling, fade/scale
  existing copy during the first half; between 30–100% split an eight-vertex
  clipping polygon diagonally into top/bottom portions. ABOUT scrolls underneath
  and becomes fully visible. Reverse scroll reverses the transition. No canvas
  duplication, new assets, copy or initial viewport size changes.
- M3 corrected: remove the full-section gradient. Restore the original SVG blob
  and entrance (0→1 desktop/1.25 mobile, .5s back.out(1.7), intro top45%).
  Its travel now finishes at definitionHeight − .35×viewportHeight, with scrub
  range top55%→bottom65%, keeping the final paragraph within the haze. Clip at
  the ABOUT boundary so CAREER does not inherit it. Same behavior on PC/SP.
- L1: halve previous padding to clamp(32px,4vw,64px).
- Reduced-motion: no hero pin/split; normal document flow remains. Existing
  reduced-motion setup retained; live OS-toggle test not run.

## Verified in local in-app Chromium browser

URL: http://127.0.0.1:5182/incurise-recruit-site/comment-revision/
PC 1512×982: initial hero, scrollY458.5 diagonal opening with hero top88,
scrollY856 completed reveal with ABOUT top82, reverse-to-top, last paragraph.
SP 402×874: initial hero, scrollY429.5 opening, completed ABOUT reveal, last card.
Screenshots retained in task tool outputs. Copy textContent exactly equals the
captured pre-change main DOM. No horizontal overflow, no captured console errors.
Measured last-card-to-section-boundary gaps: PC60.48px, SP32px.
Original blob is visible behind the final paragraph; does not spill into CAREER.
TypeScript/Vite build and git diff --check passed (subsequent CSS-only clip rule
also checked in the live browser). Physical Safari/WebKit not run.

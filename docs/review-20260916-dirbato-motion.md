# Header / hero / ABOUT review — 2026-09-16

Baseline: `944edaa` (original tracked source preserved in Git).
Branch: `codex/recruit-dirbato-motion-20260916`.
Local preview: http://127.0.0.1:5182/incurise-recruit-site/comment-revision/
No publish or push. Existing unrelated `comment-revision/index.html` edit preserved.

## Original request

> 下記サイトのヘッダーのアニメーションを採用して
> ファーストビューの表示切り替えもお願い
> 自信に満ち溢れた〜のところの下のスペースがない
> ここセクションはずっとピンクのモヤがあるようにして
> https://dirbato.co.jp/

## Reference and scope

Dirbato was inspected in the browser and its public animation.js source.
Observed: header hides on downward scroll beyond the hero and returns on upward
scroll; hero copy scales during scrolling; diagonal masking transitions to the
following section. Adopt the directional header and a restrained diagonal hero
wipe, not the reference's long pinned sequence or its copy/assets.
Lazyweb search had no matching Dirbato example; unrelated results were not used.

M1: header translates -102% over .75s, cubic-bezier(.22,1,.36,1), after hero leaves;
upward scroll restores it. Menu-open and visible keyboard focus keep it available.
Reduced-motion CSS keeps the header visible without the transition.

M2: hero scroll progress top/top to bottom/top drives copy scale 1→.9,
y 0→-32, opacity 1→0 and diagonal bottom clipping. No added scroll height;
existing opening composition and particle rendering unchanged. Reduced-motion
skips the GSAP timeline. A pink transition backing prevents an empty white wedge.

M3: replace the disappearing/moving blob with soft radial gradients spanning
the whole ABOUT section, including its end. No timed opacity or offscreen gap.

L1: ABOUT bottom padding clamp(64px,8vw,128px). Measured ~120.95px at 1512
and 64px at 402 between last definition card and next section boundary.

Do not change: all copy, font metrics, particles, card geometry, forms, other sections.

## Verification

- Build: TypeScript + Vite PASS.
- git diff --check: PASS.
- Main DOM textContent equals captured baseline: PASS.
- Browser PC 1512×982: hero initial/intermediate, header downward hidden class and
  upward visible state, ABOUT end gradient and breathing room visually checked.
- Browser SP 402×874: opening fits one viewport, diagonal transition, last Style
  card/end gap, menu opening and Escape closing visually checked.
- Browser tablet 768×1024: ABOUT gradient, two-column definitions, no horizontal overflow.
- Browser narrow SP 320×740: initial hero text/button fit, 680px hero height,
  no horizontal overflow; typography remained unchanged.
- Console errors: none captured during local checks.
- Before/after screenshots are retained in the task tool outputs, not exported PNGs.
- WebKit/physical iPhone Safari and OS reduced-motion live toggle: NOT_RUN.
- Full unrelated form submission tests: NOT_RUN; submission behavior not modified.

The legacy checkout has no .web-workflow/project-state.json. Automated review-start
cannot run without inventing previous approval/build records. This manual log does
not claim workflow CLI approval or QA completion for untested browsers.

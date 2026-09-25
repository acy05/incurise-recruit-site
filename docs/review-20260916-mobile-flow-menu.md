# Responsive selection flow and menu — 2026-09-16

## Manual review scope

User: 「レスポンス版のSELECTION FLOWの部分に少しデザインに違和感」「レスポンス版のメニューを開くときにアニメーションが欲しい」

Local URL: http://127.0.0.1:5182/incurise-recruit-site/comment-revision/
Repo branch: codex/recruit-dirbato-motion-20260916; base HEAD 944edaa with preceding uncommitted work preserved. Before sources: `review-20260916-mobile-flow-menu-before/`. Before screenshot supplied in the user message. This legacy repository has no workflow state file; no fabricated CLI approval/state was introduced.

- R-mobile-01 / LAYOUT / selection flow: remove nested step cards and overlapping connector arrows on responsive widths; connect round outlined numbers with a fine pink line. Vertical below 768px, horizontal at 768–1099px. Preserve four labels and order, PC ≥1100px layout, surrounding sections and all copy.
- R-mobile-02 / MOTION / mobile navigation: make the existing opening clearly perceptible with a top-down panel reveal and staggered rows. Keep menu colors, labels, order and navigation targets. Preserve keyboard/focus behavior; disable closed menu interaction during exit via inert.

## Motion M-menu-01

One existing panel, six rows and one three-line icon, below 1200px. Open: clip-path inset bottom 100%→0 in 520ms, cubic-bezier(.22,1,.36,1); rows translateY(18px)→0 and opacity 0→1 in 340ms, 80ms initial delay +45ms per item. Close: panel 420ms, rows 160/220ms without stagger. Icon transforms to X in 320ms. CSS transitions can reverse on repeated toggles; no timers or additional assets. Reduced-motion removes all these transitions. No video/image generation.

## Evidence and results

- Lazyweb query `vertical steps navigation menu`, desktop, limit 1: moderate coverage (0.457), Square dashboard setup/navigation reference. Adjacent reference only; no reference animation claimed or copied. Final treatment follows this site's existing pink accents and restrained typography. No Growth Report requested or generated.
- Browser screenshots reviewed at 400×842 and 320×740: vertical rail joins circle centers, labels align, text fits, no overlapping arrows. Four steps remain 76px high. Horizontal overflow 0.
- 768×1024 screenshot: four numbered circles connected horizontally, labels below; avoids a tall sparse tablet panel. Overflow 0.
- 1512×982 screenshot: existing four boxed steps with arrows retained; grid columns 277px each; overflow 0. Desktop menu unchanged.
- Menu opening intermediate screenshot showed ABOUT/CAREER first and later items still entering. Final 320px screenshot shows all six items including SUPPORT & BENEFIT without clipping. Panel spans from the 60px header to viewport bottom.
- JOBS item closes the menu and navigates to the correct section. Escape closes it, restores focus to the menu trigger, removes background inert, and leaves the closed menu inert.
- Production TypeScript/Vite build passed; git diff --check passed. Source comparison shows no copy changes: only menu icon markup, per-item animation index and closed-menu inert behavior changed in TSX.
- Browser console errors: checked separately. Physical Safari/WebKit and OS reduced-motion interaction not run; reduced-motion CSS reviewed only. Scope is these two responsive components, not a new whole-site approval.

`site-review` preserved before sources and scoped changes; `visual-qa` guided PC/SP and intermediate-width visual checks. No commit, push or deployment.

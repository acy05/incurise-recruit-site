# Hero lower-edge leak — 2026-09-16

User request: 「切り替えアニメーション中に下の部分が見える」, with screenshot of ABOUT copy visible beneath the outgoing particle surface.

Manual site-review; baseline HEAD 944edaa on codex/recruit-dirbato-motion-20260916 with all preceding dirty changes preserved. Before source copies: `review-20260916-hero-bottom-before/`. User screenshot is the visual Before. Existing legacy workflow has no project-state file; no fabricated workflow approval. Local preview only, no commit/push/deploy.

## Cause and change

The hero layout is 850px on desktop and viewport-minus-header on mobile. Pinning at top 0 therefore exposed content below that shorter box. Preserve the layout/copy dimensions and scroll distance, but extend its outgoing background and shade to max(original height, 100dvh). Use viewport-height pixel coordinates for the diagonal clip polygon, allowing its lower outer edge to extend outside the layout box. Overflow is visible only in normal-motion mode; the clip still constrains the visual. Reduced-motion retains the non-pinned original layout.

No copy, particle settings, menu, selection flow, typography or haze timing changes. Motion scope: hero diagonal transition's visual bounds, PC/SP, forward/reverse; no new media.

## Verification

- 1512×982: at scroll 412.5, hero layout height stays 850 while background bounds are top 0 / bottom 982. Screenshot shows no separate horizontal lower edge or leaked ABOUT copy below it. Intermediate and complete screenshots inspected; haze remains hidden during transition and visible afterward.
- 400×842: layout stays 782; at scroll 387.5 background bottom is exactly 842, haze opacity 0. Intermediate, complete and reverse screenshots inspected; copy is revealed only through the diagonal opening. No extra horizontal lower-edge leak.
- Horizontal overflow 0 at both measured widths. Console errors empty. Production TypeScript/Vite build passed; git diff --check passed.
- Initial copy layout dimensions are unchanged. Physical Safari/WebKit and reduced-motion OS interaction were not run; reduced-motion CSS boundary reviewed.

Lazyweb required preflight: `full screen hero transition`, desktop, limit 1, moderate coverage .504. Returned adjacent loading-animation screenshot, not used as evidence of this site's behavior or copied. The fix is based on measured live bounds and the user's supplied screenshot. site-review guided baseline preservation and scoped PC/SP checks.

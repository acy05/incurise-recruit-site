# Fixed hero / 2026-09-16

Request: 「ファーストビューはスクロールしても動かないようにして。切り替えのアニメーションだけ」

Baseline: HEAD 944edaa plus existing working changes; source snapshots in review-20260916-fixed-hero-before/. No commit, push, or deployment.

Changes: pin begins at the original header-offset position, not after the hero has scrolled to the top. Removed scroll-driven copy scale and opacity tween. Only the diagonal clipping mask progresses. Background extends behind the disappearing header and to the viewport bottom; responsive header CSS variable prevents stale offsets after resizing. Header/haze thresholds use the same pinned range. Existing wording, particle settings and composition retained.

Browser QA: local in-app browser at 1512x982 and 400x842. PC copy top remained 88px at scroll 0, 39.5 and 353.5; mobile copy top remained 60px at scroll 0 and 370.5. Copy opacity 1, transform none. Background covered 0..982 PC and 0..842 mobile. Inspected diagonal mid-transition screenshots, post-transition haze, reverse to top and viewport resizing. No horizontal overflow or console errors. Screenshots retained in task tool outputs. Build and git diff --check passed. Native Safari not tested.

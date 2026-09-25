# M01: shorter hero scroll / 2026-09-16

- Request: 「切り替えまでのスクロールが長い」 (user-request, MOTION, PC/SP).
- Baseline: 944edaab91420bf38e4b89dd5253cb52d218adba plus existing working changes. Exact pre-edit source retained in review-20260916-short-scroll-before/. Legacy project has no workflow state; this is a scoped manual review, not a new approval or publication.
- Scope: scroll distance and aligned header/haze trigger thresholds only. COPY before/after identical. Preserve hero dimensions, fixed position, type, particles and diagonal reveal.
- Change: full range = hero height * 0.55 (45% shorter), reveal starts at 4% rather than 30% of range. ABOUT overlap increases by the same removed distance so the endpoint retains its prior composition. Haze remains hidden until the new endpoint. Reverse scrolling resets the reveal; reduced-motion retains unpinned flow through GSAP matchMedia cleanup.
- Reference: Lazyweb scroll hero transition returned adjacent Origami Scrolling documentation, weak coverage 0.437; not evidence for exact timing. Timing chosen for this user's requested shorter interaction.
- Web QA: PC 1512x982, hero height850, range467.5px (previous850); mask underway at scroll98, copy top88 and haze0. At491 ABOUT visible/haze1. SP400x842, height782, range430.1px (previous782); at168.5 copy top60 and haze0, at454.5 ABOUT visible/haze1. Screenshots in task tool outputs. No horizontal overflow or console errors. Initial composition unchanged; no page copy edits. No native Safari test.
- Result: requested change verified in local browser. Build and diff whitespace checks passed. No commit/push/deployment.

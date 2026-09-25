# Hero / ABOUT motion timing adjustment — 2026-09-16

## User request

「このタイミングで真ん中にモヤが来るようにして
切り替わるアニメーションでヘッダーのアニメーションも初めて」

Scope: local preview only. No publish or Figma changes.
Baseline: branch codex/recruit-dirbato-motion-20260916, HEAD 944edaa,
with existing uncommitted motion work. Pre-edit source copies are in
review-20260916-timing-before/. Existing unrelated changes were retained.

## Changes

- Shared HERO_REVEAL_START (0.3) between the diagonal clip tween and header state.
- Header reads the unpinned transition wrapper, so hide/reveal starts when the
  diagonal opening starts, rather than waiting for the pinned hero to leave.
- Original SVG haze is positioned at viewport center during the ABOUT sequence.
  Its existing entrance and end-of-section travel limit are retained.
- No copy, particle, typography, or spacing changes in this adjustment.

## Verification

- In-app Chromium, PC viewport 1512 × 982: diagonal opening and hidden header
  observed at scrollY 336.5. At scrollY 856, haze center was (748.5, 491),
  matching the usable viewport center. Scrolling upward revealed the header.
- Mobile viewport 402 × 874: diagonal opening and hidden header observed at
  scrollY 292.5. At scrollY 773.5, haze center was (193.5, 437), matching the
  usable viewport center. Scrolling upward revealed the header.
- Mobile horizontal overflow: 0 px. Main text content equals pre-edit baseline.
- No browser console errors observed. npm run build and git diff --check passed.
- Physical iPhone/Safari and OS reduced-motion behavior were not newly tested.
- Public GitHub Pages site was not updated.

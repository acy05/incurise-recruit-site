# Hero transition timing and header gap — 2026-09-16

## User requests

- 「切り替わりのアニメーションが終わってからモヤが出るようにして」
- 「あとこのタイミングのヘッダーの部分の空白をなくして」

## Baseline and scope

Branch: `codex/recruit-dirbato-motion-20260916`, HEAD `944edaa` with existing uncommitted changes preserved. Pre-edit source copies are in `review-20260916-haze-after-transition-before/`. Earlier review logs preserve preceding changes and user screenshots remain in the conversation. This legacy project has no workflow state file; this is a manual scoped site review, not a new design approval or deployment.

## Changes

- Pin the hero at the viewport top, not below the header. Its initial dimensions are unchanged; the header no longer leaves an uncovered strip when hidden.
- Align header hide onset to the same diagonal-reveal progress after the pin offset change.
- Start the existing 0.5-second haze appearance only when the unpinned hero wrapper bottom reaches the viewport top, matching the diagonal timeline end.
- Reset haze on reverse scrolling before that threshold and refresh its state after viewport breakpoint changes.
- Preserve copy, particle settings, typography, blur position and unclipped edge treatment.

## Verification

Local preview only: `http://127.0.0.1:5182/incurise-recruit-site/comment-revision/`.

- Desktop 1512×982: hero height 850, pin start 88, transition end 938. At scroll 628.5 the hero top is 0 and the hidden-header gap is absent. At 933 haze opacity is 0; after crossing 938 haze appears. Reverse to 903.5 resets opacity to 0.
- Mobile 402×874: hero starts at 60 and height is 814 (initial composition unchanged), transition end 874. At scroll 683/693 hero top is 0 and haze opacity is 0. At 947 haze opacity is 1. Reverse scrolling hides haze again.
- Desktop/mobile screenshots inspected for the diagonal reveal, upper edge, completed haze, and initial mobile composition. Breakpoint retest confirms haze stays hidden before completion.
- Horizontal overflow is 0 at tested desktop/mobile widths; browser error log is empty.
- TypeScript/Vite production build and `git diff --check` run after changes.
- Physical Safari/iPhone and OS reduced-motion emulation were not tested this turn.

`site-review` guided source preservation, scoped edits and PC/SP visual verification. Lazyweb quick search was used as required; no unrelated reference styling was introduced. No commit, push or public deployment.

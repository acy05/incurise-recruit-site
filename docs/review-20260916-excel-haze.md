# Excel copy and haze edge review — 2026-09-16

## Request and baseline

User: 「ここはモヤが切られないようにして / エクセルの修正案の文言に修正」

Local URL: http://127.0.0.1:5182/incurise-recruit-site/comment-revision/
Git baseline: 944edaa, branch codex/recruit-dirbato-motion-20260916 plus existing
uncommitted motion changes. This turn's pre-edit sources are preserved in
review-20260916-excel-before/. No unrelated changes reset or overwritten.
The older project has no registered workflow build state; this manual log does
not invent a CLI approval or claim a registered review-close.

## R-copy: DONE, exact source wording

Source: /Users/ajisakacaioyuuki/Downloads/Book1.xlsx, Sheet1.
Read-only Artifact Tool import; original workbook unchanged. Embedded screenshots
were inspected to map each revision to its actual site section. Text boxes contain
editorial reasoning, not additional site content.

| Source | Target | Applied change |
| --- | --- | --- |
| A7:A9 | Hero lead | First sentence retained; following sentences replaced exactly |
| A24:A25 | Confidence | Both body sentences replaced |
| A39:A40 | Integrity | Both body sentences replaced |
| A55:A56 | Hungry | Both body sentences replaced |
| A67 | Proactivity | 出来る → できる in second sentence only |
| A80:A81 | Flexibility | Both body sentences replaced |
| A93:A94 | Style | Both body sentences replaced |

Existing CSS supplies list bullets; the leading Excel 「・」 is not duplicated.
Punctuation is preserved, including rows without final 「。」.
A94 contains 「築くことできる」. An asynchronous question was presented about
adding 「が」; without an answer, exact source wording is retained.
Before/After is recorded by the pre-edit source files and current source diff.
Automated comparison checked all seven groups against the imported cells and
confirmed all other TSX content/motion logic unchanged.

## R-haze: DONE

Cause: overflow:clip on ABOUT cut the SVG blur at the section's top edge; the
hero wrapper's stacking context also covered haze extending above ABOUT.
Allow vertical overflow, clip horizontal overflow, and use an upward-extended
clip path retaining the section's bottom bound. Put the hero's stacking order on
the hero itself instead of its opaque wrapper. Haze size, artwork, central
position, entrance timing, header timing and diagonal split remain unchanged.

Lazyweb preflight: gradient landing page background, desktop, one result.
Returned ConvertKit reference is adjacent, not evidence for this exact motion;
the supplied screenshot/current site was used as the visual baseline.

## Verification

- In-app Chromium: PC 1512 × 982, mobile 402 × 874, narrow 320 × 740,
  intermediate 768 × 1024.
- PC at scrollY 734 before: visible horizontal cut across haze. After at 733.5:
  curved, softly blurred upper edge visible through the diagonal reveal.
- Mobile transition: no horizontal cut. Horizontal overflow was found during
  testing and corrected with overflow-x:clip / overflow-y:visible; final 0 px.
- PC and mobile first viewport and all six revised IKETERU entries visually
  inspected. No font-size/spacing/card-layout changes. Tablet resize settles to
  correct full width; narrow hero text wraps within its available width.
- Reverse scrolling restores hero/header. Mobile CAREER boundary remains clean.
- npm run build, git diff --check, exact source-copy assertions passed.
- Final console error check: none. No intake/form submissions performed.
- WebKit, physical Safari and live OS reduced-motion switching: NOT_RUN.
- Public website, Figma frames and the source workbook: not modified.

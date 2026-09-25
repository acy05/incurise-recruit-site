# Recruit submission review — 2026-09-25

## Scope

- Connect the `comment-revision` application form to the existing secure Contact Form 7 submission client.
- Configure the WordPress mail recipient specification as `hp_sales-bounces@isaac-inc.co.jp`.
- Preserve the existing validation, confirmation dialog, PDF constraints, and unsaved-form warning.

## Baseline

- Git baseline: `944edaa` on `codex/recruit-dirbato-motion-20260916`.
- The working tree already contained unrelated responsive, motion, copy, and documentation edits. Those changes were preserved.
- Before this review, `src/CommentRevisionApp.tsx` stopped at a disabled preview-only submit button. The reusable client in `src/recruitSubmission.ts` and the primary preview route already supported configured submission.

## Changes

- Reused `parseRecruitEndpoint`, `submitRecruitApplication`, and the CF7 field mapping in the comment-revision form.
- Added Turnstile, sending, success, server-validation, spam, mail, network, and retry states.
- Reset the form only after a `mail_sent` response.
- Kept submission disabled when the endpoint or Turnstile site key is absent.
- Updated `docs/recruit-cf7-setup.md` so the Contact Form 7 mail recipient is `hp_sales-bounces@isaac-inc.co.jp`.
- Added a configured-flow Playwright case for the comment-revision route.

## Verification

- `npm run build`: PASS.
- `git diff --check`: PASS.
- Local in-app browser DOM check: PASS; the comment-revision form shows the new non-storage/confirmation notice and retains all required controls.
- Live read-only WordPress REST check: Contact Form 7 is installed, but form ID `42` returns `wpcf7_not_found`.
- GitHub repository variables: no configured `VITE_RECRUIT_WPCF7_ENDPOINT` or `VITE_RECRUIT_TURNSTILE_SITE_KEY` was observed.
- `npm run test:e2e` (re-run before Git push): INCOMPLETE/FAIL; the 320px About test timed out after the browser session closed, the next test was interrupted, and 78 did not run.
- `npm run test:e2e:configured` (re-run before Git push): INCOMPLETE/FAIL; the first configured form test timed out while filling an already-resolved phone input, the comment-revision test was interrupted during page evaluation, and 5 did not run.
- No real applicant data was submitted and no live mail delivery was attempted.

## Activation blockers

1. Create the dedicated Contact Form 7 form and set its mail recipient to `hp_sales-bounces@isaac-inc.co.jp`.
2. Configure Cloudflare Turnstile for the published recruitment-site origin.
3. Set `VITE_RECRUIT_WPCF7_ENDPOINT` and `VITE_RECRUIT_TURNSTILE_SITE_KEY` as repository variables.
4. Verify a test message and all PDF attachments arrive at the destination mailbox.

## Result metadata

- `selected_route: minimal`
- `fallback_route: null`
- `escalated_to: null`
- `blocked_due_to_routing: false`
- `result: UNVERIFIED_PROVISIONAL`
- `unmet_gate: live WordPress form, Turnstile, repository variables, and destination-mailbox receipt verification`
- `incomplete_verification: configured browser test could not complete under current host load`
- `quality_not_verified: end-to-end live delivery is not proven`

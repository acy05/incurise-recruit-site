/** Eight-spoke brand ornament, independent of system fonts and emoji rendering.
 * The width matches the previous desktop glyph advance to preserve marquee spacing.
 */
export function AsteriskMark() {
  return <svg
    viewBox="0 0 24 24"
    width=".742em"
    height=".742em"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    aria-hidden="true"
    focusable="false"
    style={{ display: "inline-block", verticalAlign: "-.04em" }}
  >
    <path d="M12 1v22M1 12h22M4.22 4.22l15.56 15.56M4.22 19.78L19.78 4.22" />
  </svg>;
}

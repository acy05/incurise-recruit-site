# ISAAC motion system

The motion language expresses one idea: an unclear conversation gathers into a useful form.

## Fluid motion

- **Hero field:** SVG metaballs merge behind the headline. A ScrollTrigger scrub moves and enlarges the field as the hero leaves the viewport, so it appears to flow toward the story below.
- **Approach field:** a quieter, contained form marks the point where ideas become a production system.
- **Statement and contact:** the compact form returns as a recognition cue. It stays behind copy and never blocks controls.
- **Timing:** independent 8–11 second organic cycles; hero scroll scrub `0.8`; no abrupt loop boundary.
- **Reduced motion:** orbit transforms stop and the composed mark remains visible as a static identity element.

## Typography motion

- **Hero:** lines enter through clipping masks with 1.05 second `power4.out` motion and 90 ms line delay.
- **Section headlines:** reveal by moving the clipping edge rather than using an opacity-only fade.
- **Reduced motion:** all text is present immediately with no clipping or transform.

## Spatial motion

- **Hero:** the fluid field responds to scroll position while text stays stable.
- **Work samples:** desktop uses controlled lateral drift tied to vertical scroll. Small screens keep a direct horizontal composition without scripted translation.
- **Timing:** spatial movement is scroll-linked; discrete reveals use 0.95 second `power3.out`.
- **Motion control:** the persistent control pauses CSS motion and removes entrance transforms. Browser `prefers-reduced-motion` applies the same safe state by default.

## Interaction rules

- Motion must explain hierarchy, transition, response, or progression.
- Hover movement stays below 4% scale and never shifts surrounding layout.
- Form, navigation, FAQ and email actions remain usable with motion disabled.
- Anchor navigation measures the final layout position before scrolling and lands the section label 32 px from the viewport top.

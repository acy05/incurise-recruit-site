import { useEffect, type RefObject } from "react";

// offsetTop follows layout, so an entrance transform never moves the destination.
function layoutTop(element: HTMLElement) {
  let top = 0;
  for (let node: HTMLElement | null = element; node; node = node.offsetParent as HTMLElement | null) {
    top += node.offsetTop;
  }
  return top;
}

export function useSampleNavigation(root: RefObject<HTMLElement>) {
  useEffect(() => {
    const container = root.current!;
    let request = 0;
    const frame = () => new Promise<void>(resolve => requestAnimationFrame(() => resolve()));
    const navigate = async (hash: string, initial = false) => {
      const current = ++request;
      let id: string;
      try { id = decodeURIComponent(hash.slice(1)); } catch { return; }
      const section = document.getElementById(id);
      if (!section || !container.contains(section)) return;
      // Let React close a menu/dialog and restore body scrolling before measuring.
      await frame();
      await frame();
      await document.fonts.ready;
      const panels = container.querySelectorAll<HTMLElement>(".ss-disclosure-panel");
      await Promise.all(Array.from(panels).flatMap(panel => panel.getAnimations())
        .map(animation => animation.finished.catch(() => undefined)));
      if (current !== request) return;

      const anchor = section.querySelector<HTMLElement>("[data-scroll-anchor]") ?? section;
      const header = container.querySelector<HTMLElement>(".ss-header");
      const top = id === "top" ? 0 : layoutTop(anchor) - (header?.offsetHeight ?? 0) - 24;
      const motion = container.dataset.motion !== "off" && !matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!initial && location.hash !== hash) history.pushState(null, "", hash);
      if (!section.hasAttribute("tabindex")) section.tabIndex = -1;
      section.focus({ preventScroll: true });
      window.scrollTo({ top: Math.max(0, top), behavior: initial || !motion ? "instant" : "smooth" });
    };
    const click = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element).closest<HTMLAnchorElement>("a[href]");
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const url = new URL(link.href);
      if (!url.hash || url.origin !== location.origin || url.pathname !== location.pathname || url.search !== location.search) return;
      event.preventDefault();
      void navigate(url.hash);
    };
    const hashChange = () => { if (location.hash) void navigate(location.hash, true); };
    // User input cancels a destination still waiting on layout or font loading.
    const cancel = () => { request++; };
    container.addEventListener("click", click);
    window.addEventListener("hashchange", hashChange);
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    if (location.hash) void navigate(location.hash, true);
    return () => {
      request++;
      container.removeEventListener("click", click);
      window.removeEventListener("hashchange", hashChange);
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
    };
  }, [root]);
}

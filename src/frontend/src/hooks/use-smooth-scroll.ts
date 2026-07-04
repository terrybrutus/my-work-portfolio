import { useCallback } from "react";

/**
 * Smooth-scrolls to a section by id, accounting for the sticky header height.
 * Falls back to default behavior if smooth scroll is unavailable.
 */
export function useSmoothScroll() {
  return useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const header = document.querySelector("[data-header]");
    const headerHeight = header ? header.getBoundingClientRect().height : 0;
    const top =
      el.getBoundingClientRect().top + window.scrollY - headerHeight - 8;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);
}

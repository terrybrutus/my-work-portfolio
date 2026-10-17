import {cleanup, renderHook} from "@testing-library/react";
import {afterEach, expect, it, vi} from "vitest";
import {usePageScrollLock} from "../hooks/usePageScrollLock";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("locks mobile background scrolling and restores the original page position", () => {
  const scrollTo = vi.fn();
  vi.stubGlobal("scrollTo", scrollTo);
  vi.stubGlobal("scrollY", 420);
  const hook = renderHook(() => usePageScrollLock(true));
  expect(document.body.style.position).toBe("fixed");
  expect(document.body.style.top).toBe("-420px");
  hook.unmount();
  expect(document.body.style.position).toBe("");
  expect(document.body.style.top).toBe("");
  expect(scrollTo).toHaveBeenCalledWith({top: 420, left: 0, behavior: "instant"});
});

it("keeps the page locked until the last modal closes", () => {
  vi.stubGlobal("scrollTo", vi.fn());
  const first = renderHook(() => usePageScrollLock(true));
  const second = renderHook(() => usePageScrollLock(true));
  first.unmount();
  expect(document.body.style.position).toBe("fixed");
  second.unmount();
  expect(document.body.style.position).toBe("");
});

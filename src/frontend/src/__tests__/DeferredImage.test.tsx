import "@testing-library/jest-dom/vitest";
import {act, cleanup, render, screen} from "@testing-library/react";
import {afterEach, expect, it, vi} from "vitest";
import {DeferredImage} from "../components/DeferredImage";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

it("does not request a preview until it approaches the viewport", () => {
  let notify: IntersectionObserverCallback = () => {};
  const disconnect = vi.fn();
  const observe = vi.fn();
  const Observer = vi.fn(function (callback: IntersectionObserverCallback, options: IntersectionObserverInit) {
    notify = callback;
    expect(options.rootMargin).toBe("200px");
    return {observe, disconnect};
  });
  vi.stubGlobal("IntersectionObserver", Observer);
  const view = render(<DeferredImage src="/sample.gif" alt="Project preview" />);
  const image = screen.getByAltText("Project preview");
  expect(image).not.toHaveAttribute("src");
  expect(observe).toHaveBeenCalledWith(image);
  act(() => notify([{isIntersecting: false}] as IntersectionObserverEntry[], {} as IntersectionObserver));
  expect(image).not.toHaveAttribute("src");
  act(() => notify([{isIntersecting: true}] as IntersectionObserverEntry[], {} as IntersectionObserver));
  expect(image).toHaveAttribute("src", "/sample.gif");
  expect(image).toHaveAttribute("decoding", "async");
  expect(disconnect).toHaveBeenCalled();
  view.rerender(<DeferredImage src="/updated.gif" alt="Project preview" />);
  expect(image).toHaveAttribute("src", "/updated.gif");
});

it("falls back to native lazy loading when observers are unavailable", () => {
  render(<DeferredImage src="/fallback.gif" alt="Fallback" />);
  expect(screen.getByAltText("Fallback")).toHaveAttribute("src", "/fallback.gif");
  expect(screen.getByAltText("Fallback")).toHaveAttribute("loading", "lazy");
});

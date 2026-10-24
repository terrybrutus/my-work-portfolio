import "@testing-library/jest-dom/vitest";
import {act, cleanup, fireEvent, render, screen} from "@testing-library/react";
import {afterEach, expect, it, vi} from "vitest";
import {LoadingImage} from "../components/LoadingImage";

afterEach(() => {cleanup(); vi.useRealTimers();});

it("offers recovery when a download stalls without raising an error", () => {
  vi.useFakeTimers();
  render(<LoadingImage src="/slow.gif" alt="Slow preview" />);
  act(() => vi.advanceTimersByTime(15000));
  expect(screen.getByRole("status")).toHaveTextContent("taking longer to load");
  fireEvent.click(screen.getByRole("button", {name: "Try again"}));
  expect(screen.getByRole("status")).toHaveTextContent("Loading image");
});

it("shows progress until an image loads, including after its source changes", () => {
  const view = render(<LoadingImage src="/one.gif" alt="Game preview" />);
  expect(screen.getByRole("status")).toHaveTextContent("Loading image");
  fireEvent.load(screen.getByAltText("Game preview"));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
  view.rerender(<LoadingImage src="/two.gif" alt="Game preview" />);
  expect(screen.getByRole("status")).toBeInTheDocument();
  fireEvent.load(screen.getByAltText("Game preview"));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

it("offers a real retry after failure without discarding the image URL", () => {
  render(<LoadingImage src="/page.png" alt="Sample" loadingLabel="document page" />);
  const original = screen.getByAltText("Sample");
  fireEvent.error(original);
  expect(screen.getByRole("status")).toHaveTextContent("This document page could not load.");
  fireEvent.click(screen.getByRole("button", {name: "Try again"}));
  expect(screen.getByAltText("Sample")).not.toBe(original);
  expect(screen.getByAltText("Sample")).toHaveAttribute("src", "/page.png");
  fireEvent.load(screen.getByAltText("Sample"));
  expect(screen.queryByRole("status")).not.toBeInTheDocument();
});

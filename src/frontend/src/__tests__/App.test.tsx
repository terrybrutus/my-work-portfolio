import "@testing-library/jest-dom/vitest";
import { cleanup, configure, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../App";

configure({ testIdAttribute: "data-ocid" });

afterEach(() => {
  cleanup();
  window.history.pushState({}, "", "/");
});

vi.mock("../hooks/useQueries", () => ({
  useCallerUserRole: () => ({ data: null, isFetching: false }),
}));

describe("App default route", () => {
  it("renders the TerryLXD portfolio instead of a blank screen", () => {
    render(<App />);
    expect(
      screen.getByText(/I build scalable learning systems/i),
    ).toBeInTheDocument();
  });

  it("renders portfolio navigation and work section", () => {
    render(<App />);
    expect(screen.getByText("TerryLXD")).toBeInTheDocument();
    expect(screen.getByText("AI & The Future of Work")).toBeInTheDocument();
  });

  it("renders the expanded admin page editor", () => {
    window.history.pushState({}, "", "/admin");
    render(<App />);
    expect(screen.getByText("Pages & Sections")).toBeInTheDocument();
    expect(
      screen.getByText("Edit the About Me TV carousel"),
    ).toBeInTheDocument();
  });
});

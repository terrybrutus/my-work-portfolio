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
      screen.getByText(/I turn complex work into learning experiences/i),
    ).toBeInTheDocument();
  });

  it("renders portfolio navigation and work section", () => {
    render(<App />);
    expect(screen.getByText("TerryLXD")).toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: "Admin" }),
    ).not.toBeInTheDocument();
    expect(screen.getByText("AI & The Future of Work")).toBeInTheDocument();
  });

  it("renders the expanded admin page editor", () => {
    window.history.pushState({}, "", "/admin");
    render(<App />);
    expect(screen.getByText("Homepage copy")).toBeInTheDocument();
    expect(screen.queryByText("Pages & Sections")).not.toBeInTheDocument();
    expect(
      screen.getByText("Edit the About Me TV carousel"),
    ).toBeInTheDocument();
  });

  it("renders the first-party ADDIE project page", () => {
    window.history.pushState({}, "", "/work/addie-model-from-start-to-finish");
    render(<App />);
    expect(
      screen.getByRole("heading", { name: "ADDIE Model From Start to Finish" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /A full instructional design process example for CON 7020/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "View CON 7020 course context" }),
    ).toHaveAttribute("href", "https://icatalog.waru.edu/CourseDetail/12795");
  });
});

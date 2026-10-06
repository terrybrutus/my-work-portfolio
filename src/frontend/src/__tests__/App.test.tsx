import "@testing-library/jest-dom/vitest";
import { cleanup, configure, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../App";

configure({ testIdAttribute: "data-ocid" });

afterEach(() => {
  cleanup();
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
    expect(
      screen.getByText("Defense Workforce Learning Architecture"),
    ).toBeInTheDocument();
  });
});

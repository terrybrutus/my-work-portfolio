import "@testing-library/jest-dom/vitest";
import { cleanup, configure, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import App from "../App";

// The generated app marks its empty-state placeholder with data-ocid.
configure({ testIdAttribute: "data-ocid" });

afterEach(() => {
  cleanup();
});

vi.mock("../hooks/useQueries", () => ({
  useCallerUserRole: () => ({ data: null, isFetching: false }),
}));

describe("App default route", () => {
  it("renders a plain empty placeholder instead of a blank screen", () => {
    render(<App />);
    // The page must not be blank: the empty-state placeholder is present.
    expect(screen.getByTestId("empty_state")).toBeInTheDocument();
  });

  it("renders a single plain placeholder with no features or navigation", () => {
    render(<App />);
    const placeholder = screen.getByTestId("empty_state");
    // The placeholder is plain: no links, buttons, inputs, or navigation.
    expect(placeholder.querySelector("a, button, input, nav")).toBeNull();
    // It is a single placeholder, not a featureful page.
    expect(screen.getAllByTestId("empty_state")).toHaveLength(1);
  });
});

import "@testing-library/jest-dom/vitest";
import { cleanup, configure, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";

configure({ testIdAttribute: "data-ocid" });

beforeEach(() => {
  window.localStorage.clear();
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
  });
});

afterEach(() => {
  cleanup();
  window.history.pushState({}, "", "/");
  vi.unstubAllGlobals();
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

  it("returns to the matching carousel slide and keeps its image separate from the project page", () => {
    window.localStorage.setItem("terry-lxd-portfolio-draft-v4", JSON.stringify({
      projects: [
        { title: "Other project", slug: "other", summary: "Other", result: "Other", tags: [] },
        {
          title: "Review sample", slug: "review-sample", summary: "Summary", result: "Outcome", tags: [],
          url: "/work/review-sample", image: "/page-image.png", carouselImage: "/carousel-image.gif",
        },
      ],
    }));
    window.history.pushState({}, "", "/work/review-sample");
    const page = render(<App />);
    expect(document.querySelector(".project-detail-media img")).toHaveAttribute("src", "/page-image.png");
    const returnHref = screen.getByRole("link", { name: "Back to selected work" }).getAttribute("href")!;
    expect(returnHref).toBe("/?work=review-sample#work");
    page.unmount();

    window.history.pushState({}, "", returnHref);
    render(<App />);
    expect(screen.getByRole("dialog", { name: "Review sample" })).toBeInTheDocument();
    expect(screen.getByText(/Work 02/)).toBeInTheDocument();
    expect(document.querySelector(".project-modal-media img")).toHaveAttribute("src", "/carousel-image.gif");
    expect(within(screen.getByRole("dialog")).getByRole("link", { name: "Open project" })).toHaveAttribute("href", "/work/review-sample");
    fireEvent.click(screen.getByRole("button", { name: "Close", exact: true }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.location.search).toBe("");
  });

  it("saves an uploaded carousel image without replacing the project page image", async () => {
    window.localStorage.setItem("terry-lxd-portfolio-draft-v4", JSON.stringify({
      projects: [{title: "Upload sample", summary: "Summary", result: "Outcome", tags: [], image: "/page-image.png"}],
    }));
    window.history.pushState({}, "", "/admin");
    render(<App />);
    fireEvent.change(screen.getByLabelText("Upload carousel image for Upload sample"), {
      target: { files: [new File(["GIF89a"], "carousel.gif", { type: "image/gif" })] },
    });
    await waitFor(() => {
      const saved = JSON.parse(window.localStorage.getItem("terry-lxd-portfolio-draft-v4")!);
      expect(saved.projects[0].carouselImage).toMatch(/^data:image\/gif;base64,/);
      expect(saved.projects[0].image).toBe("/page-image.png");
    });
    expect(screen.getByAltText("Carousel preview for Upload sample")).toHaveAttribute("src", expect.stringMatching(/^data:image\/gif;base64,/));
  });
});

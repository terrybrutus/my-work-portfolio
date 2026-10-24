import "@testing-library/jest-dom/vitest";
import { cleanup, configure, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "../App";

configure({ testIdAttribute: "data-ocid" });

beforeEach(() => {
  window.localStorage.clear();
  vi.stubGlobal("scrollTo", vi.fn());
  vi.stubGlobal("ResizeObserver", class {
    observe() {}
    disconnect() {}
  });
});

afterEach(() => {
  cleanup();
  window.history.pushState({}, "", "/");
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

vi.mock("../hooks/useQueries", () => ({
  useCallerUserRole: () => ({ data: null, isFetching: false }),
}));

vi.mock("../content/portfolio.json", () => ({ default: {} }));

describe("App default route", () => {
  it("supports project swipes while preserving buttons, vertical scroll, pinch and browser edges", () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", {name: "View details"})[0]);
    const dialog = screen.getByRole("dialog");
    const shell = dialog.querySelector(".project-modal-shell")!;
    const firstTitle = within(dialog).getByRole("heading").textContent;
    const touch = (x: number, y: number) => ({identifier: 1, clientX: x, clientY: y});
    const swipe = (x: number, y: number, endX: number, endY: number) => {
      fireEvent.touchStart(shell, {touches: [touch(x, y)]});
      fireEvent.touchMove(shell, {touches: [touch(endX, endY)]});
      fireEvent.touchEnd(shell, {touches: [], changedTouches: [touch(endX, endY)]});
    };
    swipe(200, 200, 100, 205);
    expect(within(dialog).getByRole("heading").textContent).not.toBe(firstTitle);
    swipe(100, 200, 200, 205);
    expect(within(dialog).getByRole("heading")).toHaveTextContent(firstTitle!);
    swipe(200, 200, 180, 300);
    swipe(10, 200, 100, 200);
    fireEvent.touchStart(shell, {touches: [touch(100, 200), {...touch(200, 200), identifier: 2}]});
    fireEvent.touchEnd(shell, {touches: [], changedTouches: [touch(200, 200)]});
    expect(within(dialog).getByRole("heading")).toHaveTextContent(firstTitle!);
    fireEvent.click(within(dialog).getByRole("button", {name: "Next"}));
    expect(within(dialog).getByRole("heading").textContent).not.toBe(firstTitle);
    fireEvent.click(within(dialog).getByRole("button", {name: "Prev"}));
    expect(within(dialog).getByRole("heading")).toHaveTextContent(firstTitle!);
  });
  it("keeps coming-soon work unlinked and offers signup only on Worduel", () => {
    window.localStorage.setItem("terry-lxd-portfolio-draft-v4", JSON.stringify({projects: [
      {title: "Released game", summary: "Play now", result: "A playable game", tags: [], url: "/common-thread/"},
      {title: "Worduel", slug: "worduel", summary: "Vocabulary practice", result: "Prototype", tags: [], status: "coming-soon", launchSignup: true, url: "/should-not-open/"},
    ]}));
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", {name: "View details"})[0]);
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).queryByRole("button", {name: "Notify me when it launches"})).not.toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", {name: "Next"}));
    expect(within(dialog).queryByRole("link", {name: "Open project"})).not.toBeInTheDocument();
    fireEvent.click(within(dialog).getByRole("button", {name: "Notify me when it launches"}));
    expect(screen.getByRole("dialog", {name: "Try Worduel when it launches"})).toBeInTheDocument();
    fireEvent.keyDown(window, {key: "ArrowRight"});
    expect(within(dialog).getByRole("heading", {name: "Worduel"})).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", {name: "Close signup"}));
    expect(within(dialog).getByRole("heading", {name: "Worduel"})).toBeInTheDocument();
  });
  it("removes the startup indicator as soon as the app mounts without waiting for images", () => {
    const startup = document.createElement("div");
    startup.id = "portfolio-startup";
    document.body.append(startup);
    render(<App />);
    expect(startup.isConnected).toBe(false);
    expect(screen.getByRole("heading", {level: 1})).toBeInTheDocument();
  });
  it("makes Contact open email when the contact section is hidden", () => {
    window.localStorage.setItem("terry-lxd-portfolio-draft-v4", JSON.stringify({sections: [{id: "work", visible: true, label: "Work"}]}));
    render(<App />);
    expect(screen.getByRole("link", {name: "Contact"})).toHaveAttribute("href", "mailto:terrbrutus@gmail.com");
  });

  it("opens the bundled playable project in the existing tab", () => {
    render(<App />);
    const game = screen.getAllByRole("link", {name: "Open project"}).find(link => link.getAttribute("href") === "/enablement/");
    expect(game).not.toHaveAttribute("target");
    fireEvent.click(screen.getAllByRole("button", {name: "View details"})[0]);
    expect(within(screen.getByRole("dialog")).getByRole("link", {name: "Open project"})).not.toHaveAttribute("target");
  });

  it("opens branded Common Thread links in the existing tab", () => {
    window.localStorage.setItem("terry-lxd-portfolio-draft-v4", JSON.stringify({projects: [
      {title: "Common Thread", slug: "common-thread", summary: "A word game", result: "Learn through play", tags: [], url: "/common-thread/"},
    ]}));
    render(<App />);
    expect(screen.getByRole("link", {name: "Open project"})).not.toHaveAttribute("target");
    fireEvent.click(screen.getByRole("button", {name: "View details"}));
    expect(within(screen.getByRole("dialog")).getByRole("link", {name: "Open project"})).not.toHaveAttribute("target");
  });

  it("uses branded course URLs in the work carousel, including older saved Netlify links", () => {
    window.localStorage.setItem("terry-lxd-portfolio-draft-v4", JSON.stringify({projects: [
      {title: "AI & The Future of Work", summary: "AI course", result: "AI result", tags: [], url: "https://terrybrutus-aiandthefuture-sample.netlify.app/"},
      {title: "Why Blockchain Actually Matters", summary: "Blockchain course", result: "Blockchain result", tags: [], url: "https://whyblockchainmatters-by-terrybrutus.netlify.app/"},
      {title: "Don't Get Hooked: A Course on Phishing", summary: "Phishing course", result: "Phishing result", tags: [], url: "https://phishingcourse-by-terrybrutus.netlify.app/story.html"},
    ]}));
    render(<App />);
    fireEvent.click(screen.getAllByRole("button", {name: "View details"})[0]);
    const dialog = screen.getByRole("dialog");
    for (const href of ["/ai-future-of-work/", "/blockchain/", "/phishing/"]) {
      expect(within(dialog).getByRole("link", {name: "Open project"})).toHaveAttribute("href", href);
      fireEvent.click(within(dialog).getByRole("button", {name: "Next"}));
    }
  });

  it("does not expose the local admin or browser drafts in production", () => {
    vi.stubEnv("DEV", false);
    window.history.pushState({}, "", "/admin");
    window.localStorage.setItem("terry-lxd-portfolio-draft-v4", JSON.stringify({headline: "Browser-only changes"}));
    render(<App />);
    expect(screen.queryByText("Portfolio Admin Studio")).not.toBeInTheDocument();
    expect(screen.queryByText("Browser-only changes")).not.toBeInTheDocument();
    expect(screen.getByRole("heading", {level: 1})).toHaveTextContent("I turn complex work");
    fireEvent(window, new StorageEvent("storage", {key: "terry-lxd-portfolio-draft-v4", newValue: JSON.stringify({headline: "Unsaved replacement", projects: [], aboutImages: []})}));
    expect(screen.getByRole("heading", {level: 1})).toHaveTextContent("I turn complex work");
  });
  it("keeps About outside transformed page containers and exposes the complete story", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("link", {name: "About me"}));
    const dialog = screen.getByRole("dialog");
    expect(dialog.parentElement).toBe(document.body);
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(within(dialog).getByRole("button", {name: "Show Beyond The Work"}));
    expect(dialog.querySelector(".about-slide-transcript p")?.textContent).toContain("Ole Miss");
    fireEvent.click(within(dialog).getByRole("button", {name: /^Close$/}));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(document.body.style.overflow).not.toBe("hidden");
  });
  it("keeps About navigation outside the scrollable content and cycles through every item", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("link", {name: "About me"}));
    const dialog = screen.getByRole("dialog");
    const footer = dialog.querySelector(".about-modal-navigation")!;
    expect(dialog.querySelector(".about-modal-content")?.contains(footer)).toBe(false);
    expect(document.body.style.position).toBe("fixed");
    const titles = ["How I Got Here", "Beyond The Work", "What I Pay Attention To", "How I Got Here"];
    for (const title of titles) {
      expect(within(dialog).getByRole("heading", {name: title})).toBeInTheDocument();
      fireEvent.click(within(dialog).getByRole("button", {name: "Next"}));
    }
  });
  it("swipes About left and right and wraps at both ends", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("link", {name: "About me"}));
    const dialog = screen.getByRole("dialog");
    const content = dialog.querySelector(".about-modal-content")!;
    const swipe = (from: number, to: number) => {
      fireEvent.touchStart(content, {touches: [{identifier: 1, clientX: from, clientY: 200}]});
      fireEvent.touchEnd(content, {touches: [], changedTouches: [{identifier: 1, clientX: to, clientY: 205}]});
    };
    swipe(280, 80);
    expect(within(dialog).getByRole("heading", {name: "Beyond The Work"})).toBeInTheDocument();
    swipe(80, 280);
    expect(within(dialog).getByRole("heading", {name: "How I Got Here"})).toBeInTheDocument();
    swipe(80, 280);
    expect(within(dialog).getByRole("heading", {name: "What I Pay Attention To"})).toBeInTheDocument();
    swipe(280, 80);
    expect(within(dialog).getByRole("heading", {name: "How I Got Here"})).toBeInTheDocument();
  });

  it("does not change About slides during a vertical scroll or a small touch movement", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("link", {name: "About me"}));
    const dialog = screen.getByRole("dialog");
    const content = dialog.querySelector(".about-modal-content")!;
    fireEvent.touchStart(content, {touches: [{identifier: 1, clientX: 200, clientY: 200}]});
    fireEvent.touchMove(content, {touches: [{identifier: 1, clientX: 195, clientY: 150}]});
    fireEvent.touchEnd(content, {touches: [], changedTouches: [{identifier: 1, clientX: 80, clientY: 190}]});
    expect(within(dialog).getByRole("heading", {name: "How I Got Here"})).toBeInTheDocument();
    fireEvent.touchStart(content, {touches: [{identifier: 1, clientX: 200, clientY: 200}]});
    fireEvent.touchEnd(content, {touches: [], changedTouches: [{identifier: 1, clientX: 180, clientY: 200}]});
    expect(within(dialog).getByRole("heading", {name: "How I Got Here"})).toBeInTheDocument();
  });

  it("ignores pinching and canceled About gestures", () => {
    render(<App />);
    fireEvent.click(screen.getByRole("link", {name: "About me"}));
    const dialog = screen.getByRole("dialog");
    const content = dialog.querySelector(".about-modal-content")!;
    const finger = {identifier: 1, clientX: 280, clientY: 200};
    fireEvent.touchStart(content, {touches: [finger]});
    fireEvent.touchMove(content, {touches: [finger, {identifier: 2, clientX: 100, clientY: 200}]});
    fireEvent.touchEnd(content, {touches: [], changedTouches: [{...finger, clientX: 80}]});
    expect(within(dialog).getByRole("heading", {name: "How I Got Here"})).toBeInTheDocument();
    fireEvent.touchStart(content, {touches: [finger]});
    fireEvent.touchCancel(content);
    fireEvent.touchEnd(content, {touches: [], changedTouches: [{...finger, clientX: 80}]});
    expect(within(dialog).getByRole("heading", {name: "How I Got Here"})).toBeInTheDocument();
  });

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

  it.each(["job-aid-template-system", "facilitator-guide-adaptation", "quality-assurance-review-system"])("embeds the real document on %s", (slug) => {
    window.history.pushState({}, "", `/work/${slug}`);
    render(<App />);
    expect(screen.getByRole("link", {name: "Open original PDF"})).toHaveAttribute("href", expect.stringMatching(/^\/assets\/documents\/.+\.pdf$/));
    expect(screen.getByRole("img", {name: /page 1/})).toHaveAttribute("src", expect.stringMatching(/^\/assets\/documents\/.+-page-1\.png$/));
    expect(screen.getByRole("link", {name: "Back to selected work"})).toHaveAttribute("href", `/?work=${slug}#work`);
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
    fireEvent.click(screen.getByRole("button", { name: /^Close$/ }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(window.location.search).toBe("");
  });

  it("saves an uploaded carousel image without replacing the project page image", async () => {
    window.localStorage.setItem("terry-lxd-portfolio-draft-v4", JSON.stringify({
      projects: [{title: "Upload sample", summary: "Summary", result: "Outcome", tags: [], image: "/page-image.png"}],
    }));
    window.history.pushState({}, "", "/admin");
    const saveRequest = vi.fn(async (_url, options) => {
      if (options?.method !== "POST") return {ok: false};
      expect(options.body).toBeInstanceOf(File);
      return {ok: true, headers: {get: () => "application/json"}, json: async () => ({savedAt: "2026-10-15T20:00:00Z", image: "/assets/uploads/automatic.gif"})};
    });
    vi.stubGlobal("fetch", saveRequest);
    const editor = render(<App />);
    fireEvent.change(screen.getByLabelText("Upload carousel image for Upload sample"), {
      target: { files: [new File(["GIF89a"], "carousel.gif", { type: "image/gif" })] },
    });
    await waitFor(() => {
      const saved = JSON.parse(window.localStorage.getItem("terry-lxd-portfolio-draft-v4")!);
      expect(saved.projects[0].carouselImage).toBe("/assets/uploads/automatic.gif");
      expect(saved.projects[0].image).toBe("/page-image.png");
    });
    expect(saveRequest.mock.calls.filter(([, options]) => options?.method === "POST")).toHaveLength(1);
    editor.unmount();
    render(<App />);
    expect(screen.getByAltText("Carousel preview for Upload sample")).toHaveAttribute("src", "/assets/uploads/automatic.gif");
  });

  it("confirms a project-file save and replaces the temporary image with the returned asset path", async () => {
    window.localStorage.setItem("terry-lxd-portfolio-draft-v4", JSON.stringify({
      projects: [{title: "Save sample", summary: "Summary", result: "Outcome", tags: [], image: "/page.png", carouselImage: "data:image/gif;base64,R0lGODlh"}],
    }));
    const saveRequest = vi.fn(async (_url, options) => {
      const content = JSON.parse(options.body);
      content.projects[0].carouselImage = "/assets/uploads/saved.gif";
      return { ok: true, headers: {get: () => "application/json"}, json: async () => ({ savedAt: "2026-10-14T19:00:00Z", content }) };
    });
    vi.stubGlobal("fetch", saveRequest);
    window.history.pushState({}, "", "/admin");
    render(<App />);
    fireEvent.click(screen.getByRole("button", {name: "Save carousel image"}));
    await waitFor(() => expect(screen.getByAltText("Carousel preview for Save sample")).toHaveAttribute("src", "/assets/uploads/saved.gif"));
    expect(saveRequest).toHaveBeenCalledWith("/__portfolio/save", expect.objectContaining({method: "POST"}));
    expect(screen.getAllByRole("status").some((status) => status.textContent?.includes("Text and settings saved"))).toBe(true);
    expect(JSON.parse(window.localStorage.getItem("terry-lxd-portfolio-draft-v4")!).projects[0].image).toBe("/page.png");
  });

  it("updates an already-open portfolio when another tab saves a carousel image", () => {
    window.history.pushState({}, "", "/admin");
    const editor = render(<App />);
    const content = JSON.parse(window.localStorage.getItem("terry-lxd-portfolio-draft-v4")!);
    editor.unmount();
    window.history.pushState({}, "", "/");
    render(<App />);
    content.projects[0].carouselImage = "/assets/uploads/new-image.png";
    fireEvent(window, new StorageEvent("storage", {key: "terry-lxd-portfolio-draft-v4", newValue: JSON.stringify(content)}));
    fireEvent.click(screen.getAllByRole("button", {name: "View details"})[0]);
    expect(document.querySelector(".project-modal-media img")).toHaveAttribute("src", "/assets/uploads/new-image.png");
  });

  it("does not let a stale tab overwrite an uploaded image in the editor", () => {
    const key = "terry-lxd-portfolio-draft-v4";
    window.localStorage.setItem(key, JSON.stringify({projects: [{title: "Keep image", summary: "Summary", result: "Result", tags: [], carouselImage: "/my-image.gif"}]}));
    window.history.pushState({}, "", "/admin");
    render(<App />);
    fireEvent(window, new StorageEvent("storage", {key, newValue: JSON.stringify({aboutImages: [], projects: [{title: "Keep image", tags: [], carouselImage: ""}]})}));
    expect(screen.getByAltText("Carousel preview for Keep image")).toHaveAttribute("src", "/my-image.gif");
  });

  it("never writes public-page state back over the admin draft", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem");
    render(<App />);
    expect(setItem.mock.calls.filter(([key]) => key === "terry-lxd-portfolio-draft-v4")).toHaveLength(0);
    setItem.mockRestore();
  });

  it("opens the modal with the disk image when a browser draft or imported bundle is stale", async () => {
    window.history.pushState({}, "", "/admin");
    const editor = render(<App />);
    const disk = JSON.parse(window.localStorage.getItem("terry-lxd-portfolio-draft-v4")!);
    editor.unmount();
    disk.projects[0].carouselImage = "/assets/uploads/from-disk.gif";
    vi.stubGlobal("fetch", vi.fn(async () => ({ok: true, headers: {get: () => "application/json"}, json: async () => ({savedAt: "2026-10-17T20:00:00Z", content: disk})})));
    window.history.pushState({}, "", "/?work=enablement-quest-the-learning-systems-lab#work");
    render(<App />);
    await waitFor(() => expect(document.querySelector(".project-modal-media img")).toHaveAttribute("src", "/assets/uploads/from-disk.gif"));
  });

  it("retains an uploaded file when automatic saving fails so it can be retried", async () => {
    window.localStorage.setItem("terry-lxd-portfolio-draft-v4", JSON.stringify({projects: [{title: "Retry upload", summary: "Summary", result: "Result", tags: [], carouselImage: "/keep-existing.gif"}]}));
    vi.stubGlobal("fetch", vi.fn(async () => {throw new Error("Connection interrupted");}));
    window.history.pushState({}, "", "/admin");
    render(<App />);
    fireEvent.change(screen.getByLabelText("Upload carousel image for Retry upload"), {target: {files: [new File(["GIF89a"], "keep.gif", {type: "image/gif"})]}});
    await waitFor(() => expect(screen.getByRole("button", {name: "Retry upload"})).toBeEnabled());
    expect(screen.getByAltText("Carousel preview for Retry upload")).toHaveAttribute("src", "/keep-existing.gif");
  });

  it("does not claim success when Save is clicked after an image was rejected", () => {
    window.localStorage.setItem("terry-lxd-portfolio-draft-v4", JSON.stringify({projects: [{title: "Rejected", summary: "Summary", result: "Result", tags: [], carouselImage: "/keep.gif"}]}));
    const request = vi.fn(async (_url: string) => ({ok: false}));
    vi.stubGlobal("fetch", request);
    window.history.pushState({}, "", "/admin");
    render(<App />);
    fireEvent.change(screen.getByLabelText("Upload carousel image for Rejected"), {target: {files: [new File([], "empty.gif", {type: "image/gif"})]}});
    fireEvent.click(screen.getByRole("button", {name: "Save carousel image"}));
    expect(screen.getAllByRole("status").some(status => status.textContent?.includes("An image has not uploaded"))).toBe(true);
    expect(request.mock.calls.filter(([url]) => url === "/__portfolio/save")).toHaveLength(0);
    expect(screen.getByAltText("Carousel preview for Rejected")).toHaveAttribute("src", "/keep.gif");
  });

  it("writes the uploaded image to disk even when the browser draft exceeds its quota", async () => {
    window.localStorage.setItem("terry-lxd-portfolio-draft-v4", JSON.stringify({projects: [{title: "Large upload", summary: "Summary", result: "Result", tags: []}]}));
    window.history.pushState({}, "", "/admin");
    render(<App />);
    const original = Storage.prototype.setItem;
    const storage = vi.spyOn(Storage.prototype, "setItem").mockImplementation(function (this: Storage, key, value) {
      if (value.includes("data:image/")) throw new DOMException("Quota exceeded", "QuotaExceededError");
      return original.call(this, key, value);
    });
    const warning = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal("fetch", vi.fn(async (_url, options) => {
      if (options?.method !== "POST") return {ok: false};
      expect(options.body).toBeInstanceOf(File);
      return {ok: true, headers: {get: () => "application/json"}, json: async () => ({savedAt: "2026-10-15T20:00:00Z", image: "/assets/uploads/large.gif"})};
    }));
    try {
      fireEvent.change(screen.getByLabelText("Upload carousel image for Large upload"), {target: {files: [new File(["GIF89a"], "large.gif", {type: "image/gif"})]}});
      await waitFor(() => expect(screen.getByAltText("Carousel preview for Large upload")).toHaveAttribute("src", "/assets/uploads/large.gif"));
      expect(JSON.parse(window.localStorage.getItem("terry-lxd-portfolio-draft-v4")!).projects[0].carouselImage).toBe("/assets/uploads/large.gif");
    } finally {
      storage.mockRestore();
      warning.mockRestore();
    }
  });

  it("shows a write failure and keeps the uploaded image available to retry", async () => {
    window.localStorage.setItem("terry-lxd-portfolio-draft-v4", JSON.stringify({
      projects: [{title: "Retry sample", summary: "Summary", result: "Outcome", tags: [], carouselImage: "data:image/gif;base64,R0lGODlh"}],
    }));
    vi.stubGlobal("fetch", vi.fn(async () => ({ ok: false, headers: {get: () => "application/json"}, json: async () => ({ error: "Disk is full" }) })));
    window.history.pushState({}, "", "/admin");
    render(<App />);
    fireEvent.click(screen.getByRole("button", {name: "Save carousel image"}));
    await waitFor(() => expect(screen.getAllByRole("status").some((status) => status.textContent?.includes("Save failed: Disk is full"))).toBe(true));
    expect(screen.getByAltText("Carousel preview for Retry sample")).toHaveAttribute("src", "data:image/gif;base64,R0lGODlh");
    expect(screen.getByRole("button", {name: "Save carousel image"})).toBeEnabled();
  });
});

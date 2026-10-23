import "@testing-library/jest-dom/vitest";
import {cleanup, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {afterEach, describe, expect, it, vi} from "vitest";
import {WorduelLaunchSignup} from "../components/WorduelLaunchSignup";

afterEach(() => { cleanup(); vi.unstubAllGlobals(); vi.unstubAllEnvs(); });

function openSignup() {
  render(<WorduelLaunchSignup />);
  fireEvent.click(screen.getByRole("button", {name: "Notify me when it launches"}));
  fireEvent.change(screen.getByLabelText("Email address"), {target: {value: "launch-test@example.com"}});
  fireEvent.click(screen.getByRole("checkbox"));
}

describe("Worduel launch signup", () => {
  it("requires email and explicit one-time consent, and restores focus on closing", () => {
    openSignup();
    expect(screen.getByLabelText("Email address")).toBeRequired();
    expect(screen.getByRole("checkbox")).toBeRequired();
    expect(screen.getByLabelText("Email address")).toHaveFocus();
    fireEvent.keyDown(screen.getByRole("dialog"), {key: "Escape"});
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByRole("button", {name: "Notify me when it launches"})).toHaveFocus();
  });

  it("submits to Netlify and confirms only a successful response", async () => {
    vi.stubEnv("DEV", false);
    const fetch = vi.fn().mockResolvedValue({ok: true});
    vi.stubGlobal("fetch", fetch);
    openSignup();
    fireEvent.submit(screen.getByRole("button", {name: /^Notify me$/}).closest("form")!);
    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("You're on the list"));
    expect(fetch).toHaveBeenCalledWith("/worduel-notify/", expect.objectContaining({method: "POST", body: expect.stringContaining("form-name=worduel-launch")}));
    expect(fetch.mock.calls[0][1].body).toContain("consent=yes");
  });

  it("keeps the email and allows retry after a failed submission", async () => {
    vi.stubEnv("DEV", false);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ok: false}));
    openSignup();
    fireEvent.submit(screen.getByRole("button", {name: /^Notify me$/}).closest("form")!);
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("wasn't confirmed"));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toHaveValue("launch-test@example.com");
    expect(screen.getByRole("button", {name: /^Notify me$/})).toBeEnabled();
  });

  it("does not pretend the development server stores a signup", async () => {
    vi.stubEnv("DEV", true);
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    openSignup();
    fireEvent.submit(screen.getByRole("button", {name: /^Notify me$/}).closest("form")!);
    expect(screen.getByRole("alert")).toHaveTextContent("local preview hasn't sent");
    expect(fetch).not.toHaveBeenCalled();
  });
});

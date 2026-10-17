import "@testing-library/jest-dom/vitest";
import {cleanup, fireEvent, render, screen, waitFor} from "@testing-library/react";
import {afterEach, expect, it, vi} from "vitest";
import {ImageUpload, type ImageTarget} from "../components/ImageUpload";

afterEach(() => {cleanup(); vi.unstubAllGlobals();});
const targets: ImageTarget[] = [
  {kind: "profile"}, {kind: "logo"}, ...[0, 1, 2].map(index => ({kind: "about" as const, index})),
  {kind: "project", project: "one", field: "image"}, {kind: "project", project: "one", field: "carouselImage"},
];

it.each(targets)("sends a binary image directly to the correct destination: %j", async (target) => {
  const file = new File(["GIF89a"], "my-animation.gif", {type: "image/gif"});
  const saved = vi.fn();
  const fetchImage = vi.fn(async () => ({ok: true, headers: {get: () => "application/json"}, json: async () => ({image: "/assets/uploads/image.gif", savedAt: "new-revision"})}));
  vi.stubGlobal("fetch", fetchImage);
  render(<ImageUpload label="Choose image" target={target} onSaved={saved} onPendingChange={() => {}} />);
  fireEvent.change(screen.getByLabelText("Choose image", {selector: "input"}), {target: {files: [file]}});
  await waitFor(() => expect(saved).toHaveBeenCalledWith("/assets/uploads/image.gif", "new-revision", undefined));
  const [url, request] = fetchImage.mock.calls[0] as unknown as [string, RequestInit];
  expect(JSON.parse(new URL(url, "http://localhost").searchParams.get("target")!)).toEqual(target);
  expect(request.body).toBe(file);
  expect(screen.getByRole("status")).toHaveTextContent("Saved my-animation.gif to project files");
});

it("retains the exact file and destination across a failed upload and retry", async () => {
  const file = new File(["GIF89a"], "keep.gif", {type: "image/gif"});
  const saved = vi.fn();
  const send = vi.fn().mockRejectedValueOnce(new Error("Offline")).mockResolvedValueOnce({ok: true, headers: {get: () => "application/json"}, json: async () => ({image: "/assets/uploads/retry.gif", savedAt: "retry"})});
  vi.stubGlobal("fetch", send);
  render(<ImageUpload label="Choose image" target={{kind: "project", project: "sample", field: "carouselImage"}} onSaved={saved} onPendingChange={() => {}} />);
  fireEvent.change(screen.getByLabelText("Choose image", {selector: "input"}), {target: {files: [file]}});
  await screen.findByRole("button", {name: "Retry upload"});
  expect(saved).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", {name: "Retry upload"}));
  await waitFor(() => expect(saved).toHaveBeenCalled());
  expect(send.mock.calls[0][1].body).toBe(file);
  expect(send.mock.calls[1][1].body).toBe(file);
  expect(send.mock.calls[0][0]).toBe(send.mock.calls[1][0]);
});

it("does not replace an image when the server rejects the file", async () => {
  const saved = vi.fn();
  vi.stubGlobal("fetch", vi.fn(async () => ({ok: false, headers: {get: () => "application/json"}, json: async () => ({error: "Disk full"})})));
  render(<ImageUpload label="Choose image" target={{kind: "logo"}} onSaved={saved} onPendingChange={() => {}} />);
  fireEvent.change(screen.getByLabelText("Choose image", {selector: "input"}), {target: {files: [new File(["png"], "logo.png", {type: "image/png"})]}});
  await screen.findByRole("button", {name: "Retry upload"});
  expect(screen.getByRole("status")).toHaveTextContent("Your existing image is unchanged");
  expect(saved).not.toHaveBeenCalled();
});

import { useRef, useState } from "react";

export type ImageTarget =
  | { kind: "project"; project: string; field: "image" | "carouselImage" }
  | { kind: "about"; index: number }
  | { kind: "profile" | "logo" };

const imageTypes: Record<string, string> = {png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp", avif: "image/avif", svg: "image/svg+xml"};

export function ImageUpload({ label, target, currentImage, onSaved, onPendingChange }: {
  label: string;
  target: ImageTarget;
  currentImage?: string;
  onSaved: (image: string, savedAt: string, content?: unknown) => void;
  onPendingChange: (change: number) => void;
}) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);
  const retainedFile = useRef<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploading = useRef(false);

  const upload = async (file: File) => {
    if (uploading.current) return;
    retainedFile.current = file;
    const type = file.type || imageTypes[file.name.split(".").pop()?.toLowerCase() ?? ""];
    if (!Object.values(imageTypes).includes(type) || !file.size || file.size > 40 * 1024 * 1024) {
      setStatus("Choose a nonempty PNG, JPG, GIF, WebP, AVIF, or SVG image up to 40 MB. Your existing image has not changed.");
      setFailed(false);
      return;
    }
    uploading.current = true;
    setBusy(true);
    setFailed(false);
    onPendingChange(1);
    setStatus(`Saving ${file.name} to project files...`);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 60000);
    try {
      const response = await fetch(`/__portfolio/image?target=${encodeURIComponent(JSON.stringify(target))}`, {
        method: "POST", headers: {"Content-Type": type}, body: file, signal: controller.signal,
      });
      if (!response.headers.get("content-type")?.includes("application/json")) throw new Error("Image saving is available in the local admin at http://127.0.0.1:44120/admin.");
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The image could not be saved.");
      if (!result.image?.startsWith("/assets/uploads/") || !result.savedAt) throw new Error("The server did not confirm an image file.");
      onSaved(result.image, result.savedAt, result.content);
      setStatus(`Saved ${file.name} to project files. You can preview it or reload this page.`);
      retainedFile.current = null;
    } catch (error) {
      setFailed(true);
      setStatus(`Upload failed: ${error instanceof Error ? error.message : "Connection interrupted."} Your existing image is unchanged. Retry uses the same selected file.`);
    } finally {
      window.clearTimeout(timeout);
      uploading.current = false;
      setBusy(false);
      onPendingChange(-1);
    }
  };

  return <div className="mt-3">
    <input ref={inputRef} aria-label={label} className="sr-only" type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/avif,image/svg+xml,.svg" disabled={busy} onChange={(event) => {
      const file = event.target.files?.[0];
      if (file) void upload(file);
      event.target.value = "";
    }} />
    <button className="admin-button" type="button" disabled={busy} onClick={() => inputRef.current?.click()} aria-label={label.replace(/^Upload/, "Choose")}>
      {busy ? "Saving image..." : currentImage ? "Replace image" : "Choose image"}
    </button>
    {currentImage ? <p className="mt-2 text-xs text-white/70">{currentImage.startsWith("/assets/uploads/") ? "Current image is saved in your project files." : "An image is currently assigned."}</p> : null}
    {status ? <p role="status" className="mt-2 text-sm text-white/80">{status}</p> : null}
    {failed ? <button type="button" className="admin-button mt-2" disabled={busy} onClick={() => retainedFile.current && void upload(retainedFile.current)}>Retry upload</button> : null}
  </div>;
}

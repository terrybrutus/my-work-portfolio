import { useRef, useState } from "react";

export type ImageTarget =
  | { kind: "project"; project: string; field: "image" | "carouselImage" }
  | { kind: "about"; index: number }
  | { kind: "profile" | "logo" };

export function ImageUpload({ label, target, currentImage, onSaved, onPendingChange, onUploadStatus }: {
  label: string;
  target: ImageTarget;
  currentImage?: string;
  onSaved: (image: string, savedAt: string, content?: unknown) => void;
  onPendingChange: (change: number) => void;
  onUploadStatus?: (state: "saving" | "saved" | "failed", message: string) => void;
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
    if (!file.size || file.size > 256 * 1024 * 1024) {
      const message = !file.size ? `${file.name} contains 0 bytes. Please check that the file has finished downloading.` : `${file.name} is ${(file.size / 1024 / 1024).toFixed(1)} MB. The upload limit is 256 MB.`;
      setStatus(message);
      setFailed(true);
      onUploadStatus?.("failed", message);
      return;
    }
    uploading.current = true;
    setBusy(true);
    setFailed(false);
    onPendingChange(1);
    setStatus(`Saving ${file.name} to project files...`);
    onUploadStatus?.("saving", `Uploading ${file.name}...`);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 60000);
    try {
      const response = await fetch(`/__portfolio/image?target=${encodeURIComponent(JSON.stringify(target))}`, {
        method: "POST", headers: {"Content-Type": "application/octet-stream"}, body: file, signal: controller.signal,
      });
      if (!response.headers.get("content-type")?.includes("application/json")) throw new Error("Image saving is available in the local admin at http://127.0.0.1:44120/admin.");
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The image could not be saved.");
      if (!result.image?.startsWith("/assets/uploads/") || !result.savedAt) throw new Error("The server did not confirm an image file.");
      onSaved(result.image, result.savedAt, result.content);
      setStatus(`Saved ${file.name} to project files. You can preview it or reload this page.`);
      onUploadStatus?.("saved", `${file.name} saved. It is now available in your local portfolio.`);
      retainedFile.current = null;
    } catch (error) {
      setFailed(true);
      const message = `Could not upload ${file.name} (${(file.size / 1024 / 1024).toFixed(1)} MB): ${error instanceof Error ? error.message : "Connection interrupted."} Your existing image is unchanged. Retry uses the same selected file.`;
      setStatus(message);
      onUploadStatus?.("failed", message);
    } finally {
      window.clearTimeout(timeout);
      uploading.current = false;
      setBusy(false);
      onPendingChange(-1);
    }
  };

  return <div className="mt-3">
    <input ref={inputRef} aria-label={label} className="sr-only" type="file" accept="image/*,.svg,.gif,.png,.jpg,.jpeg,.webp,.avif,.bmp,.ico" disabled={busy} onChange={(event) => {
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

// @vitest-environment node
import {mkdir, mkdtemp, rm, writeFile} from "node:fs/promises";
import {tmpdir} from "node:os";
import path from "node:path";
import {expect, it} from "vitest";
import {verifyGifAssets} from "../../../../scripts/verify-gif-assets.mjs";

it("verifies nested GIF copies without changing any uploaded bytes", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "gif-quality-"));
  try {
    const source = path.join(root, "source");
    const output = path.join(root, "output");
    const original = Buffer.from("GIF89a-original-upload");
    for (const directory of [source, output]) {
      await mkdir(path.join(directory, "projects"), {recursive: true});
      await writeFile(path.join(directory, "projects", "preview.GIF"), original);
      await writeFile(path.join(directory, "preview.gif"), original);
    }
    expect(await verifyGifAssets(source, output)).toBe(2);
    await writeFile(path.join(output, "projects", "preview.GIF"), "GIF89a-reencoded");
    await expect(verifyGifAssets(source, output)).rejects.toThrow("GIF differs from original");
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});

it("rejects a missing deployment GIF", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "gif-quality-"));
  try {
    const source = path.join(root, "source");
    const output = path.join(root, "output");
    await mkdir(source);
    await mkdir(output);
    await writeFile(path.join(source, "preview.gif"), "GIF89a-original-upload");
    await expect(verifyGifAssets(source, output)).rejects.toThrow();
  } finally {
    await rm(root, {recursive: true, force: true});
  }
});

import {readdir, readFile, stat, writeFile} from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(process.argv[2] ?? "src/frontend/dist");
async function optimize(directory) {
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) { await optimize(file); continue; }
    if (!entry.name.endsWith(".gif") || (await stat(file)).size < 4_000_000) continue;
    const source = await readFile(file);
    const before = await sharp(source, {animated: true, limitInputPixels: false}).metadata();
    let result = await sharp(source, {animated: true, limitInputPixels: false})
      .resize({width: 640, withoutEnlargement: true})
      .gif({colours: 128, effort: 5, dither: 0, keepDuplicateFrames: true})
      .toBuffer();
    if (result.length > 8_000_000) {
      result = await sharp(source, {animated: true, limitInputPixels: false})
        .resize({width: 480, withoutEnlargement: true})
        .gif({colours: 64, effort: 5, dither: 0, keepDuplicateFrames: true})
        .toBuffer();
    }
    const after = await sharp(result, {animated: true, limitInputPixels: false}).metadata();
    if (before.pages !== after.pages || before.loop !== after.loop || JSON.stringify(before.delay) !== JSON.stringify(after.delay)) {
      throw new Error(`Animation timing changed: ${entry.name}`);
    }
    if (result.length < source.length) {
      await writeFile(file, result);
      console.log(`${entry.name}: ${source.length} -> ${result.length} bytes; ${after.pages} frames retained`);
    }
  }
}
await optimize(root);

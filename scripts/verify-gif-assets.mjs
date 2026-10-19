import {readdir, readFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

export async function verifyGifAssets(sourceRoot, deploymentRoot) {
  let count = 0;
  async function verify(directory) {
    for (const entry of await readdir(directory, {withFileTypes: true})) {
      const sourcePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await verify(sourcePath);
        continue;
      }
      if (!entry.name.toLowerCase().endsWith(".gif")) continue;
      const relativePath = path.relative(sourceRoot, sourcePath);
      const original = await readFile(sourcePath);
      const deployed = await readFile(path.join(deploymentRoot, relativePath));
      if (!original.equals(deployed)) {
        throw new Error(`GIF differs from original: ${relativePath}. Rebuild without image conversion.`);
      }
      count++;
    }
  }
  await verify(sourceRoot);
  return count;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const sourceRoot = fileURLToPath(new URL("../src/frontend/public/", import.meta.url));
  const deploymentRoot = path.resolve(process.argv[2] ?? fileURLToPath(new URL("../src/frontend/dist/", import.meta.url)));
  const count = await verifyGifAssets(sourceRoot, deploymentRoot);
  console.log(`Verified ${count} GIFs: deployment copies match originals byte-for-byte.`);
}

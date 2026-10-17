import {copyFile, mkdir, readdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const source = process.argv[2];
if (!source) throw new Error("Pass the directory containing the verified Enablement Quest production build.");
const publicRoot = fileURLToPath(new URL("../src/frontend/public/", import.meta.url));
const assetPrefix = "/assets/enablement-game/";
const copyAssets = async (directory, relative = "") => {
  for (const entry of await readdir(directory, {withFileTypes: true})) {
    const next = path.join(relative, entry.name);
    const target = path.join(publicRoot, "assets/enablement-game", next);
    if (entry.isDirectory()) await copyAssets(path.join(directory, entry.name), next);
    else {
      await mkdir(path.dirname(target), {recursive: true});
      if (/\.(js|css|json)$/.test(entry.name)) {
        const text = await readFile(path.join(directory, entry.name), "utf8");
        await writeFile(target, text.replaceAll("/assets/", assetPrefix));
      } else await copyFile(path.join(directory, entry.name), target);
    }
  }
};
await copyAssets(path.join(source, "assets"));
await mkdir(path.join(publicRoot, "enablement"), {recursive: true});
const html = await readFile(path.join(source, "index.html"), "utf8");
await writeFile(path.join(publicRoot, "enablement/index.html"), html.replaceAll("/assets/", assetPrefix));
console.log("Packaged Enablement Quest at /enablement/ with isolated assets.");

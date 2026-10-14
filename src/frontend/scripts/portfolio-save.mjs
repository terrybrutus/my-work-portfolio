import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const extensions = { "image/png": "png", "image/jpeg": "jpg", "image/gif": "gif", "image/webp": "webp", "image/avif": "avif", "image/svg+xml": "svg" };

export async function writePortfolio(root, input) {
  if (!input || typeof input !== "object" || !Array.isArray(input.projects) || !Array.isArray(input.aboutImages)) {
    throw new Error("The portfolio content is incomplete. Nothing was saved.");
  }
  const content = structuredClone(input);
  const assetsDirectory = path.join(root, "public/assets/uploads");
  const storeImage = async (value) => {
    if (typeof value !== "string" || !value.startsWith("data:")) return value;
    const match = /^data:(image\/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/.exec(value);
    if (!match || !extensions[match[1]]) throw new Error("Unsupported image. Use PNG, JPG, GIF, WebP, AVIF, or SVG.");
    const bytes = Buffer.from(match[2], "base64");
    if (!bytes.length) throw new Error("An image is empty. Nothing was saved.");
    const name = `${createHash("sha256").update(bytes).digest("hex")}.${extensions[match[1]]}`;
    await mkdir(assetsDirectory, { recursive: true });
    await writeFile(path.join(assetsDirectory, name), bytes);
    return `/assets/uploads/${name}`;
  };
  for (const key of ["profileImage", "brandLogoImage"]) content[key] = await storeImage(content[key]);
  content.aboutImages = await Promise.all(content.aboutImages.map(storeImage));
  for (const project of content.projects) {
    for (const key of ["image", "carouselImage"]) {
      if (project[key] !== undefined) project[key] = await storeImage(project[key]);
    }
  }
  const saved = { savedAt: new Date().toISOString(), content };
  const directory = path.join(root, "src/content");
  await mkdir(directory, { recursive: true });
  const target = path.join(directory, "portfolio.json");
  const temporary = `${target}.${randomUUID()}.tmp`;
  await writeFile(temporary, `${JSON.stringify(saved, null, 2)}\n`);
  await rename(temporary, target);
  return saved;
}

export function portfolioSavePlugin() {
  return {
    name: "portfolio-save",
    apply: "serve",
    configureServer(server) {
      // Serve newly written assets immediately, before Vite's file watcher catches up.
      server.middlewares.use("/assets/uploads", async (request, response, next) => {
        const filename = new URL(request.url, "http://localhost").pathname.slice(1);
        if (!["GET", "HEAD"].includes(request.method) || !/^[a-f0-9]{64}\.(png|jpg|gif|webp|avif|svg)$/.test(filename)) return next();
        try {
          const bytes = await readFile(path.join(server.config.root, "public/assets/uploads", filename));
          const extension = filename.split(".").pop();
          response.setHeader("Content-Type", Object.entries(extensions).find(([, value]) => value === extension)[0]);
          response.setHeader("Cache-Control", "public, max-age=31536000, immutable");
          response.end(request.method === "HEAD" ? undefined : bytes);
        } catch {
          next();
        }
      });
      server.middlewares.use("/__portfolio/save", async (request, response) => {
        response.setHeader("Content-Type", "application/json");
        response.setHeader("Cache-Control", "no-store");
        try {
          const origin = request.headers.origin;
          const host = request.headers.host;
          if (request.method !== "POST" || !request.headers["content-type"]?.startsWith("application/json") || (origin && origin !== `http://${host}`)) {
            response.statusCode = 403;
            response.end(JSON.stringify({ error: "Save requests must come from this local admin page." }));
            return;
          }
          let size = 0;
          const chunks = [];
          for await (const chunk of request) {
            size += chunk.length;
            if (size > 40 * 1024 * 1024) throw new Error("Upload is too large. Save fewer images at a time (40 MB maximum).");
            chunks.push(chunk);
          }
          const content = JSON.parse(Buffer.concat(chunks).toString("utf8"));
          response.end(JSON.stringify(await writePortfolio(server.config.root, content)));
        } catch (error) {
          response.statusCode = 400;
          response.end(JSON.stringify({ error: error.message ?? "Could not write the portfolio files." }));
        }
      });
    },
  };
}

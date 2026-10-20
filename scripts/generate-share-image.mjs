import {fileURLToPath} from "node:url";
import sharp from "sharp";

const source = fileURLToPath(new URL("../src/frontend/public/assets/social/portfolio-share.svg", import.meta.url));
const target = fileURLToPath(new URL("../src/frontend/public/assets/social/portfolio-share-v1.png", import.meta.url));
await sharp(source).png({compressionLevel: 9}).toFile(target);
console.log("Generated portfolio share image: 1200 x 630 PNG.");

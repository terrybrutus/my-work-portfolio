import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
export default defineConfig({
  root:fileURLToPath(new URL(".",import.meta.url)),
  base:"/stylebook/demo/",
  plugins:[react()],
  resolve:{alias:{"@":fileURLToPath(new URL("./src",import.meta.url))}},
  build:{outDir:"../public/stylebook/demo",emptyOutDir:true},
});

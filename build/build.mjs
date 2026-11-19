// Builds the public copy of the app into ../dist.
// The source in this (private) repo stays readable; dist/ contains only minified files
// that the browser needs to run the app, plus a public README.
//
// Usage: npm install && npm run build
import { minify } from "terser";
import {
  readFile,
  writeFile,
  mkdir,
  copyFile,
  rm,
  readdir,
} from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");

await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });

// 1. index.html: minify the inline script and strip comments and extra whitespace in markup.
let html = await readFile(join(root, "index.html"), "utf8");
const scriptStart = html.indexOf("<script>");
const scriptEnd = html.indexOf("</script>");
const inline = html.slice(scriptStart + "<script>".length, scriptEnd);
const { code } = await minify(inline, {
  compress: { passes: 2 },
  mangle: { toplevel: true },
  format: { comments: false },
});
html = html.slice(0, scriptStart) + "<script>" + code + html.slice(scriptEnd);
html = html
  .replace(/<!--[\s\S]*?-->/g, "")
  .replace(/>\s+</g, "><")
  .replace(/\n\s*/g, "\n")
  .trim();
await writeFile(join(out, "index.html"), html);

// 2. Service worker
const sw = await readFile(join(root, "sw.js"), "utf8");
const swMin = await minify(sw, {
  compress: { passes: 2 },
  mangle: true,
  format: { comments: false },
});
await writeFile(join(out, "sw.js"), swMin.code);

// 3. Static assets
await copyFile(join(root, "manifest.json"), join(out, "manifest.json"));
await copyFile(join(root, "icon.svg"), join(out, "icon.svg"));

// 4. Menus: combine menus/*.json into one file in wheel order, for the app and for offline use.
const menuDir = join(root, "menus");
const menuFiles = (await readdir(menuDir)).filter((f) => f.endsWith(".json"));
const menus = [];
for (const f of menuFiles) {
  menus.push(JSON.parse(await readFile(join(menuDir, f), "utf8")));
}
menus.sort((a, b) => a.order - b.order);
const menuJson = JSON.stringify({ festivals: menus }, null, 2);
await writeFile(join(root, "menus.json"), menuJson + "\n");
await writeFile(join(out, "menus.json"), menuJson);

// 5. Public README (written for users, not for development)
await copyFile(join(root, "build", "public-README.md"), join(out, "README.md"));

console.log("Built public copy in", out);

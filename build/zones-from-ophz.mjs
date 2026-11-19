// Adds a USDA hardiness zone to each ZIP in data/us-zips.json.
// Source: Open Plant Hardiness Zones (OPHZ-B, WGS84 GeoJSON), derived from the public-domain
// USDA map (https://github.com/wboykinm/ophz, PDDL license). Not the official USDA map.
// Usage: node build/zones-from-ophz.mjs /path/to/ophz-b-wgs84.geojson
import { readFile, writeFile } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const geojsonPath = process.argv[2];
if (!geojsonPath) throw new Error("Pass the path to ophz-b-wgs84.geojson");

const geo = JSON.parse(await readFile(geojsonPath, "utf8"));
const features = geo.features
  .filter((f) => f.properties.zone && f.properties.zone !== "Water")
  .map((f) => {
    const polys =
      f.geometry.type === "Polygon"
        ? [f.geometry.coordinates]
        : f.geometry.coordinates;
    const bbox = [Infinity, Infinity, -Infinity, -Infinity];
    for (const poly of polys)
      for (const [x, y] of poly[0]) {
        bbox[0] = Math.min(bbox[0], x);
        bbox[1] = Math.min(bbox[1], y);
        bbox[2] = Math.max(bbox[2], x);
        bbox[3] = Math.max(bbox[3], y);
      }
    return { zone: f.properties.zone, polys, bbox };
  });

function inRing(x, y, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi)
      inside = !inside;
  }
  return inside;
}

function zoneAt(x, y) {
  for (const f of features) {
    if (x < f.bbox[0] || x > f.bbox[2] || y < f.bbox[1] || y > f.bbox[3])
      continue;
    for (const poly of f.polys) {
      if (!inRing(x, y, poly[0])) continue;
      if (poly.slice(1).some((hole) => inRing(x, y, hole))) continue;
      return f.zone;
    }
  }
  return null;
}

const usZipsPath = join(root, "data", "us-zips.json");
const table = JSON.parse(await readFile(usZipsPath, "utf8"));
let found = 0;
for (const [zip, row] of Object.entries(table.zips)) {
  const zone = zoneAt(row[1], row[0]);
  if (zone) found++;
  row[5] = zone;
}
table.fields = [
  "lat",
  "lon",
  "city",
  "state",
  "timezone index (see timezones)",
  "usda zone (OPHZ-derived, null if not mapped)",
];
table.zone_source =
  "USDA Plant Hardiness Zone Map, via Open Plant Hardiness Zones (OPHZ-B). Derived data; not the official USDA map. Covers the 48 contiguous states only.";
await writeFile(usZipsPath, JSON.stringify(table));
console.log(
  `zones assigned to ${found} of ${Object.keys(table.zips).length} ZIPs`,
);

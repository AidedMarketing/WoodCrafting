// Project thumbnails are rendered from the same geometry as the interactive viewer.
import * as THREE from "three";
import sharp from "sharp";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { stagePositions, stageIndices } from "../src/geometry.js";
await mkdir("public/models", { recursive: true });
for (const [id, stage] of [
  ["egg", 3],
  ["mushroom", 6],
]) {
  const positions = stagePositions(stage, id);
  const indices = stageIndices();
  const camera = new THREE.PerspectiveCamera(35, 700 / 450, 0.1, 100);
  camera.position.set(4, 2.5, 7);
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();
  const triangles = [];
  const base = new THREE.Color("#c5a47b");
  const light = new THREE.Vector3(-3, 6, 4).normalize();
  for (let i = 0; i < indices.length; i += 3) {
    const v = indices
      .slice(i, i + 3)
      .map((j) => new THREE.Vector3(...positions.slice(j * 3, j * 3 + 3)));
    const normal = v[1]
      .clone()
      .sub(v[0])
      .cross(v[2].clone().sub(v[0]))
      .normalize();
    const center = v[0].clone().add(v[1]).add(v[2]).divideScalar(3);
    if (normal.dot(camera.position.clone().sub(center)) <= 0) continue;
    const tone = 0.67 + Math.max(0, normal.dot(light)) * 0.38;
    const color = base.clone().multiplyScalar(tone).getStyle();
    const projected = v.map((p) => p.clone().project(camera));
    const path =
      projected
        .map(
          (p, j) =>
            `${j ? "L" : "M"}${((p.x + 1) * 350).toFixed(2)},${((1 - p.y) * 225).toFixed(2)}`,
        )
        .join("") + "Z";
    triangles.push({ z: projected.reduce((a, p) => a + p.z, 0), path, color });
  }
  triangles.sort((a, b) => b.z - a.z);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="700" height="450"><defs><radialGradient id="bg"><stop stop-color="#f5f7f2"/><stop offset="1" stop-color="#e2ebe7"/></radialGradient><filter id="blur"><feGaussianBlur stdDeviation="12"/></filter></defs><rect width="700" height="450" fill="url(#bg)"/><ellipse cx="350" cy="370" rx="75" ry="13" fill="#50645a" opacity=".22" filter="url(#blur)"/>${triangles.map((t) => `<path d="${t.path}" fill="${t.color}" stroke="${t.color}" stroke-width=".6"/>`).join("")}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(`public/models/${id}.png`);
}
const icon = await readFile("public/favicon.svg");
for (const size of [192, 512])
  await sharp(icon).resize(size, size).png().toFile(`public/icon-${size}.png`);
console.log("Rendered two model thumbnails and two app icons.");

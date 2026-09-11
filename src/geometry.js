// Shared radial topology: each stage is a subset of its predecessor.
export const HEIGHT = 3.4;
export const RINGS = 102;
export const SIDES = 80;
const interpolate = (points, y) => {
  for (let i = 1; i < points.length; i++) {
    if (y <= points[i][0]) {
      const [a, r] = points[i - 1];
      const [b, s] = points[i];
      return r + ((s - r) * (y - a)) / (b - a);
    }
  }
  return points.at(-1)[1];
};
export function radiusAt(stage, y, angle, project = "mushroom") {
  if (project === "egg" && stage >= 2) {
    const t = (y - HEIGHT / 2) / (HEIGHT / 2);
    const egg = Math.sqrt(Math.max(0.0004, 1 - t * t)) * (0.9 - 0.13 * t);
    return stage === 2
      ? Math.min(1, egg + 0.18)
      : Math.max(
          0.012,
          egg - 0.005 * (0.5 + 0.5 * Math.cos(angle * 11 + y * 4)),
        );
  }
  const square =
    1 / Math.max(Math.abs(Math.cos(angle)), Math.abs(Math.sin(angle)));
  if (stage === 0) return square;
  const octagon = Math.min(
    square,
    1.25 /
      Math.max(
        Math.abs(Math.cos(angle - Math.PI / 4)),
        Math.abs(Math.sin(angle - Math.PI / 4)),
      ),
  );
  if (stage === 1) return octagon;
  let radius = 1;
  if (stage >= 3)
    radius = Math.min(
      radius,
      interpolate(
        [
          [0, 1],
          [2.15, 1],
          [2.2, 0.91],
          [2.25, 1],
          [3.4, 1],
        ],
        y,
      ),
    );
  if (stage >= 4) {
    const stem =
      0.445 +
      0.115 * Math.exp(-y * 3.2) +
      0.07 * Math.pow(Math.min(y / 2.18, 1), 4);
    const shoulder =
      y < 2.18 ? stem : y < 2.28 ? stem + ((1 - stem) * (y - 2.18)) / 0.1 : 1;
    radius = Math.min(radius, shoulder);
  }
  if (stage >= 5 && y > 2.3) {
    radius = Math.min(
      radius,
      Math.sqrt(Math.max(0.0004, 1 - Math.pow((y - 2.3) / 1.1, 2))),
    );
  }
  if (stage >= 6) {
    // A subtle uneven cut surface; removal only, never displacement outside the previous solid.
    const facet =
      0.007 + 0.007 * (0.5 + 0.5 * Math.sin(angle * 9 + Math.sin(y * 3)));
    radius = Math.max(0.008, radius - facet - (y > 2.22 ? 0.012 : 0));
  }
  return radius;
}
export function stagePositions(stage, project = "mushroom") {
  const out = [];
  for (let j = 0; j <= RINGS; j++) {
    const y = (j / RINGS) * HEIGHT;
    for (let i = 0; i <= SIDES; i++) {
      const a = (i / SIDES) * Math.PI * 2;
      const r = radiusAt(stage, y, a, project);
      out.push(Math.cos(a) * r, y - HEIGHT / 2, Math.sin(a) * r);
    }
  }
  // End caps share dedicated center vertices.
  out.push(0, -HEIGHT / 2, 0, 0, HEIGHT / 2, 0);
  return new Float32Array(out);
}
export function stageIndices() {
  const out = [];
  const stride = SIDES + 1;
  for (let j = 0; j < RINGS; j++)
    for (let i = 0; i < SIDES; i++) {
      const a = j * stride + i,
        b = a + stride;
      out.push(a, b, a + 1, b, b + 1, a + 1);
    }
  const bottom = (RINGS + 1) * stride,
    top = bottom + 1;
  for (let i = 0; i < SIDES; i++) {
    out.push(bottom, i, i + 1);
    out.push(top, RINGS * stride + i + 1, RINGS * stride + i);
  }
  return out;
}

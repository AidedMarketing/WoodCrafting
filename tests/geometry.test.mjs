import test from "node:test";
import assert from "node:assert/strict";
import {
  radiusAt,
  stagePositions,
  stageIndices,
  HEIGHT,
  RINGS,
  SIDES,
} from "../src/geometry.js";
test("every stage only removes wood from the prior stage", () => {
  for (let stage = 1; stage < 7; stage++)
    for (let j = 0; j <= 500; j++)
      for (let i = 0; i < 128; i++) {
        const y = (j / 500) * HEIGHT,
          a = (i / 128) * Math.PI * 2;
        assert.ok(
          radiusAt(stage, y, a) <= radiusAt(stage - 1, y, a) + 1e-8,
          `Stage ${stage}, height ${y} adds material`,
        );
        assert.ok(radiusAt(stage, y, a) > 0);
      }
});
test("meshes have finite consistent topology and valid indices", () => {
  const n = stagePositions(0).length;
  for (let s = 0; s < 7; s++) {
    const p = stagePositions(s);
    assert.equal(p.length, n);
    assert.ok(p.every(Number.isFinite));
  }
  for (const i of stageIndices()) assert.ok(i >= 0 && i < n / 3);
});
test("triangle winding points outward on the blank", () => {
  const p = stagePositions(0),
    indices = stageIndices();
  for (let i = 0; i < indices.length; i += 3) {
    const a = indices[i] * 3,
      b = indices[i + 1] * 3,
      c = indices[i + 2] * 3;
    const u = [p[b] - p[a], p[b + 1] - p[a + 1], p[b + 2] - p[a + 2]],
      v = [p[c] - p[a], p[c + 1] - p[a + 1], p[c + 2] - p[a + 2]];
    const normal = [
      u[1] * v[2] - u[2] * v[1],
      u[2] * v[0] - u[0] * v[2],
      u[0] * v[1] - u[1] * v[0],
    ];
    assert.ok(
      normal[0] * p[a] + normal[1] * p[a + 1] + normal[2] * p[a + 2] >= -1e-6,
    );
  }
});
test("finished mushroom has a broad cap, sound stem and flat base", () => {
  assert.ok(radiusAt(6, 2.4, 0) > radiusAt(6, 1.2, 0) * 2);
  assert.ok(radiusAt(6, 0, 0) > radiusAt(6, 1.2, 0));
  const p = stagePositions(6);
  for (let i = 0; i <= SIDES; i++) assert.equal(p[i * 3 + 1], p[1]);
  assert.equal(p.length / 3, (RINGS + 1) * (SIDES + 1) + 2);
});

test("egg stages only remove material and taper toward the top", () => {
  for (let stage = 1; stage < 4; stage++)
    for (let j = 0; j <= 200; j++)
      for (let i = 0; i < 64; i++) {
        const y = (j / 200) * HEIGHT,
          a = (i / 64) * Math.PI * 2;
        assert.ok(
          radiusAt(stage, y, a, "egg") <=
            radiusAt(stage - 1, y, a, "egg") + 1e-8,
        );
      }
  assert.ok(radiusAt(3, 1, 0, "egg") > radiusAt(3, HEIGHT - 1, 0, "egg"));
});

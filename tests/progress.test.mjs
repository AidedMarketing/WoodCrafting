import test from "node:test";
import assert from "node:assert/strict";
import { readProgress, progressKey } from "../src/progress.js";
test("progress is isolated per project and sanitizes invalid data", () => {
  const data = {
    [progressKey("egg")]: JSON.stringify({
      stage: 9,
      done: [0, 1, 1, 9, -1, "2"],
    }),
    [progressKey("mushroom")]: JSON.stringify({ stage: 4, done: [0] }),
  };
  const storage = { getItem: (k) => data[k] };
  assert.deepEqual(readProgress(storage, "egg", 4), { stage: 3, done: [0, 1] });
  assert.deepEqual(readProgress(storage, "mushroom", 7), {
    stage: 4,
    done: [0],
  });
});
test("bad storage recovers to an empty lesson", () => {
  for (const value of ["null", "false", "broken", "{}"])
    assert.deepEqual(readProgress({ getItem: () => value }, "egg", 4), {
      stage: 0,
      done: [],
    });
  assert.deepEqual(
    readProgress(
      {
        getItem: () => {
          throw Error("blocked");
        },
      },
      "egg",
      4,
    ),
    { stage: 0, done: [] },
  );
});

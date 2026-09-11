export const progressKey = (id) => `woodcrafting.${id}.v1`;
export function readProgress(storage, id, count) {
  try {
    const value = JSON.parse(storage.getItem(progressKey(id)) || "{}");
    return {
      stage: Number.isInteger(value?.stage)
        ? Math.max(0, Math.min(count - 1, value.stage))
        : 0,
      done: Array.isArray(value?.done)
        ? [
            ...new Set(
              value.done.filter(
                (x) => Number.isInteger(x) && x >= 0 && x < count,
              ),
            ),
          ]
        : [],
    };
  } catch {
    return { stage: 0, done: [] };
  }
}

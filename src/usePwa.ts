import { useEffect, useState } from "react";
export function usePwa() {
  const [offline, setOffline] = useState(!navigator.onLine);
  const [cache, setCache] = useState(false);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    addEventListener("online", update);
    addEventListener("offline", update);
    if (import.meta.env.PROD && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register(`${import.meta.env.BASE_URL}sw.js`, {
          scope: import.meta.env.BASE_URL,
        })
        .then(() => navigator.serviceWorker.ready)
        .then(() => setCache(true))
        .catch(() => setCache(false));
    }
    return () => {
      removeEventListener("online", update);
      removeEventListener("offline", update);
    };
  }, []);
  return offline
    ? "Offline"
    : cache
      ? "Offline cache installed"
      : "Your personal workshop";
}

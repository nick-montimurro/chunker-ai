"use client";

import { useEffect } from "react";

/**
 * Registers the PWA service worker on mount.
 * Must be a Client Component — service workers are browser-only.
 */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .catch((err) => console.warn("SW registration failed:", err));
    }
  }, []);

  return null;
}

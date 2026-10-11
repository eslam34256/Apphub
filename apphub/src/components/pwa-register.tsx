"use client";

import { useEffect } from "react";

/** تسجيل عالم خدمة PWA — مرة واحدة بعد التحميل */
export function PwaRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return null;
}

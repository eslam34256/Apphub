"use client";

import { useEffect, useRef } from "react";

/** نصف الـ Slot: تسجيل مشاهدة أول ظهور + تنفيذ رابط مدفوع متتبع */
export function SponsoredSlotClient({ slotId, url }: { slotId: string; url: string }) {
  const seen = useRef(false);

  useEffect(() => {
    if (seen.current) return;
    seen.current = true;
    try {
      navigator.sendBeacon("/api/track", JSON.stringify({ event: "impression", target: `slot:${slotId}` }));
    } catch {}
  }, [slotId]);

  return (
    <a
      href={url}
      target="_blank"
      rel="sponsored nofollow noopener"
      onClick={() => {
        try {
          navigator.sendBeacon("/api/track", JSON.stringify({ event: "click", target: `slot:${slotId}` }));
        } catch {}
      }}
      className="inline-flex items-center gap-1 rounded-full bg-brand-900 px-4 py-1.5 text-xs font-bold text-white hover:bg-brand-800 transition"
    >
      زر الإعلان ↗
    </a>
  );
}

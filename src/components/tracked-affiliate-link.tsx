"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * زر أفيليات متتبع — بشارة إفصاح صريحة «رابط بعمولة» (عقد الأمانة مع الزائر).
 * rel="sponsored nofollow" علشان SEO يفضل نضيف.
 */
export function TrackedAffiliateLink({
  target,
  url,
  label,
  className = ""
}: {
  target: string;
  url: string;
  label: string;
  className?: string;
}) {
  const [fired, setFired] = useState(false);

  function track() {
    if (fired) return;
    setFired(true);
    try {
      navigator.sendBeacon("/api/track", JSON.stringify({ event: "click", target }));
    } catch {
      fetch("/api/track", {
        method: "POST",
        body: JSON.stringify({ event: "click", target })
      }).catch(() => {});
    }
  }

  return (
    <span className={`inline-flex flex-col gap-1 ${className}`}>
      <a
        href={url}
        target="_blank"
        rel="sponsored nofollow noopener"
        onClick={track}
        className="inline-flex items-center gap-2 rounded-full bg-accent-400 px-5 py-2 text-sm font-bold text-brand-900 hover:bg-accent-500 transition"
      >
        {label} ↗
      </a>
      <span className="text-[10px] text-charcoal-400">
        رابط بعمولة — بناخد نسبة لو اشتريت منه ·{" "}
        <Link href="/disclosure" className="hover:underline">
          التفاصيل
        </Link>
      </span>
    </span>
  );
}

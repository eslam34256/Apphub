"use client";

import Link from "next/link";
import { useState } from "react";
import { consentAllowsTracking } from "@/lib/consent";

/**
 * زر أفيليات متتبع — بشارة إفصاح صريحة «رابط بعمولة» (عقد الأمانة مع الزائر).
 * v44: لو الحالة مش active بيتعرض كـ link عادي بدون شارة ولا sponsored rel —
 * ممنوع وسم رابط غير معتمد كعمولة.
 */
export function TrackedAffiliateLink({
  target,
  url,
  label,
  status = "active",
  className = ""
}: {
  target: string;
  url: string;
  label: string;
  status?: string;
  className?: string;
}) {
  const [fired, setFired] = useState(false);

  if (status !== "active") {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 rounded-full bg-cream-100 px-5 py-2 text-sm font-bold text-brand-900 hover:bg-cream-200 transition ${className}`}>
        {label} ↗
      </a>
    );
  }

  function track() {
    // v42: التتبع الاختياري بيشتغل بموافقة صريحة بس
    if (!consentAllowsTracking()) return;
    if (fired) return;
    setFired(true);
    try {
      navigator.sendBeacon("/api/track", JSON.stringify({ event: "click", target, meta: { via: "affiliate" } }));
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

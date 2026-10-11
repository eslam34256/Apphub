"use client";
import { getAffiliateLink, trackAffiliateClick } from "@/lib/affiliate";
export function AffiliateButton({ appSlug, label = "حمّل التطبيق" }: { appSlug: string; label?: string }) {
  const url = getAffiliateLink(appSlug);
  async function handleClick() { await trackAffiliateClick(appSlug); window.open(url, "_blank", "noopener,noreferrer"); }
  return (
    <button onClick={handleClick} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-bold text-white hover:bg-emerald-500">
      {label} ↗
    </button>
  );
}

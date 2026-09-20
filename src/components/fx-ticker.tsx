"use client";

import { useEffect, useState } from "react";

/** شريط سعر الصرف الحي — يظهر فقط لما المصدر يرد فعلًا (مفيش أرقام احتياطية) */
export function FxTicker() {
  const [usd, setUsd] = useState<{ EGP: number; SAR: number; AED: number } | null>(null);

  useEffect(() => {
    fetch("/api/fx")
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => j?.usd && setUsd(j.usd))
      .catch(() => {});
  }, []);

  if (!usd) return null;

  return (
    <p className="text-xs text-charcoal-500">
      💱 الدولار دلوقتي: ≈{usd.EGP} ج 🇪🇬 · {usd.SAR} ريال 🇸🇦 · {usd.AED} درهم 🇦🇪
      <span className="text-charcoal-400"> — لايف (المصدر: ExchangeRate-API، تحديث كل 6 ساعات)</span>
    </p>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * شارة «تجربة المجتمع» — متوسط بلاغات المستخدمين لآخر 30 يوم.
 * بتختفي تمامًا لو مفيش 3 بلاغات على الأقل أو الجدول لسه مش معمول.
 */
export function CommunityMedian({
  appId,
  metric,
  unit = "ج"
}: {
  appId: string;
  metric: string;
  unit?: string;
}) {
  const [stats, setStats] = useState<{ n: number; median: number } | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const supabase = createClient();
        const since = new Date(Date.now() - 30 * 864e5).toISOString();
        const { data } = await supabase
          .from("community_reports")
          .select("value")
          .eq("app_id", appId)
          .eq("metric", metric)
          .gte("created_at", since)
          .limit(200);
        if (!alive || !data || data.length < 3) return;
        const vals = data
          .map((r: any) => Number(r.value))
          .filter(Number.isFinite)
          .sort((a, b) => a - b);
        if (vals.length < 3) return;
        const mid =
          vals.length % 2
            ? vals[(vals.length - 1) / 2]
            : Math.round((vals[vals.length / 2 - 1] + vals[vals.length / 2]) / 2);
        setStats({ n: vals.length, median: mid });
      } catch {
        /* بصمت — الشارة مش بتكسر الصفحة */
      }
    })();
    return () => {
      alive = false;
    };
  }, [appId, metric]);

  if (!stats) return null;

  return (
    <p className="mt-1 rounded-lg bg-brand-50 px-2 py-1 text-[11px] text-brand-700">
      👥 تجربة المجتمع ({stats.n} بلاغ — آخر 30 يوم): ≈{stats.median} {unit} — قيد المراجعة
    </p>
  );
}

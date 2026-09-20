"use client";

import { useState } from "react";

/**
 * فورم «شفت رقم مختلف؟ بلّغ المجتمع» — الكاستومر بيبعت الرقم اللي شافه بعينه.
 * البلاغات بتتحسب كمتوسط مجتمعي موسوم «قيد المراجعة».
 */
export function CommunityReportForm({
  domain,
  apps,
  metric,
  metricLabel,
  unit = "ج"
}: {
  domain: string;
  apps: { id: string; name: string }[];
  metric: string;
  metricLabel: string;
  unit?: string;
}) {
  const [open, setOpen] = useState(false);
  const [appId, setAppId] = useState(apps[0]?.id ?? "");
  const [value, setValue] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState(""); // مصيدة سبام
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/community-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain, appId, metric, value: Number(value), city, website })
      });
      const j = await res.json();
      if (!res.ok || !j.ok) {
        setStatus("error");
        setError(j.error ?? "حصل خطأ — جرب تاني");
        return;
      }
      setStatus("done");
      setValue("");
      setCity("");
    } catch {
      setStatus("error");
      setError("مفيش اتصال — جرب لاحقًا");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-2xl border border-sage-300 bg-sage-50 p-4 text-sm text-sage-700">
        ✅ <strong>وصل بلاغك!</strong> هينضم للمتوسط المجتمعي بعد المراجعة — شكرًا إنك بتكبّر المرجع ده معانا.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-dashed border-accent-400 bg-cream-50 p-5">
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          className="w-full text-center text-sm font-bold text-accent-700"
        >
          🗣️ شفت {metricLabel} مختلف عن المعروض؟ بلّغ المجتمع
        </button>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <p className="text-sm font-bold text-brand-900">
            بلّغ عن {metricLabel} اللي شفتها بعينك
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            <select
              value={appId}
              onChange={(e) => setAppId(e.target.value)}
              className="rounded-xl border border-cream-200 px-3 py-2 text-sm"
              aria-label="التطبيق"
            >
              {apps.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
            <div className="flex items-center gap-2">
              <input
                type="number"
                required
                min={0}
                step="0.5"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="القيمة"
                className="w-full rounded-xl border border-cream-200 px-3 py-2 text-sm"
                aria-label={metricLabel}
              />
              <span className="text-sm text-charcoal-500">{unit}</span>
            </div>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="مدينتك (اختياري)"
              className="rounded-xl border border-cream-200 px-3 py-2 text-sm"
              aria-label="المدينة"
            />
          </div>
          {/* مصيدة سبام مخفية */}
          <input
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />
          {status === "error" && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={status === "sending" || value === ""}
              className="rounded-full bg-accent-400 px-6 py-2 text-sm font-bold text-brand-900 hover:bg-accent-500 disabled:opacity-50"
            >
              {status === "sending" ? "بيبعت…" : "ابعت البلاغ"}
            </button>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-sm text-charcoal-500"
            >
              إلغاء
            </button>
            <span className="text-xs text-charcoal-400">
              البلاغات بتظهر كمتوسط مجتمعي موسوم «قيد المراجعة» — مش كرقم رسمي.
            </span>
          </div>
        </form>
      )}
    </div>
  );
}

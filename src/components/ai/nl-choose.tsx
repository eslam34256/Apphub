"use client";

import { useState } from "react";
import Link from "next/link";
import { choose, ChooseResult } from "@/lib/nl-choose";

/** v37 — Killer Feature: المستخدم يكتب بالعامية وإحنا بنختارله 🥇🥉 بأسباب */
export function NlChoose() {
  const [q, setQ] = useState("");
  const [res, setRes] = useState<ChooseResult | null>(null);

  const run = (text: string) => {
    if (!text.trim()) return;
    setQ(text);
    setRes(choose(text));
  };

  const examples = [
    "عايز تطبيق أتعلم بيه إنجليزي ببلاش",
    "vpn كويس ورخيص",
    "أفضل تطبيق توصيل أكل في مصر",
    "برنامج pdf مجاني"
  ];

  return (
    <section className="rounded-3xl gradient-brand p-6 sm:p-8 text-white shadow-xl">
      <div className="flex items-center gap-3 mb-2">
        <span className="text-3xl">🤖</span>
        <h2 className="text-2xl sm:text-3xl font-extrabold">ساعدني أختار</h2>
      </div>
      <p className="text-white/85 mb-5">
        اكتب طلبك بالعامية عادي — ميزانيتك وبلدك واحتياجك — وهنطلعلك أفضل ٣ اختيارات بأسبابها.
      </p>
      <form
        className="flex flex-col sm:flex-row gap-3"
        onSubmit={e => { e.preventDefault(); run(q); }}
      >
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="مثال: عايز برنامج زي Canva بس مجاني…"
          className="flex-1 rounded-2xl border-0 bg-white px-5 py-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-white/30"
        />
        <button type="submit" className="rounded-2xl bg-slate-900 px-8 py-4 font-extrabold text-white hover:bg-slate-800 transition-colors">
          🤖 اختارلي
        </button>
      </form>
      <div className="mt-3 flex flex-wrap gap-2">
        {examples.map(ex => (
          <button
            key={ex}
            onClick={() => run(ex)}
            className="rounded-full bg-white/15 px-3.5 py-1.5 text-xs hover:bg-white/25 transition-colors"
          >
            {ex}
          </button>
        ))}
      </div>

      {res && (
        <div className="mt-6 space-y-3 animate-fade-in">
          <p className="text-xs text-white/70">
            فهمنا طلبك كده: {res.intent.activity ? "مجال " : ""}
            {res.intent.freeOnly ? "مجاني · " : ""}
            {res.intent.budget ? `ميزانية ${res.intent.budget}ج · ` : ""}
            بلد: {res.intent.country === "EG" ? "مصر 🇪🇬" : res.intent.country === "SA" ? "السعودية 🇸🇦" : "الإمارات 🇦🇪"}
            {" "}· رشّحنا من {res.poolSize} تطبيق مناسب
          </p>
          {res.medals.map(m => (
            <div key={m.medal} className="rounded-2xl bg-white p-4 sm:p-5 text-slate-900 shadow-lg">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-3 flex-1">
                  <span className="text-3xl">{m.medal}</span>
                  <div>
                    <p className="text-xs font-bold text-brand-600">{m.title}</p>
                    <h3 className="text-lg font-extrabold">{m.app.icon} {m.app.name}</h3>
                  </div>
                </div>
                <Link
                  href={`/apps/${m.app.slug}`}
                  className="shrink-0 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-500 transition-colors text-center"
                >
                  جرّبه ←
                </Link>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {m.reasons.map(r => (
                  <span key={r} className="rounded-full bg-cream-100 px-3 py-1 text-xs font-bold text-slate-700">{r}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

"use client";

import { useState, type ReactNode } from "react";

type TabId = "subs" | "uc" | "telecom" | "ai";

const TABS: { id: TabId; icon: string; label: string; desc: string }[] = [
  { id: "subs", icon: "💳", label: "الاشتراكات والتطبيقات", desc: "تاريخ الأسعار نقطة بنقطة" },
  { id: "uc", icon: "🎮", label: "شدات الألعاب", desc: "جنيه / 100 UC" },
  { id: "telecom", icon: "📶", label: "باقات الإنترنت", desc: "جنيه / جيجابايت" },
  { id: "ai", icon: "🤖", label: "اشتراكات AI", desc: "دولار → جنيه لايف" }
];

/**
 * مركز الرادارات — توبات موحّدة فوق أربع رادارات متخصصة.
 * المحتوى بييجي مهيّأ من السيرفر (RSC props) والتوبات بتبدّل محليًا — بلا fetch.
 * صفحات الرادارات المستقلة (/uc-radar وشركاه) فضلت شغالة للـ SEO والمشاركة المباشرة.
 */
export function RadarHub({
  subs,
  uc,
  telecom,
  ai
}: {
  subs: ReactNode;
  uc: ReactNode;
  telecom: ReactNode;
  ai: ReactNode;
}) {
  const [tab, setTab] = useState<TabId>("subs");
  const content: Record<TabId, ReactNode> = { subs, uc, telecom, ai };

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
        {/* هيدر المركز */}
        <div className="text-center space-y-2">
          <h1 className="heading-display text-3xl md:text-4xl text-brand-900">📡 مركز الرادارات</h1>
          <p className="text-charcoal-500 max-w-xl mx-auto text-sm">
            كل مستوايات التوفير في مكان واحد — اشتراكاتك، شداتك، باقتك، وأدوات الـ AI بتاعتك.
          </p>
        </div>

        {/* التوبات */}
        <div className="flex flex-wrap justify-center gap-2" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-5 py-2.5 text-sm font-bold transition ${
                tab === t.id
                  ? "bg-brand-900 text-white shadow-soft scale-[1.03]"
                  : "bg-white border border-cream-200 text-charcoal-500 hover:border-accent-300 hover:text-brand-900"
              }`}
              title={t.desc}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* المحتوى */}
        <div role="tabpanel">{content[tab]}</div>
      </div>
    </div>
  );
}

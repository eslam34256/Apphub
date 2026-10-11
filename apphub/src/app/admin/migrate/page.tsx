"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { apps } from "@/data/apps";

export default function MigratePage() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [stats, setStats] = useState({
    success: 0,
    skipped: 0,
    failed: 0
  });

  function addLog(message: string) {
    setLogs((prev) => [message, ...prev].slice(0, 50));
  }

  async function startMigration() {
    if (!confirm(`متأكد من نقل ${apps.length} تطبيق لـ Supabase؟`)) return;

    setLoading(true);
    setLogs([]);
    setStats({ success: 0, skipped: 0, failed: 0 });
    setProgress(0);

    const supabase = createClient();
    let success = 0;
    let skipped = 0;
    let failed = 0;

    addLog(`🚀 بدء النقل... عدد التطبيقات: ${apps.length}`);

    for (let i = 0; i < apps.length; i++) {
      const app = apps[i];

      try {
        // تحقق لو التطبيق موجود
        const { data: existing } = await supabase
          .from("managed_apps")
          .select("id")
          .eq("slug", app.slug)
          .maybeSingle();

        if (existing) {
          skipped++;
          addLog(`⏭️  تخطي ${app.name} (موجود بالفعل)`);
        } else {
          // أضف التطبيق
          const { error } = await supabase.from("managed_apps").insert({
            slug: app.slug,
            name: app.name,
            icon: app.icon,
            category: app.category,
            short_description: app.shortDescription,
            description: app.description,
            rating: app.rating,
            pros: app.pros,
            cons: app.cons,
            countries: app.countries,
            pricing: app.pricing,
            tags: app.tags,
            business_use: app.businessUse || [],
            is_active: true,
            is_featured: app.rating >= 4.5
          });

          if (error) {
            failed++;
            addLog(`❌ فشل ${app.name}: ${error.message}`);
          } else {
            success++;
            addLog(`✅ نُقل ${app.name}`);
          }
        }
      } catch (err: any) {
        failed++;
        addLog(`❌ خطأ في ${app.name}: ${err.message}`);
      }

      const newProgress = Math.round(((i + 1) / apps.length) * 100);
      setProgress(newProgress);
      setStats({ success, skipped, failed });

      // انتظر شوية عشان مايتعملش spam على Supabase
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    addLog(`\n🎉 اكتمل النقل!`);
    addLog(`✅ نُقل: ${success}`);
    addLog(`⏭️  متخطى: ${skipped}`);
    addLog(`❌ فشل: ${failed}`);

    setLoading(false);
  }

  async function deleteAll() {
    if (!confirm("⚠️ متأكد من حذف كل التطبيقات من Supabase؟")) return;
    if (!confirm("⚠️ آخر تأكيد - دي عملية لا يمكن التراجع عنها!")) return;

    setLoading(true);
    addLog("🗑️ جاري حذف كل التطبيقات...");

    const supabase = createClient();
    const { error } = await supabase
      .from("managed_apps")
      .delete()
      .neq("id", "00000000-0000-0000-0000-000000000000");

    if (error) {
      addLog(`❌ فشل الحذف: ${error.message}`);
    } else {
      addLog("✅ تم حذف كل التطبيقات");
    }

    setLoading(false);
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-l from-purple-600 to-pink-600 p-8 text-white">
        <p className="text-sm text-white/80">⚙️ أدوات الأدمن</p>
        <h1 className="mt-2 text-3xl font-extrabold">نقل التطبيقات لـ Supabase</h1>
        <p className="mt-2 text-white/90">
          انقل {apps.length} تطبيق من الملف الثابت لقاعدة البيانات
        </p>
      </div>

      {/* تحذيرات */}
      <div className="rounded-2xl bg-amber-50 p-5">
        <h3 className="font-bold text-amber-900 mb-2">⚠️ ملاحظات مهمة:</h3>
        <ul className="space-y-1 text-sm text-amber-800">
          <li>• التطبيقات الموجودة في Supabase مش هتتأثر</li>
          <li>• لو فيه تطبيق بنفس الـ slug هيتم تخطيه</li>
          <li>• بعد النقل تقدر تعدّل أو تحذف أي تطبيق من لوحة الأدمن</li>
          <li>• التطبيقات بتقييم 4.5+ هتبقى "مميزة" تلقائيًا</li>
        </ul>
      </div>

      {/* الأزرار */}
      <div className="flex gap-3">
        <button
          onClick={startMigration}
          disabled={loading}
          className="flex-1 rounded-2xl bg-emerald-600 px-6 py-4 font-bold text-white disabled:opacity-60 hover:bg-emerald-500"
        >
          {loading ? "⏳ جاري النقل..." : `🚀 ابدأ نقل ${apps.length} تطبيق`}
        </button>

        <button
          onClick={deleteAll}
          disabled={loading}
          className="rounded-2xl bg-rose-600 px-6 py-4 font-bold text-white disabled:opacity-60 hover:bg-rose-500"
        >
          🗑️ حذف الكل
        </button>
      </div>

      {/* شريط التقدم */}
      {loading && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-bold">التقدم: {progress}%</span>
            <span className="text-sm text-slate-500">
              {stats.success + stats.skipped + stats.failed} / {apps.length}
            </span>
          </div>
          <div className="h-4 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-l from-emerald-500 to-emerald-700 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* الإحصائيات */}
      {(stats.success > 0 || stats.skipped > 0 || stats.failed > 0) && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl bg-emerald-50 p-5 text-center">
            <p className="text-3xl">✅</p>
            <p className="mt-2 text-3xl font-extrabold text-emerald-700">
              {stats.success}
            </p>
            <p className="text-sm text-emerald-600">نُقل بنجاح</p>
          </div>
          <div className="rounded-2xl bg-amber-50 p-5 text-center">
            <p className="text-3xl">⏭️</p>
            <p className="mt-2 text-3xl font-extrabold text-amber-700">
              {stats.skipped}
            </p>
            <p className="text-sm text-amber-600">متخطى (موجود)</p>
          </div>
          <div className="rounded-2xl bg-rose-50 p-5 text-center">
            <p className="text-3xl">❌</p>
            <p className="mt-2 text-3xl font-extrabold text-rose-700">
              {stats.failed}
            </p>
            <p className="text-sm text-rose-600">فشل</p>
          </div>
        </div>
      )}

      {/* السجل */}
      {logs.length > 0 && (
        <div className="rounded-2xl bg-slate-900 p-6 text-white">
          <h3 className="mb-3 font-bold">📋 سجل النقل</h3>
          <div className="max-h-96 overflow-y-auto space-y-1 text-sm font-mono">
            {logs.map((log, i) => (
              <div key={i} className="border-b border-white/10 py-1">
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
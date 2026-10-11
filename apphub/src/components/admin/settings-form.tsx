"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SettingsForm({ initialSettings }: { initialSettings: Record<string, any> }) {
  const router = useRouter();
  const [settings, setSettings] = useState({
    site_name: initialSettings.site_name || "AppHub",
    site_description: initialSettings.site_description || "",
    contact_email: initialSettings.contact_email || "",
    whatsapp_number: initialSettings.whatsapp_number || "",
    phone_number: initialSettings.phone_number || "",
    address: initialSettings.address || "",
    working_hours: initialSettings.working_hours || "",
    facebook_url: initialSettings.facebook_url || "",
    instagram_url: initialSettings.instagram_url || "",
    twitter_url: initialSettings.twitter_url || "",
    youtube_url: initialSettings.youtube_url || "",
    linkedin_url: initialSettings.linkedin_url || "",
    tiktok_url: initialSettings.tiktok_url || ""
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSave() {
    setLoading(true);
    setMessage(null);

    const supabase = createClient();

    for (const [key, value] of Object.entries(settings)) {
      await supabase
        .from("site_settings")
        .upsert({ key, value }, { onConflict: "key" });
    }

    setMessage("✅ تم الحفظ بنجاح — التغييرات هتظهر فورًا في الموقع");
    setLoading(false);
    router.refresh();
    setTimeout(() => setMessage(null), 5000);
  }

  return (
    <div className="space-y-6">
      {/* معلومات الموقع */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>🌐</span>
          <span>معلومات الموقع</span>
        </h2>

        <div>
          <label className="mb-2 block text-sm font-bold">اسم الموقع</label>
          <input
            type="text"
            value={settings.site_name}
            onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
            className="w-full rounded-2xl border px-4 py-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">وصف الموقع</label>
          <textarea
            value={settings.site_description}
            onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
            rows={2}
            className="w-full rounded-2xl border px-4 py-3"
          />
        </div>
      </div>

      {/* معلومات التواصل */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>📞</span>
          <span>معلومات التواصل</span>
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold">📧 البريد الإلكتروني</label>
            <input
              type="email"
              value={settings.contact_email}
              onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
              placeholder="info@apphub.eg"
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">💬 رقم الواتساب</label>
            <input
              type="tel"
              value={settings.whatsapp_number}
              onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
              placeholder="+201000000000"
              className="w-full rounded-2xl border px-4 py-3"
            />
            <p className="mt-1 text-xs text-slate-500">
              اكتب الرقم بصيغة دولية (مثال: +201000000000)
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">📞 رقم الهاتف</label>
            <input
              type="tel"
              value={settings.phone_number}
              onChange={(e) => setSettings({ ...settings, phone_number: e.target.value })}
              placeholder="+201000000000"
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">📍 العنوان</label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              placeholder="القاهرة، مصر"
              className="w-full rounded-2xl border px-4 py-3"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold">🕐 ساعات العمل</label>
          <input
            type="text"
            value={settings.working_hours}
            onChange={(e) => setSettings({ ...settings, working_hours: e.target.value })}
            placeholder="الأحد - الخميس: 9 ص - 6 م"
            className="w-full rounded-2xl border px-4 py-3"
          />
        </div>
      </div>

      {/* وسائل التواصل */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <span>📱</span>
          <span>وسائل التواصل الاجتماعي</span>
        </h2>
        <p className="text-xs text-slate-500">اترك الحقل فاضي لو مش عايز تظهر الأيقونة</p>

        <div className="grid gap-4 md:grid-cols-2">
          <SocialInput
            icon="📘"
            label="Facebook"
            value={settings.facebook_url}
            onChange={(v) => setSettings({ ...settings, facebook_url: v })}
            placeholder="https://facebook.com/yourpage"
          />
          <SocialInput
            icon="📷"
            label="Instagram"
            value={settings.instagram_url}
            onChange={(v) => setSettings({ ...settings, instagram_url: v })}
            placeholder="https://instagram.com/yourpage"
          />
          <SocialInput
            icon="🐦"
            label="Twitter / X"
            value={settings.twitter_url}
            onChange={(v) => setSettings({ ...settings, twitter_url: v })}
            placeholder="https://twitter.com/yourpage"
          />
          <SocialInput
            icon="📺"
            label="YouTube"
            value={settings.youtube_url}
            onChange={(v) => setSettings({ ...settings, youtube_url: v })}
            placeholder="https://youtube.com/@yourchannel"
          />
          <SocialInput
            icon="💼"
            label="LinkedIn"
            value={settings.linkedin_url}
            onChange={(v) => setSettings({ ...settings, linkedin_url: v })}
            placeholder="https://linkedin.com/company/yourcompany"
          />
          <SocialInput
            icon="🎵"
            label="TikTok"
            value={settings.tiktok_url}
            onChange={(v) => setSettings({ ...settings, tiktok_url: v })}
            placeholder="https://tiktok.com/@yourpage"
          />
        </div>
      </div>

      {/* زر الحفظ */}
      <div className="sticky bottom-4 z-10">
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full rounded-2xl gradient-brand px-6 py-4 font-bold text-white text-lg shadow-xl disabled:opacity-60 hover:scale-[1.01] transition"
        >
          {loading ? "⏳ جاري الحفظ..." : "💾 حفظ كل التغييرات"}
        </button>

        {message && (
          <p className="mt-3 rounded-2xl bg-emerald-50 px-4 py-3 text-emerald-700 text-sm text-center font-bold">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

function SocialInput({
  icon, label, value, onChange, placeholder
}: {
  icon: string; label: string; value: string;
  onChange: (v: string) => void; placeholder: string;
}) {
  return (
    <div>
      <label className="mb-2 flex items-center gap-2 text-sm font-bold">
        <span>{icon}</span>
        <span>{label}</span>
      </label>
      <input
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border px-4 py-3 text-sm"
        dir="ltr"
      />
    </div>
  );
}
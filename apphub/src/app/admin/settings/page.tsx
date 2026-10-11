import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
  const supabase = createClient();
  const { data: settings } = await supabase.from("site_settings").select("*");

  const settingsMap: Record<string, any> = {};
  (settings ?? []).forEach((s: any) => {
    settingsMap[s.key] = typeof s.value === "string" ? s.value : JSON.parse(JSON.stringify(s.value));
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">⚙️ إعدادات الموقع</h1>
      <p className="text-sm text-slate-500">
        أي تعديل هنا هيظهر تلقائيًا في كل صفحات الموقع
      </p>
      <SettingsForm initialSettings={settingsMap} />
    </div>
  );
}
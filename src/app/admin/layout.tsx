import { requireAdmin } from "@/lib/admin-check";
import Link from "next/link";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
      {/* Sidebar */}
      <aside className="lg:sticky lg:top-24 lg:h-fit space-y-2 rounded-3xl bg-slate-900 p-4 text-white">
        <div className="mb-4 px-3 py-2">
          <p className="text-xs text-white/60">لوحة التحكم</p>
          <h2 className="text-lg font-extrabold">👑 الأدمن</h2>
        </div>

        <SidebarLink href="/admin" icon="📊" label="الرئيسية" />
        <SidebarLink href="/admin/apps" icon="📱" label="التطبيقات" />
        <SidebarLink href="/admin/categories" icon="📂" label="الفئات" />
        <SidebarLink href="/admin/deals" icon="💰" label="العروض" />
        <SidebarLink href="/admin/ads" icon="📢" label="الإعلانات" />
        <SidebarLink href="/admin/brands" icon="🏪" label="البراندات" />
        <SidebarLink href="/admin/users" icon="👥" label="المستخدمين" />
        <SidebarLink href="/admin/comments" icon="💬" label="التعليقات" />
        <SidebarLink href="/admin/messages" icon="📨" label="الرسائل" />
        <SidebarLink href="/admin/blog" icon="📝" label="المدونة" />
        <SidebarLink href="/admin/prices" icon="💰" label="أسعار المشاوير" />
        <SidebarLink href="/admin/settings" icon="⚙️" label="الإعدادات" />
        <SidebarLink href="/admin/logs" icon="📋" label="السجلات" />
        <SidebarLink href="/admin/migrate" icon="🚀" label="نقل التطبيقات" />

        <div className="mt-6 border-t border-white/10 pt-4">
          <Link
            href="/"
            className="block rounded-xl bg-white/10 px-3 py-2 text-sm hover:bg-white/20"
          >
            ← الرجوع للموقع
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main className="min-w-0 space-y-6">{children}</main>
    </div>
  );
}

function SidebarLink({ href, icon, label }: { href: string; icon: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm hover:bg-white/10 transition"
    >
      <span className="text-lg">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

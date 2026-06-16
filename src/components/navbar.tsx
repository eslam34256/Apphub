import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { NotificationBell } from "./notification-bell";
import { SearchBar } from "./search-bar";
import { MobileMenu } from "./mobile-menu";

const links = [
  { href: "/", label: "الرئيسية", icon: "🏠" },
  { href: "/apps", label: "التطبيقات", icon: "📱" },
  { href: "/compare-hub", label: "المقارنات", icon: "🔍" },
  { href: "/deals", label: "العروض", icon: "🔥" },
  { href: "/ai", label: "AI", icon: "🤖" },
  { href: "/business", label: "للبيزنس", icon: "💼" },
  { href: "/blog", label: "المدونة", icon: "📝" }
];

export async function Navbar() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let isAdmin = false;
  let userName = "";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role, full_name")
      .eq("id", user.id)
      .single();
    isAdmin = profile?.role === "admin";
    userName = profile?.full_name || user.email?.split("@")[0] || "";
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/60 glass">
      <div className="mx-auto max-w-7xl px-3 sm:px-4">
        {/* Top Bar */}
        <div className="flex items-center gap-2 sm:gap-4 py-2 sm:py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-extrabold text-lg sm:text-xl shadow-glow group-hover:scale-110 transition">
              A
            </div>
            <div className="hidden sm:block">
              <p className="text-lg sm:text-xl font-extrabold bg-gradient-to-l from-brand-600 to-accent-500 bg-clip-text text-transparent">
                AppHub
              </p>
              <p className="text-[9px] sm:text-[10px] text-slate-500 -mt-1">دليل التطبيقات العربي</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="flex-1 max-w-2xl hidden md:block">
            <SearchBar />
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 mr-auto">
            {user ? (
              <>
                <NotificationBell />
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hidden md:flex items-center gap-1 rounded-full bg-gradient-to-l from-purple-600 to-pink-600 px-3 py-1.5 text-xs font-bold text-white shadow-md hover:scale-105 transition"
                  >
                    <span>👑</span>
                    <span>أدمن</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className="hidden md:flex items-center gap-2 rounded-full bg-white border border-slate-200 px-4 py-2 text-sm font-bold hover:border-brand-300 transition"
                >
                  <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold">
                    {userName[0] || "U"}
                  </div>
                  <span>{userName || "حسابي"}</span>
                </Link>
              </>
            ) : (
              <Link
                href="/auth"
                className="rounded-full gradient-brand px-3 sm:px-5 py-1.5 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-md hover:scale-105 transition"
              >
                دخول
              </Link>
            )}

            <MobileMenu links={links} user={user} isAdmin={isAdmin} userName={userName} />
          </div>
        </div>

        {/* Mobile Search */}
        <div className="pb-2 sm:pb-3 md:hidden">
          <SearchBar />
        </div>

        {/* Navigation Links - Desktop */}
        <nav className="hidden md:flex items-center gap-1 pb-3 overflow-x-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-brand-50 hover:text-brand-600 transition"
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}

          <div className="mr-auto">
            <Link
              href="/advertise"
              className="flex items-center gap-1 rounded-xl bg-gradient-to-l from-amber-500 to-orange-500 px-3 py-2 text-sm font-bold text-white hover:scale-105 transition shadow-sm"
            >
              <span>📢</span>
              <span>اعلن معانا</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
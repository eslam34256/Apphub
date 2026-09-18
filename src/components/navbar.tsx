"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { NotificationBell } from "./notification-bell";
import { SearchBar } from "./search-bar";
import { MobileMenu } from "./mobile-menu";
import { LanguageSwitcher } from "./language-switcher";
import { useLanguage } from "@/contexts/language-context";

export function Navbar() {
  const { t } = useLanguage();
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, full_name")
          .eq("id", user.id)
          .single();
        setIsAdmin(profile?.role === "admin");
        setUserName(profile?.full_name || user.email?.split("@")[0] || "");
      }
    }
    loadUser();

    // Track scroll
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const links = [
    { href: "/", label: t("nav_home") },
    { href: "/apps", label: t("nav_apps") },
    { href: "/price-radar", label: t("nav_radar") },
    { href: "/calculator", label: t("nav_calculator") },
    { href: "/compare-hub", label: t("nav_compare") },
    { href: "/deals", label: t("nav_deals") },
    { href: "/blog", label: t("nav_blog") }
  ];

  return (
  <header
  className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
    scrolled
      ? "bg-cream-50/95 backdrop-blur-md shadow-soft border-b border-cream-200"
      : "bg-transparent"
  }`}
>
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          {/* Logo */}
<Link href="/" className="flex items-center gap-2 sm:gap-3 shrink-0 group">
  <div
    className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center heading-elegant text-lg sm:text-2xl shadow-elegant group-hover:scale-110 transition ${
      scrolled
        ? "bg-brand-900 text-white"
        : "bg-white/10 backdrop-blur border border-white/20 text-white"
    }`}
  >
    A
  </div>
  <div className="block">
    <p
      className={`heading-elegant text-lg sm:text-2xl ${
        scrolled ? "text-brand-900" : "text-white"
      }`}
    >
      AppHub
    </p>
    <p
      className={`text-[8px] sm:text-[10px] -mt-1 tracking-wider hidden sm:block ${
        scrolled ? "text-charcoal-500" : "text-white/70"
      }`}
    >
      {t("site_tagline")}
    </p>
  </div>
</Link>

          {/* Center Links - Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                  scrolled
                    ? "text-charcoal-800 hover:bg-cream-100 hover:text-brand-900"
                    : "text-white hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <LanguageSwitcher />

            {user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hidden md:flex items-center gap-1 rounded-full bg-accent-400 px-3 py-1.5 text-xs font-bold text-brand-900 hover:bg-accent-500 transition"
                  >
                    <span>👑</span>
                    <span>{t("nav_admin")}</span>
                  </Link>
                )}
                <Link
                  href="/profile"
                  className={`hidden md:flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition ${
                    scrolled
                      ? "bg-cream-100 text-brand-900 hover:bg-cream-200"
                      : "bg-white/10 backdrop-blur text-white border border-white/20 hover:bg-white/20"
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-accent-400 flex items-center justify-center text-brand-900 text-xs font-bold">
                    {userName[0] || "U"}
                  </div>
                  <span>{userName || t("nav_profile")}</span>
                </Link>
              </>
            ) : (
              <Link
                href="/auth"
                className={
                  scrolled
                    ? "btn-primary !py-2 !px-5 !text-sm"
                    : "bg-white text-brand-900 px-5 py-2 rounded-full text-sm font-bold hover:bg-cream-50 transition"
                }
              >
                {t("nav_login")}
              </Link>
            )}

            <MobileMenu
              links={links.map((l) => ({ ...l, icon: "" }))}
              user={user}
              isAdmin={isAdmin}
              userName={userName}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
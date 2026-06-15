"use client";

import { useState } from "react";
import Link from "next/link";

type Props = {
  links: { href: string; label: string; icon: string }[];
  user: any;
  isAdmin: boolean;
  userName: string;
};

export function MobileMenu({ links, user, isAdmin, userName }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 transition"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
        />
      )}

      <div
        className={`fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white z-50 md:hidden transition-transform duration-300 shadow-2xl ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 space-y-6 h-full overflow-y-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white font-extrabold">
                A
              </div>
              <div>
                <p className="font-extrabold text-lg">AppHub</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center"
            >
              ✕
            </button>
          </div>

          {user ? (
            <Link
              href="/profile"
              onClick={() => setOpen(false)}
              className="block rounded-2xl bg-gradient-to-l from-brand-50 to-accent-50 p-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-lg">
                  {userName[0] || "U"}
                </div>
                <div>
                  <p className="font-bold">{userName}</p>
                  <p className="text-xs text-slate-500">عرض الحساب</p>
                </div>
              </div>
            </Link>
          ) : (
            <Link
              href="/auth"
              onClick={() => setOpen(false)}
              className="block w-full text-center rounded-2xl gradient-brand py-3 text-white font-bold"
            >
              سجّل دخول
            </Link>
          )}

          <nav className="space-y-1">
            <p className="text-xs font-bold text-slate-400 uppercase mb-2">القائمة</p>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 hover:bg-slate-50 transition"
              >
                <span className="text-xl">{link.icon}</span>
                <span className="font-semibold">{link.label}</span>
              </Link>
            ))}
          </nav>

          {isAdmin && (
            <div className="space-y-1 border-t pt-4">
              <p className="text-xs font-bold text-purple-600 uppercase mb-2">إدارة</p>
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 rounded-xl bg-purple-50 px-4 py-3"
              >
                <span className="text-xl">👑</span>
                <span className="font-semibold">لوحة الأدمن</span>
              </Link>
            </div>
          )}

          <Link
            href="/advertise"
            onClick={() => setOpen(false)}
            className="block w-full text-center rounded-2xl bg-gradient-to-l from-amber-500 to-orange-500 py-3 text-white font-bold"
          >
            📢 اعلن معانا
          </Link>

          <div className="border-t pt-4 space-y-2 text-sm">
            <Link href="/about" onClick={() => setOpen(false)} className="block text-slate-600 hover:text-brand-600">
              من نحن
            </Link>
            <Link href="/contact" onClick={() => setOpen(false)} className="block text-slate-600 hover:text-brand-600">
              تواصل معانا
            </Link>
            <Link href="/privacy" onClick={() => setOpen(false)} className="block text-slate-600 hover:text-brand-600">
              سياسة الخصوصية
            </Link>
            <Link href="/terms" onClick={() => setOpen(false)} className="block text-slate-600 hover:text-brand-600">
              الشروط والأحكام
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
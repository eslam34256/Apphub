"use client";

import { useTransition } from "react";

/**
 * زرار تسجيل الخروج — ملف feedback مرئي أثناء الـ server action
 * (v29: المستخدم كان بيدوس ومنغير رد يظن الزرار مش شغال)
 */
export function ProfileActions({ signOutAction }: { signOutAction: () => Promise<void> }) {
  const [pending, startTransition] = useTransition();
  return (
    <button
      onClick={() => startTransition(() => signOutAction())}
      disabled={pending}
      aria-label="تسجيل الخروج من الحساب"
      className="rounded-2xl bg-rose-100 px-4 py-3 font-bold text-rose-700 transition hover:bg-rose-200 disabled:opacity-60 disabled:cursor-wait"
    >
      {pending ? "بنسجل خروجك…" : "🚪 تسجيل الخروج"}
    </button>
  );
}

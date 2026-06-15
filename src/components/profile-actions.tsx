"use client";
export function ProfileActions({ signOutAction }: { signOutAction: () => Promise<void> }) {
  return (
    <button onClick={() => signOutAction()} className="rounded-2xl bg-rose-100 px-4 py-3 font-bold text-rose-700">
      تسجيل الخروج
    </button>
  );
}

"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6">😕</div>
        <h1 className="text-3xl font-extrabold mb-3">حصلت مشكلة!</h1>
        <p className="text-slate-600 mb-8">
          عذرًا، حصل خطأ غير متوقع. جرب تحديث الصفحة أو ارجع للرئيسية.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <button
            onClick={reset}
            className="rounded-2xl gradient-brand px-6 py-3 font-bold text-white shadow-md hover:scale-105 transition"
          >
            🔄 جرب تاني
          </button>
          <Link
            href="/"
            className="rounded-2xl bg-white border border-slate-200 px-6 py-3 font-bold hover:border-brand-300 transition"
          >
            🏠 الرئيسية
          </Link>
        </div>

        {error.digest && (
          <p className="mt-8 text-xs text-slate-400">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
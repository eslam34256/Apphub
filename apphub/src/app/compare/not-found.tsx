import Link from 'next/link';

export default function CompareNotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <span className="text-5xl" aria-hidden>⚖️</span>
      <h1 className="mt-4 text-2xl font-bold text-slate-800">المقارنة دي مش موجودة</h1>
      <p className="mt-2 text-slate-500">
        يمكن انتهت صلاحيتها أو الرابط فيه غلطة.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/compare"
          className="rounded-xl bg-[#1a2942] px-5 py-2.5 font-semibold text-white hover:opacity-90"
        >
          كل المقارنات
        </Link>
        <Link
          href="/apps"
          className="rounded-xl border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50"
        >
          تصفح التطبيقات
        </Link>
      </div>
    </main>
  );
}

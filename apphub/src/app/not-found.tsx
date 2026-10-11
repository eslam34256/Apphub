import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="text-center max-w-md">
        <div className="relative inline-block mb-8">
          <div className="text-[150px] font-extrabold bg-gradient-to-l from-brand-500 to-accent-500 bg-clip-text text-transparent leading-none">
            404
          </div>
          <div className="absolute -top-4 -right-4 text-6xl animate-bounce">
            🔍
          </div>
        </div>

        <h1 className="text-3xl font-extrabold mb-3">الصفحة غير موجودة</h1>
        <p className="text-slate-600 mb-8">
          عذرًا، الصفحة اللي بتدوّر عليها مش موجودة أو اتنقلت لمكان تاني.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-2xl gradient-brand px-6 py-3 font-bold text-white shadow-md hover:scale-105 transition"
          >
            🏠 الرجوع للرئيسية
          </Link>
          <Link
            href="/apps"
            className="rounded-2xl bg-white border border-slate-200 px-6 py-3 font-bold hover:border-brand-300 transition"
          >
            📱 تصفح التطبيقات
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500 mb-3">روابط مفيدة:</p>
          <div className="flex flex-wrap justify-center gap-2 text-sm">
            <Link href="/compare-hub" className="text-brand-600 hover:underline">المقارنات</Link>
            <span className="text-slate-300">•</span>
            <Link href="/deals" className="text-brand-600 hover:underline">العروض</Link>
            <span className="text-slate-300">•</span>
            <Link href="/blog" className="text-brand-600 hover:underline">المدونة</Link>
            <span className="text-slate-300">•</span>
            <Link href="/contact" className="text-brand-600 hover:underline">تواصل معانا</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
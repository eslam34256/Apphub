"use client";

import { useEffect, useState } from "react";

/**
 * v35: زرار «شارك» العائم — واتساب أولًا (القناة #١ للانتشار في مصر)
 * - واتساب / فيسبوك / X / نسخ الرابط / مشاركة النظام (لما متاحة)
 * - النص بيتبني من عنوان الصفحة + الدومين الحالي (مفيش أي هاردكود)
 */
export function ShareFab() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("AppHub");

  useEffect(() => {
    setUrl(window.location.href);
    setTitle(document.title.replace(/\s*\|\s*AppHub\s*$/, ""));
  }, []);

  const text = `${title} — من AppHub 🇪🇬\n${url}`;
  const enc = encodeURIComponent(text);

  const targets = [
    { label: "واتساب", bg: "#25D366", href: `https://wa.me/?text=${enc}`, icon: (
      <svg viewBox="0 0 24 24" fill="#fff" className="w-4 h-4"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.94L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm5.77 14.06c-.24.68-1.4 1.3-1.93 1.35-.52.05-1.01.24-3.4-.7-2.87-1.14-4.7-4.06-4.84-4.25-.14-.19-1.16-1.55-1.16-2.95 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35h.55c.17 0 .41-.06.64.5.24.57.8 1.97.87 2.11.07.14.12.31.02.5-.1.19-.14.3-.28.47l-.43.5c-.14.14-.29.3-.12.58.16.28.73 1.2 1.57 1.95 1.08.96 1.99 1.26 2.27 1.4.28.14.45.12.61-.07l.87-1.01c.2-.28.38-.21.64-.12l1.7.8c.26.12.43.19.5.3.06.12.06.68-.18 1.36Z"/></svg>
    )},
    { label: "فيسبوك", bg: "#1877F2", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, icon: (
      <svg viewBox="0 0 24 24" fill="#fff" className="w-4 h-4"><path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.6-1.6h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4V14h2.7v8h3.4Z"/></svg>
    )},
    { label: "X", bg: "#111827", href: `https://x.com/intent/tweet?text=${enc}`, icon: (
      <svg viewBox="0 0 24 24" fill="#fff" className="w-4 h-4"><path d="M17.7 3H21l-7.2 8.2L22.2 21h-6.6l-5.2-6.1L4.5 21H1.2l7.7-8.8L1.5 3h6.8l4.7 5.6L17.7 3Zm-1.2 16h1.8L6.9 4.9H5L16.5 19Z"/></svg>
    )},
  ];

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* noop */ }
  };

  const nativeShare = async () => {
    try { await navigator.share({ title: "AppHub", text: title, url }); setOpen(false); } catch { /* المستخدم قفل */ }
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2" dir="rtl">
      {open && (
        <div className="flex flex-col items-end gap-2 animate-fade-in">
          {typeof navigator !== "undefined" && "share" in navigator && (
            <button onClick={nativeShare} className="flex items-center gap-2 bg-navy-900 text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-lg hover:bg-navy-800 transition-colors">
              📤 مشاركة النظام
            </button>
          )}
          {targets.map(t => (
            <a key={t.label} href={t.href} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-white text-xs font-bold px-3.5 py-2 rounded-full shadow-lg hover:opacity-90 transition-opacity" style={{ background: t.bg }}>
              {t.icon} {t.label}
            </a>
          ))}
          <button onClick={copyLink} className="flex items-center gap-2 bg-white text-navy-900 text-xs font-bold px-3.5 py-2 rounded-full shadow-lg border border-navy-100 hover:bg-cream-100 transition-colors">
            {copied ? "✓ اتنسخ!" : "🔗 نسخ الرابط"}
          </button>
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="شارك AppHub مع صحابك"
        className="w-12 h-12 rounded-full bg-[#25D366] text-white shadow-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><path d="M6 6l12 12M18 6L6 18"/></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="#fff" className="w-6 h-6"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.94L2 22l5.2-1.5A9.9 9.9 0 1 0 12.04 2Zm5.77 14.06c-.24.68-1.4 1.3-1.93 1.35-.52.05-1.01.24-3.4-.7-2.87-1.14-4.7-4.06-4.84-4.25-.14-.19-1.16-1.55-1.16-2.95 0-1.4.74-2.09 1-2.38.26-.28.57-.35.76-.35h.55c.17 0 .41-.06.64.5.24.57.8 1.97.87 2.11.07.14.12.31.02.5-.1.19-.14.3-.28.47l-.43.5c-.14.14-.29.3-.12.58.16.28.73 1.2 1.57 1.95 1.08.96 1.99 1.26 2.27 1.4.28.14.45.12.61-.07l.87-1.01c.2-.28.38-.21.64-.12l1.7.8c.26.12.43.19.5.3.06.12.06.68-.18 1.36Z"/></svg>
        )}
      </button>
    </div>
  );
}

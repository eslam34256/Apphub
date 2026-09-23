"use client";

import { useEffect, useState } from "react";

/**
 * بطاقة «نزّل AppHub كتطبيق» — تظهر احترافياً:
 * - Android/Chrome: خلال التقاط beforeinstallprompt → زرار حقيقي يطلق التثبيت
 * - iOS: تلميح «مشاركة ← إضافة للشاشة الرئيسية» (أبل لا تتيح تثبيت تلقائي للـ PWA)
 * - مختفي تمامًا لو التطبيق أصلًا شغال standalone أو المستهلك رفض قبل كده (localStorage)
 */
export function InstallPrompt() {
  const [evt, setEvt] = useState<any>(null);
  const [iosHint, setIosHint] = useState(false);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // standalone فعلًا؟ → مفيش بطاقة
    const standalone = matchMedia("(display-mode: standalone)").matches || (navigator as any).standalone;
    const dismissed = localStorage.getItem("apphub-pwa-dismiss") === "1";
    if (standalone || dismissed) return;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      setEvt(e);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    // iOS: مفيش beforeinstallprompt — نظهر تلميح الإعداد اليدوي
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
    if (isIOS) setTimeout(() => { setIosHint(true); setShow(true); }, 2500);

    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  function dismiss() {
    localStorage.setItem("apphub-pwa-dismiss", "1");
    setShow(false);
  }

  async function install() {
    if (!evt) return;
    evt.prompt();
    const { outcome } = await evt.userChoice;
    if (outcome === "accepted") {
      localStorage.setItem("apphub-pwa-dismiss", "1");
      setShow(false);
    }
    setEvt(null);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:left-4 sm:max-w-sm z-50 animate-fade-in">
      <div className="rounded-3xl gradient-brand p-5 text-white shadow-lg space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon-192.png" alt="" className="h-11 w-11 rounded-2xl" />
            <div>
              <p className="font-extrabold">📲 نزّل AppHub كتطبيق</p>
              <p className="text-xs text-white/75">أيقونة على شاشتك · يفتح بلا متصفح · أسرع في الرادارات</p>
            </div>
          </div>
          <button onClick={dismiss} aria-label="إخفاء" className="rounded-full bg-white/15 px-2.5 py-1 text-sm hover:bg-white/25">✕</button>
        </div>
        {iosHint ? (
          <p className="text-xs text-white/85 bg-white/10 rounded-xl px-3 py-2">
            على iOS: اضغط <strong>زرار المشاركة</strong> (السهم فوق) وبعدين <strong>«إضافة إلى الشاشة الرئيسية»</strong> — وهتتثبت تلقائي.
          </p>
        ) : (
          <button
            onClick={install}
            className="w-full rounded-full bg-accent-400 px-5 py-2.5 text-sm font-bold text-brand-900 hover:bg-accent-500 transition"
          >
            ثبّته دلوقتي — مجانًا
          </button>
        )}
      </div>
    </div>
  );
}

"use client";

type Props = {
  googlePlay?: string;
  appStore?: string;
  website?: string;
  appName: string;
};

export function AppStoreButtons({ googlePlay, appStore, website, appName }: Props) {
  // إذا مفيش روابط، استخدم Google Search
  const defaultGoogleSearch = `https://www.google.com/search?q=${encodeURIComponent(appName + ' app')}`;
  
  function handleOpenApp() {
    // اكتشف نوع الجهاز
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    if (isIOS && appStore) {
      window.open(appStore, "_blank");
    } else if (isAndroid && googlePlay) {
      window.open(googlePlay, "_blank");
    } else if (website) {
      window.open(website, "_blank");
    } else if (googlePlay) {
      window.open(googlePlay, "_blank");
    } else if (appStore) {
      window.open(appStore, "_blank");
    } else {
      window.open(defaultGoogleSearch, "_blank");
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleOpenApp}
        className="w-full btn-primary justify-center !py-4"
      >
        <span>📲</span>
        <span>افتح التطبيق</span>
      </button>

      <div className="grid grid-cols-2 gap-3">
        {googlePlay && (
          <a
            href={googlePlay}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-charcoal-900 text-white px-4 py-3 hover:bg-charcoal-800 transition"
          >
            <span className="text-xl">▶️</span>
            <div className="text-right">
              <p className="text-[10px] opacity-70">حمّل من</p>
              <p className="text-sm font-bold">Google Play</p>
            </div>
          </a>
        )}

        {appStore && (
          <a
            href={appStore}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-lg bg-charcoal-900 text-white px-4 py-3 hover:bg-charcoal-800 transition"
          >
            <span className="text-xl">🍎</span>
            <div className="text-right">
              <p className="text-[10px] opacity-70">حمّل من</p>
              <p className="text-sm font-bold">App Store</p>
            </div>
          </a>
        )}
      </div>

      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-cream-100 text-brand-900 px-4 py-3 hover:bg-cream-200 transition font-bold"
        >
          <span>🌐</span>
          <span>زيارة الموقع</span>
        </a>
      )}
    </div>
  );
}
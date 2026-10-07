"use client";

import { affiliateLinks } from "@/lib/affiliate";
import { TrackedAffiliateLink } from "@/components/tracked-affiliate-link";

type Props = {
  googlePlay?: string;
  appStore?: string;
  website?: string;
  appName: string;
  slug?: string;
};

/** v38: كل فتحة خارجية متتبعة (store_click) + CTA أفيليات حقيقي لو الشبكة معتمدة */
export function AppStoreButtons({ googlePlay, appStore, website, appName, slug }: Props) {
  // إذا مفيش روابط، استخدم Google Search
  const defaultGoogleSearch = `https://www.google.com/search?q=${encodeURIComponent(appName + ' app')}`;
  const aff = slug ? affiliateLinks[slug] : undefined;

  function track(target: string) {
    try {
      navigator.sendBeacon("/api/track", JSON.stringify({ event: "store_click", target }));
    } catch { /* التتبع مايكسرش التجربة أبدًا */ }
  }

  function handleOpenApp() {
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    let url = defaultGoogleSearch, kind = "search";
    if (isIOS && appStore) { url = appStore; kind = "appstore"; }
    else if (isAndroid && googlePlay) { url = googlePlay; kind = "play"; }
    else if (website) { url = website; kind = "web"; }
    else if (googlePlay) { url = googlePlay; kind = "play"; }
    else if (appStore) { url = appStore; kind = "appstore"; }
    track(`app:${slug ?? appName}:${kind}`);
    window.open(url, "_blank");
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
            onClick={() => track(`app:${slug ?? appName}:play`)}
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
            onClick={() => track(`app:${slug ?? appName}:appstore`)}
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
          onClick={() => track(`app:${slug ?? appName}:web`)}
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-cream-100 text-brand-900 px-4 py-3 hover:bg-cream-200 transition font-bold"
        >
          <span>🌐</span>
          <span>زيارة الموقع</span>
        </a>
      )}

      {aff && (
        <div className="pt-1">
          <TrackedAffiliateLink target={`app:${slug}:affiliate`} url={aff.url} label="🛒 اشترك من رابطنا" />
        </div>
      )}
    </div>
  );
}

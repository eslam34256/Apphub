import type { Metadata } from "next";
import { DealsView } from "@/components/deals-view";

export const metadata: Metadata = {
  title: "العروض والخصومات — كوبونات شغالة",
  description:
    "أحدث العروض وكوبونات الخصم للتطبيقات والمتاجر في مصر والسعودية والإمارات — العروض الصالحة فقط، منتهية الصلاحية بتتخفي أوتوماتيك.",
  alternates: { canonical: "https://apphub-eight.vercel.app/deals" }
};

export default function DealsPage() {
  return <DealsView />;
}

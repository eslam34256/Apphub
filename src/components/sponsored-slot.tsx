import { createClient } from "@/lib/supabase/server";
import { SponsoredSlotClient } from "./sponsored-slot-client";

/**
 * خانة «إعلان برعاية» — بتقرا أول خانة نشطة بترتيب الأولوية:
 * عين مكان محدد أولاً ثم عام (best:*). بدون خانة تختفي تماماً.
 * أي إعلان ظاهر بشارة «إعلان» صريحة — محتوى الرصد والتقييم غير قابل للشراء.
 */
export async function SponsoredSlot({ placement }: { placement: string }) {
  try {
    const supabase = createClient();
    const { data } = await supabase
      .from("sponsored_slots")
      .select("id, brand, text, url, placement")
      .eq("active", true)
      .or(`placement.eq.${placement},placement.eq.best:*`)
      .order("priority", { ascending: false })
      .limit(1);

    const slot = (data ?? [])[0];
    if (!slot) return null;

    return (
      <div className="mb-6 rounded-2xl border border-dashed border-accent-400 bg-white p-4 shadow-sm">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded-full bg-charcoal-100 px-2.5 py-0.5 text-[10px] font-bold text-charcoal-500 tracking-wider">
            إعلان
          </span>
          <span className="text-xs font-bold text-charcoal-500">{slot.brand}</span>
        </div>
        <p className="mb-3 text-sm text-brand-900">{slot.text}</p>
        <SponsoredSlotClient slotId={slot.id} url={slot.url} />
      </div>
    );
  } catch {
    return null;
  }
}

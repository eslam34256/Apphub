import { DealItem } from "@/lib/types";

/**
 * ⚠️ بيانات تجريبية — العروض الحقيقية بيجيبها النظام من قاعدة البيانات.
 * الحفاظ على فريشة الملف ده دور على الأدمن (أو يتستبدل بسيدر تلقائي).
 * العروض المنتهية دلوقتي بتترحل لأرشيف منفصل أوتوماتيك في الصفحة.
 */
export const deals: DealItem[] = [
  { id:"d1", title:"خصم 30% على أول طلب", brand:"طلبات", category:"food", discount:30, views:1420, expiresAt:"2026-12-31", code:"APPHUB30" },
  { id:"d2", title:"خصم 20% على سماعات وتكنولوجيا — عروض الجمعة البيضاء", brand:"Amazon", category:"tech", discount:20, views:1940, expiresAt:"2026-11-11" },
  { id:"d3", title:"خصم 15% على منتجات العناية", brand:"Noon", category:"beauty", discount:15, views:880, expiresAt:"2026-10-10", code:"CARE15" },
  { id:"d4", title:"خصم 25% على أول رحلة", brand:"Careem", category:"food", discount:25, views:1020, expiresAt:"2026-09-25", code:"RIDE25" },
  { id:"d5", title:"خصم 40% على الأزياء المختارة", brand:"Noon", category:"fashion", discount:40, views:2110, expiresAt:"2026-09-22" },
  { id:"d6", title:"خصم 10% على الإلكترونيات", brand:"جرير", category:"tech", discount:10, views:640, expiresAt:"2026-08-30" }
];
// ملحوظة أفيليات: لما شبكة العمولة approve تحط الـ affiliateUrl في أي deal —
// الشارة والتتبع بيظهروا لوحدهم. ممنوع روابط مختلقة.

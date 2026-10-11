/**
 * محرك استخراج والتحقق من الأسعار — منطق نقي قابل للاختبار.
 * مبادئ الحذر: أي شك = لا نشر. (المصداقية قبل الأتمتة)
 */

/** استخراج السعر: أول capture group = الرقم. بيرجّع null لو مفيش لقطة واثقة. */
export function extractPrice(html: string, pattern: string): number | null {
  let matches: RegExpExecArray | null;
  try {
    const re = new RegExp(pattern, "i");
    matches = re.exec(html);
  } catch {
    return null; // ريجيكس مكتوب غلط في إعدادات المراقبة
  }
  if (!matches || !matches[1]) return null;

  const cleaned = matches[1].replace(/[,\s]/g, "");
  const value = parseFloat(cleaned);
  if (!isFinite(value) || value <= 0 || value > 100000) return null;
  return value;
}

/** فحص المنطقية: التغيّر جوه نطاق مقبول (0.3x – 3x) من القديم؟ */
export function isSanePrice(oldPrice: number, newPrice: number): boolean {
  const ratio = newPrice / oldPrice;
  return ratio >= 0.3 && ratio <= 3 && newPrice !== oldPrice;
}

/** التغيّر فعلي؟ (نتجاهل فروق الكسور الطفيفة/ضجيج الأرقام) */
export function hasRealChange(oldPrice: number, newPrice: number): boolean {
  return Math.abs(newPrice - oldPrice) >= 0.01;
}

"use client";
import { useEffect, useState } from "react";
import { createReview, getReviewsForApp } from "@/lib/api";
import { createClient } from "@/lib/supabase/client";
import { ReviewItem } from "@/lib/types";
import { POINTS } from "@/lib/points";
export function ReviewsSection({ appSlug }: { appSlug: string }) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string|null>(null);
  const [user, setUser] = useState<{id:string;name:string}|null>(null);
  useEffect(() => {
    async function load() {
      try { const data = await getReviewsForApp(appSlug); setReviews(data); } catch {}
      const supabase = createClient();
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user) setUser({ id: authData.user.id, name: (authData.user.user_metadata as any)?.full_name ?? authData.user.email ?? "مستخدم" });
    }
    load();
  }, [appSlug]);
  async function handleSubmit() {
    if (!user) { setMessage("لازم تسجل دخول أول"); return; }
    if (!comment.trim()) return;
    setLoading(true); setMessage(null);
    try {
      await createReview({ appSlug, userId: user.id, userName: user.name, rating, comment });
      setComment("");
      const data = await getReviewsForApp(appSlug);
      setReviews(data);
      setMessage(`تم إضافة المراجعة +${POINTS.REVIEW} نقطة`);
    } catch (err: any) { setMessage(err.message ?? "حصل خطأ"); }
    finally { setLoading(false); }
  }
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-xl font-bold">التعليقات والتقييمات</h2>
        <div className="space-y-3">
          <select className="rounded-2xl border px-4 py-3" value={rating} onChange={e => setRating(Number(e.target.value))}>
            <option value={5}>⭐⭐⭐⭐⭐</option><option value={4}>⭐⭐⭐⭐</option>
            <option value={3}>⭐⭐⭐</option><option value={2}>⭐⭐</option><option value={1}>⭐</option>
          </select>
          <textarea className="w-full rounded-2xl border px-4 py-3" rows={3} placeholder="شاركنا رأيك..." value={comment} onChange={e => setComment(e.target.value)} />
          <button disabled={loading} onClick={handleSubmit} className="rounded-2xl bg-brand-600 px-4 py-3 font-bold text-white disabled:opacity-60">{loading ? "جاري الإضافة..." : "أضف مراجعة"}</button>
          {message && <p className="rounded-xl bg-slate-50 px-4 py-3 text-slate-700">{message}</p>}
        </div>
      </div>
      <div className="space-y-3">
        {reviews.map(review => (
          <div key={review.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-bold">{review.user_name}</p>
              <span className="text-sm text-amber-600">{"⭐".repeat(review.rating)}</span>
            </div>
            <p className="text-slate-700">{review.comment}</p>
            <p className="mt-2 text-xs text-slate-400">{new Date(review.created_at).toLocaleDateString("ar-EG")}</p>
          </div>
        ))}
        {!reviews.length && <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-slate-500">مفيش مراجعات لسه</div>}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Comment = {
  id: string;
  user_name: string;
  user_avatar?: string;
  content: string;
  likes_count: number;
  created_at: string;
  user_liked?: boolean;
};

export function CommentsSection({ appSlug }: { appSlug: string }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
    loadUser();
  }, [appSlug]);

  async function loadUser() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }

  async function loadComments() {
    const supabase = createClient();
    const { data } = await supabase
      .from("comments")
      .select("*")
      .eq("app_slug", appSlug)
      .order("likes_count", { ascending: false })
      .order("created_at", { ascending: false });

    if (data && user) {
      const { data: likes } = await supabase
        .from("comment_likes")
        .select("comment_id")
        .eq("user_id", user.id);

      const likedIds = new Set(likes?.map((l) => l.comment_id) ?? []);
      setComments(data.map((c: any) => ({ ...c, user_liked: likedIds.has(c.id) })));
    } else {
      setComments(data ?? []);
    }
  }

  async function handleAddComment() {
    if (!user || !newComment.trim()) return;
    setLoading(true);

    const supabase = createClient();
    const userName = user.user_metadata?.full_name || user.email?.split("@")[0] || "مستخدم";

    const { error } = await supabase.from("comments").insert({
      app_slug: appSlug,
      user_id: user.id,
      user_name: userName,
      content: newComment.trim()
    });

    if (!error) {
      setNewComment("");
      loadComments();
    }
    setLoading(false);
  }

  async function handleToggleLike(commentId: string, currentlyLiked: boolean) {
    if (!user) return;
    const supabase = createClient();

    if (currentlyLiked) {
      await supabase
        .from("comment_likes")
        .delete()
        .eq("comment_id", commentId)
        .eq("user_id", user.id);
    } else {
      await supabase.from("comment_likes").insert({
        comment_id: commentId,
        user_id: user.id
      });
    }

    loadComments();
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-bold">💬 التعليقات ({comments.length})</h2>

      {user ? (
        <div className="mb-6 space-y-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="شارك رأيك في التطبيق..."
            rows={3}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3"
          />
          <button
            onClick={handleAddComment}
            disabled={loading || !newComment.trim()}
            className="rounded-2xl bg-brand-600 px-5 py-2 font-bold text-white disabled:opacity-60"
          >
            {loading ? "جاري النشر..." : "أضف تعليق"}
          </button>
        </div>
      ) : (
        <div className="mb-6 rounded-2xl bg-slate-50 p-4 text-center">
          <p className="text-slate-600">سجّل دخول عشان تشارك رأيك</p>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-center text-slate-500 py-8">
            مفيش تعليقات لسه — كن أول واحد يشارك رأيه! 💭
          </p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 font-bold text-brand-700">
                    {comment.user_name?.[0] || "م"}
                  </div>
                  <div>
                    <p className="font-bold">{comment.user_name}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(comment.created_at).toLocaleDateString("ar-EG")}
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-slate-700">{comment.content}</p>

              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={() => handleToggleLike(comment.id, !!comment.user_liked)}
                  disabled={!user}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm transition ${
                    comment.user_liked
                      ? "bg-rose-100 text-rose-700"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {comment.user_liked ? "❤️" : "🤍"} {comment.likes_count}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

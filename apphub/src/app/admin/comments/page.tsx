import { createClient } from "@/lib/supabase/server";
import { DeleteCommentButton } from "@/components/admin/delete-comment-button";

export default async function AdminCommentsPage() {
  const supabase = createClient();
  const { data: comments } = await supabase
    .from("comments")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold">💬 إدارة التعليقات</h1>

      <div className="space-y-3">
        {(comments ?? []).map((comment: any) => (
          <div key={comment.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-bold">{comment.user_name}</span>
                  <span className="text-xs text-slate-500">
                    على: {comment.app_slug}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(comment.created_at).toLocaleDateString("ar-EG")}
                  </span>
                </div>
                <p className="text-slate-700">{comment.content}</p>
                <p className="mt-2 text-xs text-slate-500">
                  ❤️ {comment.likes_count} إعجاب
                </p>
              </div>
              <DeleteCommentButton commentId={comment.id} />
            </div>
          </div>
        ))}

        {(!comments || comments.length === 0) && (
          <div className="rounded-3xl border border-dashed p-12 text-center text-slate-500">
            مفيش تعليقات لسه
          </div>
        )}
      </div>
    </div>
  );
}
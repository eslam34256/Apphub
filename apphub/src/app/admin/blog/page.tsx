import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminBlogPage() {
  const supabase = createClient();
  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold">📝 إدارة المدونة</h1>
        <Link
          href="/admin/blog/new"
          className="rounded-2xl bg-brand-600 px-5 py-2 font-bold text-white"
        >
          + مقال جديد
        </Link>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {posts && posts.length > 0 ? (
          <div className="space-y-3">
            {posts.map((post: any) => (
              <div key={post.id} className="flex items-center justify-between border-b py-3">
                <div>
                  <h3 className="font-bold">{post.title}</h3>
                  <p className="text-xs text-slate-500">{post.slug}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs ${
                  post.published ? "bg-emerald-100 text-emerald-700" : "bg-slate-100"
                }`}>
                  {post.published ? "منشور" : "مسودة"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 py-8">مفيش مقالات لسه</p>
        )}
      </div>
    </div>
  );
}
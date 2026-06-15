import Link from "next/link";
import { BlogPost } from "@/data/blog-posts";
export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-3 flex flex-wrap gap-2">
        {post.tags.slice(0,3).map(tag => <span key={tag} className="rounded-full bg-brand-50 px-3 py-1 text-xs text-brand-600">{tag}</span>)}
      </div>
      <h2 className="mb-2 text-lg font-bold text-slate-900">{post.title}</h2>
      <p className="mb-4 text-sm text-slate-600">{post.excerpt}</p>
      <div className="mb-4 flex items-center justify-between text-xs text-slate-400">
        <span>{post.author}</span>
        <span>{new Date(post.createdAt).toLocaleDateString("ar-EG")}</span>
      </div>
      <Link href={`/blog/${post.slug}`} className="inline-block rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500">اقرأ المقال</Link>
    </div>
  );
}

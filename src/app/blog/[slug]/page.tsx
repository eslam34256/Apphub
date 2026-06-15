import { notFound } from "next/navigation";
import { blogPosts } from "@/data/blog-posts";
import { buildMeta } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
type Props = { params: { slug: string } };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = blogPosts.find(p => p.slug === params.slug);
  if (!post) return {};
  return buildMeta({ title: post.title, description: post.excerpt, url: `https://apphub.eg/blog/${post.slug}`, keywords: post.tags });
}
export async function generateStaticParams() { return blogPosts.map(p => ({ slug: p.slug })); }
export default function BlogPostPage({ params }: Props) {
  const post = blogPosts.find(p => p.slug === params.slug);
  if (!post || !post.published) return notFound();
  const related = blogPosts.filter(p => p.published && p.id !== post.id && p.tags.some(t => post.tags.includes(t))).slice(0,3);
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-4 flex flex-wrap gap-2">{post.tags.map(tag => <span key={tag} className="rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-600">{tag}</span>)}</div>
        <h1 className="mb-2 text-3xl font-extrabold">{post.title}</h1>
        <p className="mb-4 text-slate-500">{post.author} — {new Date(post.createdAt).toLocaleDateString("ar-EG")}</p>
        <p className="mb-6 text-lg text-slate-600">{post.excerpt}</p>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <article className="space-y-3">
          {post.content.split("\n").map((line, i) => {
            const t = line.trim();
            if (!t) return null;
            if (t.startsWith("## ")) return <h2 key={i} className="mt-6 text-2xl font-bold">{t.replace("## ","")}</h2>;
            if (t.startsWith("### ")) return <h3 key={i} className="mt-4 text-xl font-bold">{t.replace("### ","")}</h3>;
            if (t.startsWith("- ")) return <li key={i} className="mr-4 list-disc text-slate-700">{t.replace("- ","")}</li>;
            if (t.startsWith("**") && t.endsWith("**")) return <p key={i} className="font-bold">{t.replace(/\*\*/g,"")}</p>;
            return <p key={i} className="text-slate-700">{t}</p>;
          })}
        </article>
      </div>
      {related.length > 0 && (
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-bold">مقالات ذات صلة</h2>
          <div className="space-y-3">
            {related.map(r => (
              <Link key={r.id} href={`/blog/${r.slug}`} className="block rounded-2xl border border-slate-200 p-4 hover:border-brand-300">
                <h3 className="font-bold">{r.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{r.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
      <Link href="/blog" className="block text-brand-600">← الرجوع للمدونة</Link>
    </div>
  );
}

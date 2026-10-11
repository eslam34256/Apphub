import { blogPosts } from "@/data/blog-posts";
import { buildMeta } from "@/lib/seo";
import { BlogCard } from "@/components/blog-card";
import type { Metadata } from "next";
export const metadata: Metadata = buildMeta({ title:"المدونة", description:"مقالات ونصايح عن أفضل التطبيقات والعروض", url:"https://apphub.eg/blog", keywords:["مقالات","تطبيقات","نصايح"] });
export default function BlogPage() {
  const published = blogPosts.filter(p => p.published);
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-gradient-to-l from-brand-600 to-slate-900 p-8 text-white">
        <h1 className="text-3xl font-extrabold">المدونة</h1>
        <p className="mt-2 text-white/80">مقالات ونصايح عن أفضل التطبيقات والعروض</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {published.map(post => <BlogCard key={post.id} post={post} />)}
      </div>
    </div>
  );
}

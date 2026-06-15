import { businessStacks } from "@/data/business";
export default function BusinessPage() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-slate-900 p-8 text-white">
        <p className="mb-2 text-sm text-white/70">AppHub for Business</p>
        <h1 className="text-3xl font-extrabold">أفضل Stack جاهز لكل نوع بيزنس</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {businessStacks.map(stack => (
          <div key={stack.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-2 text-xl font-bold">{stack.title}</h2>
            <p className="mb-4 text-slate-500">{stack.description}</p>
            <ul className="space-y-2">{stack.apps.map(app => <li key={app} className="rounded-xl bg-slate-50 px-4 py-3 text-slate-700">{app}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="skeleton h-32 rounded-3xl"></div>
      <div className="grid gap-4 md:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton h-32 rounded-2xl"></div>
        ))}
      </div>
      <div className="skeleton h-96 rounded-3xl"></div>
    </div>
  );
}
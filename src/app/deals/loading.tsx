export default function DealsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="skeleton h-48 rounded-3xl"></div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="skeleton h-48 rounded-2xl"></div>
        ))}
      </div>
    </div>
  );
}
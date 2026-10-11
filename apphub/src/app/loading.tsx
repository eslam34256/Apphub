export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="skeleton h-64 rounded-3xl"></div>
      <div className="grid gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton h-32 rounded-2xl"></div>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="skeleton h-64 rounded-2xl"></div>
        ))}
      </div>
    </div>
  );
}
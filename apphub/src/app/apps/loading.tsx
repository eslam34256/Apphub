export default function AppsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="skeleton h-32 rounded-3xl"></div>
      
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
        {[...Array(15)].map((_, i) => (
          <div key={i} className="skeleton h-32 rounded-2xl"></div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton h-64 rounded-2xl"></div>
        ))}
      </div>
    </div>
  );
}
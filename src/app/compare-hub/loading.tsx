export default function CompareLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="skeleton h-48 rounded-3xl"></div>
      <div className="skeleton h-32 rounded-3xl"></div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton h-24 rounded-2xl"></div>
        ))}
      </div>
    </div>
  );
}
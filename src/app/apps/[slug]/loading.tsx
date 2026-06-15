export default function AppLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="skeleton h-64 rounded-3xl"></div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="skeleton h-80 rounded-3xl"></div>
        <div className="skeleton h-80 rounded-3xl"></div>
      </div>
      <div className="skeleton h-64 rounded-3xl"></div>
    </div>
  );
}
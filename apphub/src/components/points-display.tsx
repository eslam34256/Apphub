export function PointsDisplay({ points }: { points: number }) {
  return <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-amber-800">🏆 {points} نقطة</div>;
}

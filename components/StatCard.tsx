export function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <h3 className="text-slate-400">{label}</h3>
      <p className="text-4xl font-bold mt-3">{value}</p>
    </div>
  );
}
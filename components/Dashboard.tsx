import { Plus } from "lucide-react";
import { StatCard } from "./StatCard";

export function Dashboard({
  cardCount,
  onAddCard,
}: {
  cardCount: number;
  onAddCard: () => void;
}) {
  return (
    <>
      <h2 className="text-5xl font-bold">Welcome back, Trainer!</h2>
      <p className="text-slate-400 mt-3 text-lg">
        Your collection command center.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mt-10">
        <StatCard label="Cards" value={String(cardCount)} />
        <StatCard label="Binders" value="0" />
        <StatCard label="Wishlist" value="0" />
        <StatCard label="Swirls" value="0" />
      </div>

      <button
        onClick={onAddCard}
        className="mt-10 bg-yellow-400 text-slate-950 font-bold px-6 py-3 rounded-xl hover:bg-yellow-300 transition flex items-center gap-2"
      >
        <Plus size={20} />
        Add Card
      </button>
    </>
  );
}
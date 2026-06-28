import type { View } from "@/types/card";

const navItems: { id: View; label: string }[] = [
  { id: "dashboard", label: "🏠 Dashboard" },
  { id: "collection", label: "🎴 Collection" },
  { id: "binder", label: "📖 Binder" },
  { id: "inspection", label: "🔍 Inspection Lab" },
  { id: "wishlist", label: "⭐ Wishlist" },
  { id: "analytics", label: "📈 Analytics" },
  { id: "settings", label: "⚙ Settings" },
];

export function Sidebar({
  view,
  setView,
}: {
  view: View;
  setView: (view: View) => void;
}) {
  return (
    <aside className="w-72 bg-slate-900 border-r border-slate-800 p-6">
      <h1 className="text-3xl font-bold mb-10">⚡ Pokémon Vault</h1>

      <nav className="space-y-3">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            className={`w-full text-left p-3 rounded-lg transition ${
              view === item.id
                ? "bg-yellow-400 text-slate-950 font-bold"
                : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
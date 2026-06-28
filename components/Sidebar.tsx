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
    <>
      <aside className="hidden lg:block w-72 bg-slate-900 border-r border-slate-800 p-6">
        <h1 className="text-3xl font-bold mb-10">⚡ Pokémon Vault</h1>

        <nav className="space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full text-left p-3 rounded-lg transition ${
                view === item.id
                  ? "bg-emerald-400 text-slate-950 font-bold"
                  : "hover:bg-slate-800 text-slate-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur border-t border-slate-800 px-4 py-3">
        <div className="grid grid-cols-5 gap-2">
          {navItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`text-xs rounded-2xl py-3 ${
                view === item.id
                  ? "bg-emerald-400 text-slate-950 font-bold"
                  : "bg-slate-900 text-slate-300"
              }`}
            >
              <div className="text-lg">{item.label.split(" ")[0]}</div>
              <div>{item.label.replace(item.label.split(" ")[0], "").trim()}</div>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}
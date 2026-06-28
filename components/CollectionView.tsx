"use client";

import { Plus } from "lucide-react";
import type { CardCopy } from "@/types/card";
import { CardEditor } from "./CardEditor";

export function CollectionView({
  cards,
  selectedCard,
  selectedId,
  setSelectedId,
  addCard,
  updateCard,
  deleteCard,
}: {
  cards: CardCopy[];
  selectedCard?: CardCopy;
  selectedId: string;
  setSelectedId: (id: string) => void;
  addCard: () => void;
  updateCard: (id: string, patch: Partial<CardCopy>) => void;
  deleteCard: (id: string) => void;
}) {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-5xl font-bold">My Collection</h2>
          <p className="text-slate-400 mt-3 text-lg">
            Add and manage individual physical card copies.
          </p>
        </div>

        <button
          onClick={addCard}
          className="bg-yellow-400 text-slate-950 font-bold px-5 py-3 rounded-xl hover:bg-yellow-300 transition flex items-center gap-2"
        >
          <Plus size={20} /> Add Card
        </button>
      </div>

      <div className="grid grid-cols-[360px_1fr] gap-8">
        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
          <h3 className="text-xl font-bold mb-4">Cards</h3>

          {cards.length === 0 && (
            <p className="text-slate-400">No cards yet. Click Add Card.</p>
          )}

          <div className="space-y-3">
            {cards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedId(card.id)}
                className={`w-full text-left p-4 rounded-xl border transition ${
                  selectedId === card.id
                    ? "bg-yellow-400 text-slate-950 border-yellow-300"
                    : "bg-slate-950 border-slate-800 hover:bg-slate-800"
                }`}
              >
                <div className="font-bold">{card.name || "Unnamed Card"}</div>
                <div className="text-sm opacity-80">{card.id}</div>
                <div className="text-sm opacity-80">
                  {card.setName || "No set"} {card.number}
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          {!selectedCard ? (
            <p className="text-slate-400">Select a card or add a new one.</p>
          ) : (
            <CardEditor
              card={selectedCard}
              updateCard={updateCard}
              deleteCard={deleteCard}
            />
          )}
        </section>
      </div>
    </div>
  );
}
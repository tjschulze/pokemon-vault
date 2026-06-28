"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { CardCopy, View } from "@/types/card";
import { Sidebar } from "@/components/Sidebar";
import { Dashboard } from "@/components/Dashboard";
import { CollectionView } from "@/components/CollectionView";

function nextId(cards: CardCopy[]) {
  const max = cards
    .map((card) => Number(card.id.replace(/\D/g, "")))
    .filter(Boolean)
    .reduce((a, b) => Math.max(a, b), 0);

  return `PKV-${String(max + 1).padStart(6, "0")}`;
}

export default function Home() {
  const [view, setView] = useState<View>("dashboard");
  const [cards, setCards] = useState<CardCopy[]>([]);
  const [selectedId, setSelectedId] = useState("");

  const selectedCard = cards.find((card) => card.id === selectedId);

  useEffect(() => {
    loadCards();
  }, []);

  async function loadCards() {
    const { data, error } = await supabase
      .from("cards")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    const loadedCards: CardCopy[] = (data ?? []).map((row) => ({
      id: row.id,
      name: row.name ?? "",
      setName: row.set_name ?? "",
      number: row.number ?? "",
      rarity: row.rarity ?? "",
      condition: row.condition ?? "",
      imageUrl: row.image_url ?? "",
      notes: row.notes ?? "",
    }));

    setCards(loadedCards);
    setSelectedId(loadedCards[0]?.id ?? "");
  }

  async function addCard() {
    const newCard: CardCopy = {
      id: nextId(cards),
      name: "",
      setName: "",
      number: "",
      rarity: "",
      condition: "",
      imageUrl: "",
      notes: "",
    };

    const { error } = await supabase.from("cards").insert({
      id: newCard.id,
      name: newCard.name,
      set_name: newCard.setName,
      number: newCard.number,
      rarity: newCard.rarity,
      condition: newCard.condition,
      image_url: newCard.imageUrl,
      notes: newCard.notes,
    });

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    setCards([newCard, ...cards]);
    setSelectedId(newCard.id);
    setView("collection");
  }

  async function updateCard(id: string, patch: Partial<CardCopy>) {
    const currentCard = cards.find((card) => card.id === id);
    if (!currentCard) return;

    const updatedCard = { ...currentCard, ...patch };

    setCards(cards.map((card) => (card.id === id ? updatedCard : card)));

    const { error } = await supabase
      .from("cards")
      .update({
        name: updatedCard.name,
        set_name: updatedCard.setName,
        number: updatedCard.number,
        rarity: updatedCard.rarity,
        condition: updatedCard.condition,
        image_url: updatedCard.imageUrl,
        notes: updatedCard.notes,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert(error.message);
    }
  }

  async function deleteCard(id: string) {
    if (!confirm("Delete this card?")) return;

    const { error } = await supabase.from("cards").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    const remaining = cards.filter((card) => card.id !== id);
    setCards(remaining);
    setSelectedId(remaining[0]?.id ?? "");
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex pb-24 lg:pb-0">
      <Sidebar view={view} setView={setView} />

      <section className="flex-1 p-4 sm:p-6 lg:p-10">
        {view === "dashboard" && (
          <Dashboard cardCount={cards.length} onAddCard={addCard} />
        )}

        {view === "collection" && (
          <CollectionView
            cards={cards}
            selectedCard={selectedCard}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            addCard={addCard}
            updateCard={updateCard}
            deleteCard={deleteCard}
          />
        )}

        {view !== "dashboard" && view !== "collection" && (
          <Placeholder title={view} />
        )}
      </section>
    </main>
  );
}

function Placeholder({ title }: { title: string }) {
  return (
    <div>
      <h2 className="text-5xl font-bold capitalize">{title}</h2>
      <p className="text-slate-400 mt-3 text-lg">
        This section is ready to build next.
      </p>
    </div>
  );
}
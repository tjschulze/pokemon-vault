"use client";

import { useState } from "react";
import { Camera, Save, Trash2 } from "lucide-react";
import type { CardCopy } from "@/types/card";
import { supabase } from "@/lib/supabase";

export function CardEditor({
  card,
  updateCard,
  deleteCard,
}: {
  card: CardCopy;
  updateCard: (id: string, patch: Partial<CardCopy>) => void;
  deleteCard: (id: string) => void;
}) {
  const [lookupLoading, setLookupLoading] = useState(false);

  async function autoFillCard() {
    const queryParts = [];

    if (card.name.trim()) queryParts.push(`name:"${card.name.trim()}*"`);
    if (card.number.trim()) queryParts.push(`number:${card.number.trim()}`);

    if (!queryParts.length) {
      alert("Enter at least a card name or number first.");
      return;
    }

    setLookupLoading(true);

    try {
      const query = encodeURIComponent(queryParts.join(" "));
      const response = await fetch(
        `https://api.pokemontcg.io/v2/cards?q=${query}&pageSize=1`
      );

      const result = await response.json();
      const found = result.data?.[0];

      if (!found) {
        alert("No matching card found.");
        return;
      }

      updateCard(card.id, {
        name: found.name ?? card.name,
        setName: found.set?.name ?? card.setName,
        number: found.number ?? card.number,
        rarity: found.rarity ?? card.rarity,
        imageUrl: found.images?.large ?? found.images?.small ?? card.imageUrl,
      });
    } finally {
      setLookupLoading(false);
    }
  }

   async function handleImageUpload(file?: File) {
       if (!file) return;

      const fileExt = file.name.split(".").pop() || "jpg";
      const filePath = `${card.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("card-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) {
        console.error(uploadError);
        alert(uploadError.message);
        return;
      }

      const { data } = supabase.storage
        .from("card-images")
        .getPublicUrl(filePath);

      updateCard(card.id, { imageUrl: data.publicUrl });
   }

  return (
    <div>
      <div className="flex justify-between items-start gap-4 mb-6">
        <div>
          <h3 className="text-2xl font-bold">Card Details</h3>
          <p className="text-slate-400">
            Unique physical ID:{" "}
            <span className="font-mono text-yellow-300">{card.id}</span>
          </p>
        </div>

        <button
          onClick={() => deleteCard(card.id)}
          className="bg-red-500/20 text-red-300 border border-red-500/40 px-4 py-2 rounded-xl hover:bg-red-500/30 flex items-center gap-2"
        >
          <Trash2 size={18} /> Delete
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6 lg:gap-8">
        <div>
          <div className="max-w-[320px] mx-auto lg:mx-0 aspect-[2.5/3.5] bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden flex items-center justify-center">
            {card.imageUrl ? (
              <img src={card.imageUrl} alt={card.nsame} className="w-full h-full object-cover" />
            ) : (
              <span className="text-slate-500">No image</span>
            )}
          </div>

          <label className="mt-4 bg-slate-800 hover:bg-slate-700 rounded-xl px-4 py-3 flex items-center justify-center gap-2 cursor-pointer">
            <Camera size={18} /> Upload / Take Photo
            <input
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files?.[0])}
            />
          </label>

          <button
            onClick={autoFillCard}
            disabled={lookupLoading}
            className="mt-3 w-full bg-yellow-400 text-slate-950 font-bold px-4 py-3 rounded-xl hover:bg-yellow-300 disabled:opacity-50"
          >
            {lookupLoading ? "Searching..." : "Auto-Fill Card Data"}
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <Field label="Card Name" value={card.name} onChange={(v) => updateCard(card.id, { name: v })} />
          <Field label="Set / Expansion" value={card.setName} onChange={(v) => updateCard(card.id, { setName: v })} />
          <Field label="Card Number" value={card.number} onChange={(v) => updateCard(card.id, { number: v })} />
          <Field label="Rarity" value={card.rarity} onChange={(v) => updateCard(card.id, { rarity: v })} />
          <Field label="Condition" value={card.condition} onChange={(v) => updateCard(card.id, { condition: v })} />

          <label className="col-span-2">
            <span className="text-sm text-slate-400">Notes</span>
            <textarea
              value={card.notes}
              onChange={(e) => updateCard(card.id, { notes: e.target.value })}
              className="mt-1 w-full min-h-32 bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-yellow-400"
            />
          </label>

          <div className="col-span-2 flex items-center gap-2 text-slate-400">
            <Save size={18} /> Saves to Supabase.
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="text-sm text-slate-400">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 outline-none focus:border-yellow-400"
      />
    </label>
  );
}
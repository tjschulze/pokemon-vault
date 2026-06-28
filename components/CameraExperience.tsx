"use client";

import { Camera, X, Sparkles } from "lucide-react";
import type { CardCopy } from "@/types/card";
import { supabase } from "@/lib/supabase";

export function CameraExperience({
  onClose,
  onCardCreated,
  nextId,
}: {
  onClose: () => void;
  onCardCreated: (card: CardCopy) => void;
  nextId: string;
}) {
  async function handleCapture(file?: File) {
    if (!file) return;

    const story = prompt("Tell this card's story. You can leave this blank.") ?? "";

    const fileExt = file.name.split(".").pop() || "jpg";
    const filePath = `${nextId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("card-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    if (uploadError) {
      alert(uploadError.message);
      return;
    }

    const { data } = supabase.storage
      .from("card-images")
      .getPublicUrl(filePath);

    const newCard: CardCopy = {
      id: nextId,
      name: "",
      setName: "",
      number: "",
      rarity: "",
      condition: "",
      imageUrl: data.publicUrl,
      notes: story,
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
      alert(error.message);
      return;
    }

    onCardCreated(newCard);
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.16),transparent_55%)]" />

      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 rounded-full bg-slate-900/80 border border-slate-700 p-3"
      >
        <X />
      </button>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-8">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center">
            <Camera size={32} />
          </div>
          <h1 className="text-4xl font-black">Add to The Vault</h1>
          <p className="mt-3 text-slate-400">
            Place your card in the frame, take a photo, and begin its story.
          </p>
        </div>

        <div className="w-full max-w-sm rounded-[2rem] border-2 border-emerald-400/60 bg-green-950/30 p-5 shadow-2xl shadow-emerald-500/20">
          <div className="aspect-[2.5/3.5] rounded-[1.5rem] border border-emerald-300/40 bg-slate-900/70 flex items-center justify-center">
            <div className="text-emerald-300">
              <Sparkles className="mx-auto mb-3" />
              Card frame
            </div>
          </div>
        </div>

        <label className="mt-8 w-full max-w-sm cursor-pointer rounded-2xl bg-emerald-400 px-6 py-4 text-slate-950 font-black text-lg shadow-lg shadow-emerald-500/30">
          Capture Card
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleCapture(e.target.files?.[0])}
          />
        </label>

        <p className="mt-4 max-w-sm text-sm text-slate-500">
          Smart recognition comes next. For now, this creates the card Passport
          with a cloud-stored photo.
        </p>
      </div>
    </div>
  );
}
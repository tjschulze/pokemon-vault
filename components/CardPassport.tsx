"use client";

import { ArrowLeft, Camera, Sparkles } from "lucide-react";
import type { CardCopy } from "@/types/card";

export function CardPassport({
  card,
  onBack,
}: {
  card: CardCopy;
  onBack: () => void;
}) {
  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-slate-300 hover:text-white flex items-center gap-2"
      >
        <ArrowLeft size={18} />
        Back to Collection
      </button>

      <section className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/30 p-6 lg:p-10 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-8">
          <div>
            <div className="rounded-3xl bg-green-950/40 border border-emerald-500/20 p-4 shadow-inner">
              <div className="aspect-[2.5/3.5] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center">
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-500 text-center">
                    <Camera className="mx-auto mb-3" />
                    No photo yet
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-emerald-300">
              Classic Green Felt Mat
            </div>
          </div>

          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-emerald-300 font-mono">{card.id}</p>
                <h1 className="text-4xl lg:text-6xl font-black mt-2">
                  {card.name || "Unnamed Card"}
                </h1>
                <p className="text-slate-400 mt-3 text-lg">
                  {card.setName || "Unknown Set"} {card.number && `• ${card.number}`}
                </p>
              </div>

              <div className="hidden sm:flex bg-emerald-400/10 border border-emerald-400/30 rounded-2xl px-4 py-3 text-emerald-300 items-center gap-2">
                <Sparkles size={18} />
                Passport
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <Info label="Rarity" value={card.rarity || "—"} />
              <Info label="Condition" value={card.condition || "—"} />
              <Info label="Status" value="Active Vault" />
            </div>

            <section className="mt-8 rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
              <h2 className="text-2xl font-bold mb-3">Card Story</h2>
              <p className="text-slate-300 leading-relaxed">
                Every physical card has a story — from the excitement of being
                pulled from a pack, to the care of being sleeved, inspected,
                displayed, graded, traded, or passed on.
              </p>

              <div className="mt-5 border-l border-emerald-400/40 pl-4 space-y-4">
                <Timeline title="Added to Vault" text="This card received its permanent Pokémon Vault ID." />
                <Timeline title="Photo Archived" text={card.imageUrl ? "A card image is stored with this record." : "No photo has been added yet."} />
                <Timeline title="Inspection Pending" text="Future inspections, swirl notes, and condition history will live here." />
              </div>
            </section>

            <section className="mt-6 rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
              <h2 className="text-2xl font-bold mb-3">Collector Notes</h2>
              <p className="text-slate-300 whitespace-pre-wrap">
                {card.notes || "No notes yet."}
              </p>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4">
      <div className="text-slate-400 text-sm">{label}</div>
      <div className="text-xl font-bold mt-1">{value}</div>
    </div>
  );
}

function Timeline({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <div className="font-bold text-emerald-300">{title}</div>
      <div className="text-slate-400 text-sm">{text}</div>
    </div>
  );
}
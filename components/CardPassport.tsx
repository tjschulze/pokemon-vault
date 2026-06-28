"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  Sparkles,
  Image,
  ClipboardList,
  Clock,
  StickyNote,
} from "lucide-react";
import type { CardCopy } from "@/types/card";

type PassportTab = "overview" | "photos" | "inspection" | "history" | "notes";

const tabs: { id: PassportTab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <Sparkles size={16} /> },
  { id: "photos", label: "Photos", icon: <Image size={16} /> },
  { id: "inspection", label: "Inspection", icon: <ClipboardList size={16} /> },
  { id: "history", label: "History", icon: <Clock size={16} /> },
  { id: "notes", label: "Notes", icon: <StickyNote size={16} /> },
];

export function CardPassport({
  card,
  onBack,
}: {
  card: CardCopy;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<PassportTab>("overview");

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-slate-300 hover:text-white flex items-center gap-2"
      >
        <ArrowLeft size={18} />
        Back to Collection
      </button>

      <section className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/30 p-5 lg:p-10 shadow-2xl">
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
            <p className="text-emerald-300 font-mono">{card.id}</p>
            <h1 className="text-4xl lg:text-6xl font-black mt-2">
              {card.name || "Unnamed Card"}
            </h1>
            <p className="text-slate-400 mt-3 text-lg">
              {card.setName || "Unknown Set"} {card.number && `• ${card.number}`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <Info label="Rarity" value={card.rarity || "—"} />
              <Info label="Condition" value={card.condition || "—"} />
              <Info label="Status" value="Active Vault" />
            </div>

            <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition ${
                    activeTab === tab.id
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-slate-900 border border-slate-800 text-slate-300"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {activeTab === "overview" && <OverviewTab card={card} />}
              {activeTab === "photos" && <PhotosTab card={card} />}
              {activeTab === "inspection" && <InspectionTab card={card} />}
              {activeTab === "history" && <HistoryTab card={card} />}
              {activeTab === "notes" && <NotesTab card={card} />}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function OverviewTab({ card }: { card: CardCopy }) {
  return (
    <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
      <h2 className="text-2xl font-bold mb-3">Card Story</h2>
      <p className="text-slate-300 leading-relaxed">
        Every physical card has a story — from the excitement of being pulled
        from a pack, to the care of being sleeved, inspected, displayed, graded,
        traded, or passed on.
      </p>

      <div className="mt-5 border-l border-emerald-400/40 pl-4 space-y-4">
        <Timeline
          title="Added to Vault"
          text={`${card.id} became this card's permanent identity.`}
        />
        <Timeline
          title="Photo Archived"
          text={
            card.imageUrl
              ? "A cloud photo is stored with this card."
              : "No photo has been added yet."
          }
        />
        <Timeline
          title="Inspection Pending"
          text="Future inspections, swirl notes, and condition history will live here."
        />
      </div>
    </section>
  );
}

function PhotosTab({ card }: { card: CardCopy }) {
  return (
    <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
      <h2 className="text-2xl font-bold mb-3">Photos</h2>
      <p className="text-slate-400 mb-4">
        Soon this will hold front, back, angled holo, corner closeups, and
        damage-detail photos.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <PhotoSlot label="Front" imageUrl={card.imageUrl} />
        <PhotoSlot label="Back" />
        <PhotoSlot label="Holo Angle" />
        <PhotoSlot label="Corners" />
        <PhotoSlot label="Surface" />
        <PhotoSlot label="Swirl Detail" />
      </div>
    </section>
  );
}

function InspectionTab({ card }: { card: CardCopy }) {
  return (
    <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
      <h2 className="text-2xl font-bold mb-3">Inspection</h2>
      <p className="text-slate-400 mb-5">
        This will become the Inspection Lab: corner grading, centering,
        whitening, surface notes, swirls, and annotation layers.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Info label="Front Corners" value="Pending" />
        <Info label="Back Corners" value="Pending" />
        <Info label="Centering" value="Pending" />
        <Info label="Swirls" value="Pending" />
      </div>
    </section>
  );
}

function HistoryTab({ card }: { card: CardCopy }) {
  return (
    <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
      <h2 className="text-2xl font-bold mb-3">Timeline</h2>

      <div className="border-l border-emerald-400/40 pl-4 space-y-5">
        <Timeline
          title="Created"
          text={`${card.id} was added to Pokémon Vault.`}
        />
        <Timeline
          title="Collection Story"
          text="Purchase, binder moves, grading submissions, sales, and inspections will appear here."
        />
      </div>
    </section>
  );
}

function NotesTab({ card }: { card: CardCopy }) {
  return (
    <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
      <h2 className="text-2xl font-bold mb-3">Collector Notes</h2>
      <p className="text-slate-300 whitespace-pre-wrap">
        {card.notes || "No notes yet."}
      </p>
    </section>
  );
}

function PhotoSlot({
  label,
  imageUrl,
}: {
  label: string;
  imageUrl?: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
      <div className="aspect-[2.5/3.5] flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={label} className="w-full h-full object-cover" />
        ) : (
          <Camera className="text-slate-600" />
        )}
      </div>
      <div className="p-3 text-sm text-slate-300">{label}</div>
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
}"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Camera,
  Sparkles,
  Image,
  ClipboardList,
  Clock,
  StickyNote,
} from "lucide-react";
import type { CardCopy } from "@/types/card";

type PassportTab = "overview" | "photos" | "inspection" | "history" | "notes";

const tabs: { id: PassportTab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Overview", icon: <Sparkles size={16} /> },
  { id: "photos", label: "Photos", icon: <Image size={16} /> },
  { id: "inspection", label: "Inspection", icon: <ClipboardList size={16} /> },
  { id: "history", label: "History", icon: <Clock size={16} /> },
  { id: "notes", label: "Notes", icon: <StickyNote size={16} /> },
];

export function CardPassport({
  card,
  onBack,
}: {
  card: CardCopy;
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState<PassportTab>("overview");

  return (
    <div className="max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 text-slate-300 hover:text-white flex items-center gap-2"
      >
        <ArrowLeft size={18} />
        Back to Collection
      </button>

      <section className="rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950/30 p-5 lg:p-10 shadow-2xl">
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
            <p className="text-emerald-300 font-mono">{card.id}</p>
            <h1 className="text-4xl lg:text-6xl font-black mt-2">
              {card.name || "Unnamed Card"}
            </h1>
            <p className="text-slate-400 mt-3 text-lg">
              {card.setName || "Unknown Set"} {card.number && `• ${card.number}`}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
              <Info label="Rarity" value={card.rarity || "—"} />
              <Info label="Condition" value={card.condition || "—"} />
              <Info label="Status" value="Active Vault" />
            </div>

            <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 flex items-center gap-2 rounded-full px-4 py-3 text-sm font-bold transition ${
                    activeTab === tab.id
                      ? "bg-emerald-400 text-slate-950"
                      : "bg-slate-900 border border-slate-800 text-slate-300"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {activeTab === "overview" && <OverviewTab card={card} />}
              {activeTab === "photos" && <PhotosTab card={card} />}
              {activeTab === "inspection" && <InspectionTab card={card} />}
              {activeTab === "history" && <HistoryTab card={card} />}
              {activeTab === "notes" && <NotesTab card={card} />}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function OverviewTab({ card }: { card: CardCopy }) {
  return (
    <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
      <h2 className="text-2xl font-bold mb-3">Card Story</h2>
      <p className="text-slate-300 leading-relaxed">
        Every physical card has a story — from the excitement of being pulled
        from a pack, to the care of being sleeved, inspected, displayed, graded,
        traded, or passed on.
      </p>

      <div className="mt-5 border-l border-emerald-400/40 pl-4 space-y-4">
        <Timeline
          title="Added to Vault"
          text={`${card.id} became this card's permanent identity.`}
        />
        <Timeline
          title="Photo Archived"
          text={
            card.imageUrl
              ? "A cloud photo is stored with this card."
              : "No photo has been added yet."
          }
        />
        <Timeline
          title="Inspection Pending"
          text="Future inspections, swirl notes, and condition history will live here."
        />
      </div>
    </section>
  );
}

function PhotosTab({ card }: { card: CardCopy }) {
  return (
    <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
      <h2 className="text-2xl font-bold mb-3">Photos</h2>
      <p className="text-slate-400 mb-4">
        Soon this will hold front, back, angled holo, corner closeups, and
        damage-detail photos.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <PhotoSlot label="Front" imageUrl={card.imageUrl} />
        <PhotoSlot label="Back" />
        <PhotoSlot label="Holo Angle" />
        <PhotoSlot label="Corners" />
        <PhotoSlot label="Surface" />
        <PhotoSlot label="Swirl Detail" />
      </div>
    </section>
  );
}

function InspectionTab({ card }: { card: CardCopy }) {
  return (
    <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
      <h2 className="text-2xl font-bold mb-3">Inspection</h2>
      <p className="text-slate-400 mb-5">
        This will become the Inspection Lab: corner grading, centering,
        whitening, surface notes, swirls, and annotation layers.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Info label="Front Corners" value="Pending" />
        <Info label="Back Corners" value="Pending" />
        <Info label="Centering" value="Pending" />
        <Info label="Swirls" value="Pending" />
      </div>
    </section>
  );
}

function HistoryTab({ card }: { card: CardCopy }) {
  return (
    <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
      <h2 className="text-2xl font-bold mb-3">Timeline</h2>

      <div className="border-l border-emerald-400/40 pl-4 space-y-5">
        <Timeline
          title="Created"
          text={`${card.id} was added to Pokémon Vault.`}
        />
        <Timeline
          title="Collection Story"
          text="Purchase, binder moves, grading submissions, sales, and inspections will appear here."
        />
      </div>
    </section>
  );
}

function NotesTab({ card }: { card: CardCopy }) {
  return (
    <section className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
      <h2 className="text-2xl font-bold mb-3">Collector Notes</h2>
      <p className="text-slate-300 whitespace-pre-wrap">
        {card.notes || "No notes yet."}
      </p>
    </section>
  );
}

function PhotoSlot({
  label,
  imageUrl,
}: {
  label: string;
  imageUrl?: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden">
      <div className="aspect-[2.5/3.5] flex items-center justify-center">
        {imageUrl ? (
          <img src={imageUrl} alt={label} className="w-full h-full object-cover" />
        ) : (
          <Camera className="text-slate-600" />
        )}
      </div>
      <div className="p-3 text-sm text-slate-300">{label}</div>
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
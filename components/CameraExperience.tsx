"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, X, Archive } from "lucide-react";
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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [archiving, setArchiving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function startCamera() {
      try {
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
          },
          audio: false,
        });

        setStream(cameraStream);

        if (videoRef.current) {
          videoRef.current.srcObject = cameraStream;
        }
      } catch {
        setError("Camera access was denied or unavailable.");
      }
    }

    startCamera();

    return () => {
      cameraStreamCleanup(stream);
    };
  }, []);

  function cameraStreamCleanup(activeStream: MediaStream | null) {
    activeStream?.getTracks().forEach((track) => track.stop());
  }

  async function archiveCard() {
    if (!videoRef.current) return;

    setArchiving(true);

    try {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      if (!context) throw new Error("Could not capture image.");

      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((result) => {
          if (result) resolve(result);
          else reject(new Error("Could not create image file."));
        }, "image/jpeg", 0.92);
      });

      const story =
        prompt("Tell this card's story. You can leave this blank.") ?? "";

      const filePath = `${nextId}/${Date.now()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from("card-images")
        .upload(filePath, blob, {
          contentType: "image/jpeg",
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

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

      const { error: insertError } = await supabase.from("cards").insert({
        id: newCard.id,
        name: newCard.name,
        set_name: newCard.setName,
        number: newCard.number,
        rarity: newCard.rarity,
        condition: newCard.condition,
        image_url: newCard.imageUrl,
        notes: newCard.notes,
      });

      if (insertError) throw insertError;

      cameraStreamCleanup(stream);
      onCardCreated(newCard);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Archive failed.";
      alert(message);
      setArchiving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950 text-white overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-black/40" />

      <button
        onClick={() => {
          cameraStreamCleanup(stream);
          onClose();
        }}
        className="absolute top-5 right-5 z-20 rounded-full bg-slate-950/80 border border-slate-700 p-3"
      >
        <X />
      </button>

      <div className="relative z-10 min-h-screen flex flex-col justify-between p-5 pt-12 pb-56 text-center">
        <div>
          <div className="mx-auto mb-3 h-14 w-14 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <Camera size={30} />
          </div>

          <h1 className="text-4xl font-black">The Vault</h1>
          <p className="mt-2 text-slate-300">
            Align your card inside the frame.
          </p>
        </div>

        <div className="mx-auto w-full max-w-xs">
          <div className="aspect-[2.5/3.5] rounded-[2rem] border-4 border-emerald-400/80 shadow-2xl shadow-emerald-500/30 bg-emerald-400/5 backdrop-blur-[1px]" />
          <p className="mt-4 text-sm text-emerald-300">
            Every card has a story. Every story deserves a home.
          </p>
        </div>

        <div className="fixed left-0 right-0 bottom-0 z-30 px-5 pb-[calc(env(safe-area-inset-bottom)+6rem)]">
          {error && <p className="mb-4 text-red-300">{error}</p>}

          <button
            onClick={archiveCard}
            disabled={archiving || !!error}
            className="mx-auto w-full max-w-sm rounded-2xl bg-emerald-400 px-6 py-4 text-slate-950 font-black text-lg shadow-lg shadow-emerald-500/30 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <Archive size={22} />
            {archiving ? "Archiving..." : "Archive Card"}
          </button>
        </div>
      </div>
    </div>
  );
}
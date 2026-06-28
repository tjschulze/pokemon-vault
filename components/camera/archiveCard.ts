import { supabase } from "@/lib/supabase";
import type { CardCopy } from "@/types/card";

export function playVaultClick() {
  const audioContext = new AudioContext();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(180, audioContext.currentTime);

  gain.gain.setValueAtTime(0.08, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.08);
}

export async function archiveCardImage({
  blob,
  nextId,
}: {
  blob: Blob;
  nextId: string;
}) {
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
    notes: "",
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

  playVaultClick();

  return newCard;
}
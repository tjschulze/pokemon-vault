import { supabase } from "@/lib/supabase";
import type { CardCopy } from "@/types/card";
import { playVaultClick } from "./vaultFeedback"

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
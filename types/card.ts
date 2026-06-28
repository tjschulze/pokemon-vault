export type View =
  | "dashboard"
  | "collection"
  | "binder"
  | "inspection"
  | "wishlist"
  | "analytics"
  | "settings";

export type CardCopy = {
  id: string;
  name: string;
  setName: string;
  number: string;
  rarity: string;
  condition: string;
  imageUrl: string;
  notes: string;
};
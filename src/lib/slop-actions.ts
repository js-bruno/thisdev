import { createContext } from "react";
import type { SlopItem } from "./slops";

export type SlopNoteActions = {
  open: (item: SlopItem) => void;
  remove: (id: string) => void;
};

export const SlopNoteActionsContext =
  createContext<SlopNoteActions | null>(null);

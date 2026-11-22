import { createContext } from "react";
import type { SlopItem } from "./slops";

export type SlopNoteActions = {
  open: (item: SlopItem, focusComments?: boolean) => void;
  remove: (id: string) => void;
  commentCountFor: (id: string) => number;
};

export const SlopNoteActionsContext =
  createContext<SlopNoteActions | null>(null);

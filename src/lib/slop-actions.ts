import { createContext } from "react";

export type SlopNoteActions = {
  copy: (text: string) => void;
  remove: (id: string) => void;
};

export const SlopNoteActionsContext =
  createContext<SlopNoteActions | null>(null);

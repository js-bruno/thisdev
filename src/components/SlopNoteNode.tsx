import { useContext } from "react";
import type { Node, NodeProps } from "@xyflow/react";
import SlopCard from "./SlopCard";
import { SlopNoteActionsContext } from "../lib/slop-actions";
import type { SlopItem } from "../lib/slops";

export type SlopNoteData = {
  item: SlopItem;
  index: number;
};

export type SlopBoardNode = Node<SlopNoteData, "slop">;

const noop = () => {};

export default function SlopNoteNode({ data }: NodeProps<SlopBoardNode>) {
  const actions = useContext(SlopNoteActionsContext);

  return (
    <SlopCard
      item={data.item}
      index={data.index}
      onOpen={actions?.open ?? noop}
      onDelete={actions?.remove ?? noop}
    />
  );
}

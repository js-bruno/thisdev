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
      commentCount={actions?.commentCountFor(data.item.id) ?? 0}
      onOpen={actions?.open ?? noop}
      onComment={() => actions?.open(data.item, true)}
      onDelete={actions?.remove ?? noop}
    />
  );
}

import {
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from "react";
import {
  formatRelative,
  formatTool,
  noteRotationFor,
  type SlopItem,
} from "../lib/slops";

type Props = {
  item: SlopItem;
  index: number;
  commentCount: number;
  onOpen: (item: SlopItem) => void;
  onComment: () => void;
  onDelete: (id: string) => void;
};

type NoteStyle = CSSProperties & {
  "--note-rot": string;
  "--enter-delay": string;
};

export default function SlopCard({
  item,
  index,
  commentCount,
  onOpen,
  onComment,
  onDelete,
}: Props) {
  const isPost = item.kind === "post";
  const style: NoteStyle = {
    "--note-rot": `${noteRotationFor(item.id)}deg`,
    "--enter-delay": `${Math.min(index * 55, 420)}ms`,
  };

  const className = [
    "slop-note",
    `slop-note--c${item.color}`,
    isPost ? "slop-note--post" : "slop-note--note",
    item.fresh ? "slop-note--fresh" : "",
    item.deleting ? "slop-note--deleting" : "",
  ]
    .filter(Boolean)
    .join(" ");

  function open() {
    onOpen(item);
  }

  function handleClick(event: MouseEvent<HTMLDivElement>) {
    const selection = window.getSelection();

    if (selection && selection.toString().trim()) return;

    event.stopPropagation();
    open();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    open();
  }

  function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onDelete(item.id);
  }

  function handleComment(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onComment();
  }

  return (
    <article className={className} style={style} data-kind={item.kind}>
      <span className="slop-note-tape" aria-hidden="true" />

      {item.fresh && <span className="slop-note-ping" aria-hidden="true" />}
      {isPost && <span className="slop-note-badge">do site</span>}

      <header className="slop-note-head" title="arrasta pelo cabeçalho">
        <span className="slop-note-tool">{formatTool(item.tool)}</span>
        <time dateTime={item.createdAt}>
          {formatRelative(item.createdAt)}
        </time>
      </header>

      <div
        className="slop-note-body nodrag"
        role="button"
        tabIndex={0}
        title="clica pra ler"
        aria-haspopup="dialog"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {isPost ? (
          <h3 className="slop-note-title">{item.text}</h3>
        ) : (
          <p className="slop-note-text">{item.text}</p>
        )}

        {item.description && (
          <p className="slop-note-desc">{item.description}</p>
        )}
      </div>

      {item.author && <span className="slop-note-author">~ {item.author}</span>}

      <footer className="slop-note-actions nodrag">
        <button
          type="button"
          className="is-comment"
          onClick={handleComment}
          aria-label={
            commentCount > 0
              ? `ver ${commentCount} comentário${commentCount === 1 ? "" : "s"}`
              : "comentar neste slop"
          }
        >
          {commentCount > 0
            ? `${commentCount === 1 ? "comentário" : "comentários"} ${String(commentCount).padStart(2, "0")}`
            : "comentar"}
        </button>

        {!isPost && (
          <button
            type="button"
            className="is-danger"
            onClick={handleDelete}
            aria-label="apagar este slop"
          >
            apagar
          </button>
        )}
      </footer>
    </article>
  );
}

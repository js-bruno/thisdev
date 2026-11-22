import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import {
  copyTextFor,
  formatRelative,
  formatTool,
  MAX_TEXT,
  noteRotationFor,
  type SlopItem,
} from "../lib/slops";

type Props = {
  item: SlopItem;
  index: number;
  onCopy: (text: string) => void;
  onDelete: (id: string) => void;
};

type NoteStyle = CSSProperties & {
  "--note-rot": string;
  "--enter-delay": string;
};

export default function SlopCard({ item, index, onCopy, onDelete }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, []);

  const isPost = item.kind === "post";
  const isLong = item.text.length + (item.description?.length ?? 0) > 170;
  const style: NoteStyle = {
    "--note-rot": `${noteRotationFor(item.id)}deg`,
    "--enter-delay": `${Math.min(index * 55, 420)}ms`,
  };

  const className = [
    "slop-note",
    `slop-note--c${item.color}`,
    isPost ? "slop-note--post" : "slop-note--note",
    expanded ? "is-expanded" : "",
    item.fresh ? "slop-note--fresh" : "",
    item.deleting ? "slop-note--deleting" : "",
  ]
    .filter(Boolean)
    .join(" ");

  function handleCopy(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onCopy(copyTextFor(item));
    setCopied(true);

    if (copyTimer.current) window.clearTimeout(copyTimer.current);

    copyTimer.current = window.setTimeout(() => setCopied(false), 1400);
  }

  function handleDelete(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    onDelete(item.id);
  }

  return (
    <article
      className={className}
      style={style}
      data-kind={item.kind}
      onDoubleClick={(event) => {
        if ((event.target as HTMLElement).closest("button, a")) return;
        setExpanded((value) => !value);
      }}
    >
      <span className="slop-note-tape" aria-hidden="true" />

      {item.fresh && <span className="slop-note-ping" aria-hidden="true" />}
      {isPost && <span className="slop-note-badge">do site</span>}

      <header className="slop-note-head" title="arrasta pela fita">
        <span className="slop-note-tool">{formatTool(item.tool)}</span>
        <time dateTime={item.createdAt}>
          {formatRelative(item.createdAt)}
        </time>
      </header>

      <div className="slop-note-body nodrag">
        {isPost ? (
          <h3 className="slop-note-title">{item.text}</h3>
        ) : (
          <p className="slop-note-text">{item.text}</p>
        )}

        {item.description && (
          <p className="slop-note-desc">{item.description}</p>
        )}

        {isLong && (
          <button
            type="button"
            className="slop-note-more"
            onClick={() => setExpanded((value) => !value)}
            aria-expanded={expanded}
          >
            {expanded ? "recolher" : "ver mais"}
          </button>
        )}
      </div>

      {item.author && <span className="slop-note-author">~ {item.author}</span>}

      <footer className="slop-note-actions nodrag">
        {item.href && (
          <a href={item.href} className="slop-note-link">
            ler completo →
          </a>
        )}

        <button
          type="button"
          className={copied ? "is-copied" : ""}
          onClick={handleCopy}
          aria-label="copiar este slop"
        >
          {copied ? "copiado ✓" : "copiar"}
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

        <span className="slop-note-count" aria-hidden="true">
          {item.text.length}/{MAX_TEXT}
        </span>
      </footer>
    </article>
  );
}

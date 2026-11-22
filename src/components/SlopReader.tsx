import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type SyntheticEvent,
} from "react";
import {
  MAX_TEXT,
  formatRelative,
  formatTool,
  type SlopItem,
} from "../lib/slops";

type Props = {
  item: SlopItem | null;
  onClose: () => void;
  onCopy: (text: string) => void;
};

const CLOSE_MS = 190;

export default function SlopReader({ item, onClose, onCopy }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const proseRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);
  const copyTimer = useRef<number | null>(null);
  const [closing, setClosing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !item) return;

    setClosing(false);
    setCopied(false);
    document.documentElement.classList.add("slop-reader-open");

    if (!dialog.open) dialog.showModal();

    if (item.kind === "post") {
      const slug = item.href?.split("/").filter(Boolean).pop() ?? "";
      const template = document.querySelector<HTMLTemplateElement>(
        `template[data-slop-content="${slug}"]`,
      );
      const holder = proseRef.current;

      if (holder) {
        holder.replaceChildren();

        if (template) {
          holder.append(template.content.cloneNode(true));
        }
      }
    }

    return () => {
      document.documentElement.classList.remove("slop-reader-open");
      if (dialog.open) dialog.close();
    };
  }, [item]);

  useEffect(() => {
    return () => {
      if (closeTimer.current) window.clearTimeout(closeTimer.current);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, []);

  const requestClose = useCallback(() => {
    if (!item || closeTimer.current) return;

    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      closeTimer.current = null;

      const dialog = dialogRef.current;
      if (dialog?.open) dialog.close();

      onClose();
    }, CLOSE_MS);
  }, [item, onClose]);

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    requestClose();
  }

  function handleDialogClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) requestClose();
  }

  function handleCopy() {
    if (!item) return;

    const parts = [item.text];

    if (item.kind === "post") {
      if (item.description) parts.push(item.description);

      const body = proseRef.current?.innerText.trim();
      if (body) parts.push(body);

      if (item.href) {
        parts.push(new URL(item.href, window.location.origin).toString());
      }
    }

    onCopy(parts.filter(Boolean).join("\n\n"));
    setCopied(true);

    if (copyTimer.current) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopied(false), 1400);
  }

  if (!item) return null;

  const isPost = item.kind === "post";
  const date = new Date(item.createdAt);
  const dateLabel = isPost
    ? date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : formatRelative(item.createdAt);
  const toolLabel = isPost ? "do site" : formatTool(item.tool);
  const title = isPost ? item.text : `slop de ${formatTool(item.tool)}`;

  const className = [
    "slop-reader",
    `slop-reader--c${item.color}`,
    closing ? "is-closing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <dialog
      ref={dialogRef}
      className={className}
      aria-labelledby="slop-reader-title"
      onCancel={handleCancel}
      onClick={handleDialogClick}
      onClose={() =>
        document.documentElement.classList.remove("slop-reader-open")
      }
    >
      <div className="slop-reader-sheet">
        <span className="slop-reader-tape" aria-hidden="true" />

        <header className="slop-reader-head">
          <p className="slop-reader-kicker">
            {toolLabel} · {dateLabel}
          </p>
          <h2 id="slop-reader-title">{title}</h2>
          {isPost && item.description && (
            <p className="slop-reader-desc">{item.description}</p>
          )}
          <button
            type="button"
            className="slop-reader-close"
            onClick={requestClose}
            aria-label="fechar"
          >
            ×
          </button>
        </header>

        <div className="slop-reader-body">
          {isPost ? (
            <div className="slop-reader-prose" ref={proseRef} />
          ) : (
            <p className="slop-reader-text">{item.text}</p>
          )}
        </div>

        <footer className="slop-reader-foot">
          <button
            type="button"
            className={copied ? "slop-reader-copy is-copied" : "slop-reader-copy"}
            onClick={handleCopy}
            aria-label="copiar este slop"
          >
            {copied ? "copiado ✓" : "copiar"}
          </button>

          {!isPost && (
            <span className="slop-reader-count">
              {item.text.length}/{MAX_TEXT}
            </span>
          )}

          {item.author && (
            <span className="slop-reader-author">~ {item.author}</span>
          )}
        </footer>
      </div>
    </dialog>
  );
}

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type SyntheticEvent,
} from "react";
import {
  MAX_AUTHOR,
  MAX_COMMENT,
  MAX_TEXT,
  formatRelative,
  formatTool,
  sanitizeText,
  type SlopComment,
  type SlopItem,
} from "../lib/slops";

type Props = {
  item: SlopItem | null;
  comments: SlopComment[];
  focusComments?: boolean;
  onClose: () => void;
  onCopy: (text: string) => void;
  onAddComment: (text: string, author?: string) => void;
  onDeleteComment: (id: string) => void;
};

const CLOSE_MS = 190;

export default function SlopReader({
  item,
  comments,
  focusComments = false,
  onClose,
  onCopy,
  onAddComment,
  onDeleteComment,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const proseRef = useRef<HTMLDivElement>(null);
  const commentsRef = useRef<HTMLElement>(null);
  const commentInputRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const closeTimer = useRef<number | null>(null);
  const copyTimer = useRef<number | null>(null);
  const [closing, setClosing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [commentAuthor, setCommentAuthor] = useState("");

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !item) return;

    setClosing(false);
    setCopied(false);
    setCommentText("");
    setCommentAuthor("");
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
    if (!item || !focusComments) return;

    const timer = window.setTimeout(() => {
      commentsRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
      commentInputRef.current?.focus();
    }, 140);

    return () => window.clearTimeout(timer);
  }, [focusComments, item]);

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

  function jumpToComments() {
    commentsRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }

  function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const text = sanitizeText(commentText, MAX_COMMENT);

    if (!text) return;

    const author = sanitizeText(commentAuthor, MAX_AUTHOR) || undefined;
    onAddComment(text, author);
    setCommentText("");
  }

  function handleCommentKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
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

          <section
            className="slop-reader-comments"
            ref={commentsRef}
            aria-label="comentários"
          >
            <div className="slop-reader-comments-head">
              <span>comentários</span>
              <span>{String(comments.length).padStart(2, "0")}</span>
            </div>

            {comments.length === 0 ? (
              <p className="slop-reader-comments-empty">
                nenhum comentário ainda. este caderno fica no teu navegador.
              </p>
            ) : (
              <ol className="slop-reader-comment-list">
                {comments.map((comment) => (
                  <li className="slop-reader-comment" key={comment.id}>
                    <div className="slop-reader-comment-meta">
                      <span>~ {comment.author || "anônimo"}</span>
                      <time dateTime={comment.createdAt}>
                        {formatRelative(comment.createdAt)}
                      </time>
                      <button
                        type="button"
                        onClick={() => onDeleteComment(comment.id)}
                        aria-label="apagar este comentário"
                        title="apagar comentário"
                      >
                        ×
                      </button>
                    </div>
                    <p>{comment.text}</p>
                  </li>
                ))}
              </ol>
            )}

            <form
              ref={formRef}
              className="slop-reader-comment-form"
              onSubmit={handleCommentSubmit}
            >
              <label>
                <span>nome // opcional</span>
                <input
                  type="text"
                  value={commentAuthor}
                  onChange={(event) => setCommentAuthor(event.target.value)}
                  maxLength={MAX_AUTHOR}
                  placeholder="anônimo"
                />
              </label>

              <label className="slop-reader-comment-field">
                <span>comentário</span>
                <textarea
                  ref={commentInputRef}
                  value={commentText}
                  onChange={(event) => setCommentText(event.target.value)}
                  onKeyDown={handleCommentKeyDown}
                  maxLength={MAX_COMMENT}
                  rows={3}
                  placeholder="deixa um comentário local…"
                />
              </label>

              <div className="slop-reader-comment-actions">
                <span>
                  {commentText.length}/{MAX_COMMENT} · fica no navegador
                  <span className="slop-reader-comment-shortcut">
                    {" "}
                    · ctrl+enter
                  </span>
                </span>
                <button type="submit" disabled={!commentText.trim()}>
                  comentar
                </button>
              </div>
            </form>
          </section>
        </div>

        <footer className="slop-reader-foot">
          <button
            type="button"
            className="slop-reader-comments-jump"
            onClick={jumpToComments}
          >
            {comments.length === 1 ? "comentário" : "comentários"}{" "}
            {String(comments.length).padStart(2, "0")}
          </button>

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

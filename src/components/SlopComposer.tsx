import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type MouseEvent,
} from "react";
import {
  MAX_AUTHOR,
  MAX_TEXT,
  NOTE_COLOR_LABELS,
  NOTE_HEX,
  NOTE_TOOLS,
  formatTool,
  sanitizeText,
  type NoteTool,
} from "../lib/slops";

export type SlopDraft = {
  text: string;
  tool: NoteTool;
  author: string;
  color: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (draft: SlopDraft) => void;
};

export default function SlopComposer({ open, onClose, onSubmit }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const [tool, setTool] = useState<NoteTool>("outra");
  const [author, setAuthor] = useState("");
  const [color, setColor] = useState(0);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      if (!dialog.open) dialog.showModal();
      setColor(Math.floor(Math.random() * NOTE_HEX.length));

      const timer = window.setTimeout(() => textareaRef.current?.focus(), 80);
      return () => window.clearTimeout(timer);
    }

    if (dialog.open) dialog.close();
  }, [open]);

  const remaining = MAX_TEXT - text.length;
  const counterClass =
    remaining <= 10 ? "is-danger" : remaining <= 60 ? "is-warning" : "";

  function submit() {
    const clean = sanitizeText(text);

    if (!clean) {
      textareaRef.current?.focus();
      return;
    }

    onSubmit({
      text: clean,
      tool,
      author: sanitizeText(author, MAX_AUTHOR),
      color,
    });

    setText("");
    setAuthor("");
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    submit();
  }

  function handleDialogClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === dialogRef.current) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="slop-composer"
      aria-labelledby="slop-composer-title"
      onClose={onClose}
      onClick={handleDialogClick}
    >
      <div className="slop-composer-head">
        <div>
          <h2 id="slop-composer-title">pregar um slop</h2>
          <p>fica salvo só no teu navegador · nada é enviado pra lugar nenhum</p>
        </div>
        <button
          type="button"
          className="slop-composer-close"
          onClick={onClose}
          aria-label="fechar"
        >
          ×
        </button>
      </div>

      <form className="slop-composer-form" onSubmit={handleSubmit}>
        <div className="slop-composer-fields">
          <label className="slop-field">
            <span>o texto gerado</span>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
                  event.preventDefault();
                  submit();
                }
              }}
              maxLength={MAX_TEXT}
              placeholder="cola aqui aquele parágrafo de i.a que não serviu pra nada…"
              aria-describedby="slop-composer-hint"
            />
          </label>

          <div className="slop-counter-row" id="slop-composer-hint">
            <span>ctrl + enter prega</span>
            <span className={`slop-counter ${counterClass}`}>
              {text.length}/{MAX_TEXT}
            </span>
          </div>

          <div className="slop-field">
            <span>ferramenta</span>
            <div className="slop-tool-row" role="group" aria-label="ferramenta">
              {NOTE_TOOLS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="slop-tool-chip"
                  data-tool={option.value}
                  aria-pressed={tool === option.value}
                  onClick={() => setTool(option.value)}
                >
                  <i className="slop-tool-dot" aria-hidden="true" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="slop-field">
            <span>papel</span>
            <div className="slop-swatch-row" role="group" aria-label="cor do papel">
              {NOTE_COLOR_LABELS.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  className={`slop-swatch slop-note--c${index}`}
                  aria-label={`papel ${label}`}
                  aria-pressed={color === index}
                  onClick={() => setColor(index)}
                />
              ))}
            </div>
          </div>

          <label className="slop-field">
            <span>assinatura (opcional)</span>
            <input
              type="text"
              value={author}
              maxLength={MAX_AUTHOR}
              placeholder="anônimo"
              onChange={(event) => setAuthor(event.target.value)}
            />
          </label>
        </div>

        <aside className="slop-composer-preview" aria-hidden="true">
          <span className="slop-preview-label">prévia</span>
          <div className={`slop-note slop-note--c${color} slop-note--preview`}>
            <span className="slop-note-tape" />
            <header className="slop-note-head">
              <span className="slop-note-tool">{formatTool(tool)}</span>
              <time>agora</time>
            </header>
            <div className="slop-note-body">
              <p className="slop-note-text">
                {text.trim() || "teu slop aparece aqui…"}
              </p>
            </div>
            {author.trim() && (
              <span className="slop-note-author">~ {author.trim()}</span>
            )}
            <footer className="slop-note-actions">
              <span>post-it local</span>
            </footer>
          </div>
        </aside>

        <div className="slop-composer-actions">
          <button type="button" className="slop-btn" onClick={onClose}>
            cancelar
          </button>
          <button
            type="submit"
            className="slop-btn slop-btn--primary"
            disabled={!text.trim()}
          >
            <span className="slop-btn-plus" aria-hidden="true">
              +
            </span>
            pregar na lousa
          </button>
        </div>
      </form>
    </dialog>
  );
}

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from "react";

const STORAGE_KEY = "thisdev:about:microblog:v1";
const MAX_TEXT = 420;
const MAX_MOOD = 28;
const MAX_POSTS = 80;

type MicroPost = {
  id: string;
  text: string;
  mood?: string;
  createdAt: string;
};

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `diary-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function sanitize(value: string, max: number) {
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .trim()
    .slice(0, max);
}

function parsePosts(raw: string | null): MicroPost[] {
  if (!raw) return [];

  try {
    const value: unknown = JSON.parse(raw);
    const list = Array.isArray(value)
      ? value
      : typeof value === "object" &&
          value !== null &&
          Array.isArray((value as { posts?: unknown }).posts)
        ? (value as { posts: unknown[] }).posts
        : [];

    const seen = new Set<string>();
    const posts: MicroPost[] = [];

    for (const candidate of list.slice(0, MAX_POSTS)) {
      if (typeof candidate !== "object" || candidate === null) continue;

      const item = candidate as Record<string, unknown>;
      const text =
        typeof item.text === "string" ? sanitize(item.text, MAX_TEXT) : "";

      if (!text) continue;

      const createdAt =
        typeof item.createdAt === "string" &&
        !Number.isNaN(new Date(item.createdAt).getTime())
          ? item.createdAt
          : new Date().toISOString();
      const id =
        typeof item.id === "string" && item.id.length > 0
          ? item.id.slice(0, 80)
          : createId();
      const mood =
        typeof item.mood === "string"
          ? sanitize(item.mood, MAX_MOOD) || undefined
          : undefined;

      if (seen.has(id)) continue;

      seen.add(id);
      posts.push({ id, text, mood, createdAt });
    }

    return posts;
  } catch {
    return [];
  }
}

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  const day = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const time = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return `${day.replace(".", "")} · ${time}`;
}

export default function AboutMicroblog() {
  const [posts, setPosts] = useState<MicroPost[]>([]);
  const [text, setText] = useState("");
  const [mood, setMood] = useState("");
  const [ready, setReady] = useState(false);
  const [status, setStatus] = useState("");
  const statusTimer = useRef<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    try {
      setPosts(parsePosts(window.localStorage.getItem(STORAGE_KEY)));
    } catch {
      setPosts([]);
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ version: 1, posts }),
      );
    } catch {
      // Se o navegador bloquear o storage, o caderno segue em memória.
    }
  }, [posts, ready]);

  useEffect(() => {
    return () => {
      if (statusTimer.current) window.clearTimeout(statusTimer.current);
    };
  }, []);

  function announce(message: string) {
    if (statusTimer.current) window.clearTimeout(statusTimer.current);

    setStatus(message);
    statusTimer.current = window.setTimeout(() => setStatus(""), 2600);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const clean = sanitize(text, MAX_TEXT);

    if (!clean) return;

    const post: MicroPost = {
      id: createId(),
      text: clean,
      mood: sanitize(mood, MAX_MOOD) || undefined,
      createdAt: new Date().toISOString(),
    };

    setPosts((current) => [post, ...current].slice(0, MAX_POSTS));
    setText("");
    setMood("");
    announce("entrada salva no teu navegador");
    textareaRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if ((event.metaKey || event.ctrlKey) && event.key === "Enter") {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  }

  function removePost(id: string) {
    setPosts((current) => current.filter((post) => post.id !== id));
    announce("entrada apagada");
  }

  return (
    <div className="microblog">
      <div className="microblog-bar">
        <p>
          <strong>{String(posts.length).padStart(2, "0")}</strong>{" "}
          {posts.length === 1 ? "entrada" : "entradas"} <span>·</span> local
        </p>
        <span className="microblog-status" role="status" aria-live="polite">
          {status}
        </span>
      </div>

      <form className="microblog-composer" onSubmit={handleSubmit}>
        <label className="microblog-field">
          <span>nova entrada</span>
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={MAX_TEXT}
            rows={4}
            placeholder="uma coisa que não caberia num post…"
            aria-label="nova entrada do diário"
          />
        </label>

        <div className="microblog-controls">
          <label className="microblog-mood">
            <span>mood // opcional</span>
            <input
              type="text"
              value={mood}
              onChange={(event) => setMood(event.target.value)}
              maxLength={MAX_MOOD}
              placeholder="pensando…"
            />
          </label>

          <span className="microblog-count">
            {text.length}/{MAX_TEXT}
          </span>

          <button type="submit" disabled={!text.trim()}>
            postar
          </button>
        </div>
      </form>

      {ready && posts.length === 0 && (
        <p className="microblog-empty">
          o caderno ainda está em branco. escreve alguma coisa que não caberia
          num post.
        </p>
      )}

      {posts.length > 0 && (
        <ol className="microblog-feed">
          {posts.map((post) => (
            <li key={post.id}>
              <article className="microblog-post">
                <header className="microblog-meta">
                  <time dateTime={post.createdAt}>
                    {formatDate(post.createdAt)}
                  </time>
                  {post.mood && (
                    <span className="microblog-mood-label">~ {post.mood}</span>
                  )}
                  <button
                    type="button"
                    onClick={() => removePost(post.id)}
                    aria-label={`apagar entrada de ${formatDate(post.createdAt)}`}
                    title="apagar entrada"
                  >
                    ×
                  </button>
                </header>
                <p>{post.text}</p>
              </article>
            </li>
          ))}
        </ol>
      )}

      <p className="microblog-note">
        isto fica só no teu navegador. escreve sem plateia.
      </p>
    </div>
  );
}

export const STORAGE_KEY = "ai-slops:board:v1";
export const MAX_NOTES = 200;
export const MAX_TEXT = 500;
export const MAX_COMMENT = 280;
export const MAX_COMMENTS = 40;
export const MAX_AUTHOR = 24;
export const NOTE_WIDTH = 260;

const GAP_X = 36;
const GAP_Y = 34;

export type SlopTool =
  | "texto"
  | "chatgpt"
  | "claude"
  | "gemini"
  | "copilot"
  | "outra";

export type NoteTool = Exclude<SlopTool, "texto">;

export type SlopNote = {
  id: string;
  text: string;
  tool: NoteTool;
  author?: string;
  color: number;
  createdAt: string;
  /** runtime only: animação de post-it recém pregado */
  fresh?: boolean;
  /** runtime only: animação de papel sendo amassado */
  deleting?: boolean;
};

export type SlopItem = {
  id: string;
  kind: "note" | "post";
  text: string;
  description?: string;
  tool: SlopTool;
  author?: string;
  color: number;
  createdAt: string;
  href?: string;
  /** runtime only: animação de post-it recém pregado */
  fresh?: boolean;
  /** runtime only: animação de papel sendo amassado */
  deleting?: boolean;
};

export type SlopPostInput = {
  slug: string;
  title: string;
  description?: string;
  date: string;
};

export type SlopComment = {
  id: string;
  text: string;
  author?: string;
  createdAt: string;
};

export type BoardPosition = {
  x: number;
  y: number;
};

export type BoardState = {
  version: 1;
  notes: SlopNote[];
  positions: Record<string, BoardPosition>;
  comments: Record<string, SlopComment[]>;
};

export const NOTE_TOOLS: { value: NoteTool; label: string }[] = [
  { value: "chatgpt", label: "chatgpt" },
  { value: "claude", label: "claude" },
  { value: "gemini", label: "gemini" },
  { value: "copilot", label: "copilot" },
  { value: "outra", label: "outra" },
];

export const NOTE_COLOR_LABELS = [
  "amarelo",
  "rosa",
  "verde",
  "azul",
  "lilás",
  "pêssego",
];

/** espelha as cores de papel do global.css pro minimap do react flow */
export const NOTE_HEX = [
  "#f6c89f",
  "#eaa9b2",
  "#b8d6bd",
  "#b7b0df",
  "#d1c2e5",
  "#e6b18e",
];

export function hashString(input: string): number {
  let hash = 2166136261;

  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function noteColorFor(id: string): number {
  return hashString(id) % NOTE_HEX.length;
}

export function noteRotationFor(id: string): number {
  return ((hashString(id) % 9) - 4) * 0.55;
}

export function formatTool(tool: SlopTool): string {
  if (tool === "texto") return "texto";

  return NOTE_TOOLS.find((item) => item.value === tool)?.label ?? tool;
}

export function sanitizeText(value: string, max = MAX_TEXT): string {
  return value
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
    .slice(0, max);
}

export function createSlopId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `slop-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function formatRelative(isoDate: string): string {
  const date = new Date(isoDate);

  if (Number.isNaN(date.getTime())) return "";

  const minutes = Math.floor((Date.now() - date.getTime()) / 60_000);

  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;

  const hours = Math.floor(minutes / 60);

  if (hours < 24) return `há ${hours} h`;

  const days = Math.floor(hours / 24);

  if (days < 30) return `há ${days} d`;

  return date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
}

export function toItems(posts: SlopPostInput[], notes: SlopNote[]): SlopItem[] {
  const noteItems: SlopItem[] = notes.map((note) => ({
    ...note,
    kind: "note",
  }));

  const postItems: SlopItem[] = posts.map((post) => ({
    id: `post-${post.slug}`,
    kind: "post",
    text: post.title,
    description: post.description,
    tool: "texto",
    color: noteColorFor(post.slug),
    createdAt: post.date,
    href: `/ai-slops/${post.slug}/`,
  }));

  return [...noteItems, ...postItems].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function estimateItemHeight(item: SlopItem): number {
  const bodyLength =
    item.text.length + (item.description?.length ?? 0) * 0.9;
  const lines = Math.ceil(bodyLength / 26);

  return Math.min(430, Math.max(180, 138 + lines * 23));
}

export function layoutMasonry(
  items: SlopItem[],
  containerWidth: number,
): Record<string, BoardPosition> {
  const columns = Math.max(
    1,
    Math.min(5, Math.floor((containerWidth + GAP_X) / (NOTE_WIDTH + GAP_X))),
  );
  const heights = new Array<number>(columns).fill(0);
  const positions: Record<string, BoardPosition> = {};

  for (const item of items) {
    let column = 0;

    for (let index = 1; index < columns; index += 1) {
      if (heights[index] < heights[column] - 1) column = index;
    }

    positions[item.id] = {
      x: column * (NOTE_WIDTH + GAP_X),
      y: heights[column],
    };

    heights[column] += estimateItemHeight(item) + GAP_Y;
  }

  return positions;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isNoteTool(value: unknown): value is NoteTool {
  return NOTE_TOOLS.some((tool) => tool.value === value);
}

function parseNote(value: unknown): SlopNote | null {
  if (!isRecord(value)) return null;

  const text = typeof value.text === "string" ? sanitizeText(value.text) : "";

  if (!text) return null;

  const tool = isNoteTool(value.tool) ? value.tool : "outra";
  const color =
    typeof value.color === "number" && Number.isFinite(value.color)
      ? Math.abs(Math.trunc(value.color)) % NOTE_HEX.length
      : 0;
  const createdAt =
    typeof value.createdAt === "string" &&
    !Number.isNaN(new Date(value.createdAt).getTime())
      ? value.createdAt
      : new Date().toISOString();
  const author =
    typeof value.author === "string"
      ? sanitizeText(value.author, MAX_AUTHOR) || undefined
      : undefined;
  const id =
    typeof value.id === "string" && value.id.length > 0
      ? value.id.slice(0, 80)
      : createSlopId();

  return { id, text, tool, author, color, createdAt };
}

function parseComment(value: unknown): SlopComment | null {
  if (!isRecord(value)) return null;

  const text =
    typeof value.text === "string" ? sanitizeText(value.text, MAX_COMMENT) : "";

  if (!text) return null;

  const author =
    typeof value.author === "string"
      ? sanitizeText(value.author, MAX_AUTHOR) || undefined
      : undefined;
  const createdAt =
    typeof value.createdAt === "string" &&
    !Number.isNaN(new Date(value.createdAt).getTime())
      ? value.createdAt
      : new Date().toISOString();
  const id =
    typeof value.id === "string" && value.id.length > 0
      ? value.id.slice(0, 80)
      : createSlopId();

  return { id, text, author, createdAt };
}

function parseComments(
  value: unknown,
): Record<string, SlopComment[]> {
  if (!isRecord(value)) return {};

  const comments: Record<string, SlopComment[]> = {};

  for (const [itemId, list] of Object.entries(value).slice(0, 400)) {
    if (!Array.isArray(list)) continue;

    const parsed = list
      .slice(0, MAX_COMMENTS)
      .map(parseComment)
      .filter((comment): comment is SlopComment => Boolean(comment));

    if (parsed.length > 0) comments[itemId.slice(0, 80)] = parsed;
  }

  return comments;
}

function parsePositions(value: unknown): Record<string, BoardPosition> {
  if (!isRecord(value)) return {};

  const positions: Record<string, BoardPosition> = {};

  for (const [id, position] of Object.entries(value).slice(0, 400)) {
    if (!isRecord(position)) continue;

    const { x, y } = position;

    if (
      typeof x === "number" &&
      typeof y === "number" &&
      Number.isFinite(x) &&
      Number.isFinite(y)
    ) {
      positions[id.slice(0, 80)] = {
        x: Math.max(-100_000, Math.min(100_000, x)),
        y: Math.max(-100_000, Math.min(100_000, y)),
      };
    }
  }

  return positions;
}

export function parseBoard(raw: string): BoardState | null {
  try {
    const value: unknown = JSON.parse(raw);

    if (!isRecord(value) || value.version !== 1) return null;

    const notesSource = Array.isArray(value.notes) ? value.notes : [];
    const notes: SlopNote[] = [];
    const seenIds = new Set<string>();

    for (const candidate of notesSource.slice(0, MAX_NOTES)) {
      const note = parseNote(candidate);

      if (note && !seenIds.has(note.id)) {
        if (note.id.startsWith("post-")) note.id = createSlopId();

        seenIds.add(note.id);
        notes.push(note);
      }
    }

    return {
      version: 1,
      notes,
      positions: parsePositions(value.positions),
      comments: parseComments(value.comments),
    };
  } catch {
    return null;
  }
}

export function loadBoard(): BoardState {
  if (typeof window === "undefined") {
    return { version: 1, notes: [], positions: {}, comments: {} };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    return (raw ? parseBoard(raw) : null) ?? {
      version: 1,
      notes: [],
      positions: {},
      comments: {},
    };
  } catch {
    return { version: 1, notes: [], positions: {}, comments: {} };
  }
}

export function saveBoard(state: BoardState): void {
  if (typeof window === "undefined") return;

  try {
    const notes = state.notes
      .slice(0, MAX_NOTES)
      .map(({ fresh: _fresh, deleting: _deleting, ...note }) => note);

    const comments = Object.fromEntries(
      Object.entries(state.comments)
        .slice(0, 400)
        .map(([itemId, list]) => [
          itemId,
          list.slice(0, MAX_COMMENTS).map(({ id, text, author, createdAt }) => ({
            id,
            text: sanitizeText(text, MAX_COMMENT),
            author,
            createdAt,
          })),
        ])
        .filter(([, list]) => list.length > 0),
    );

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        notes,
        positions: state.positions,
        comments,
      }),
    );
  } catch {
    // localStorage pode estar cheio ou bloqueado: a lousa segue em memória.
  }
}

export function copyTextFor(item: SlopItem): string {
  if (item.kind === "post") {
    const href =
      typeof window === "undefined" || !item.href
        ? item.href
        : new URL(item.href, window.location.origin).toString();

    return [item.text, item.description, href]
      .filter((part): part is string => Boolean(part))
      .join("\n");
  }

  return item.text;
}

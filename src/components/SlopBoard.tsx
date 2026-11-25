import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useNodesInitialized,
  useReactFlow,
  type OnNodeDrag,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import SlopCard from "./SlopCard";
import SlopComposer, { type SlopDraft } from "./SlopComposer";
import SlopReader from "./SlopReader";
import SlopTicker, {
  type TickerEvent,
  type TickerTone,
} from "./SlopTicker";
import SlopNoteNode, {
  type SlopBoardNode,
  type SlopNoteData,
} from "./SlopNoteNode";
import { SlopNoteActionsContext } from "../lib/slop-actions";
import {
  MAX_AUTHOR,
  MAX_COMMENT,
  MAX_COMMENTS,
  MAX_NOTES,
  NOTE_HEX,
  NOTE_TOOLS,
  NOTE_WIDTH,
  createSlopId,
  estimateItemHeight,
  layoutMasonry,
  loadBoard,
  parseBoard,
  sanitizeText,
  saveBoard,
  toItems,
  type BoardPosition,
  type SlopComment,
  type SlopItem,
  type SlopNote,
  type SlopPostInput,
  type SlopTool,
} from "../lib/slops";

type Props = {
  posts: SlopPostInput[];
};

type Filter = "todos" | SlopTool;

const nodeTypes = { slop: SlopNoteNode };

const FILTERS: { value: Filter; label: string }[] = [
  { value: "todos", label: "todos" },
  ...NOTE_TOOLS.map((tool) => ({ value: tool.value, label: tool.label })),
  { value: "texto", label: "do site" },
];

function toBoardNode(
  item: SlopItem,
  index: number,
  position: BoardPosition,
): SlopBoardNode {
  return {
    id: item.id,
    type: "slop",
    position,
    dragHandle: ".slop-note-head",
    data: { item, index },
  };
}

function findFreePosition(
  item: SlopItem,
  center: BoardPosition,
  nodes: SlopBoardNode[],
  bounds: { minX: number; minY: number; maxX: number; maxY: number } | null,
): BoardPosition {
  const width = NOTE_WIDTH;
  const height = estimateItemHeight(item);
  const start = { x: center.x - width / 2, y: center.y - height / 2 };
  const offsets: [number, number][] = [[0, 0]];

  for (let ring = 1; ring <= 10; ring += 1) {
    const distance = ring * 54;
    offsets.push(
      [distance, 0],
      [-distance, 0],
      [0, distance],
      [0, -distance],
      [distance, distance],
      [-distance, distance],
      [distance, -distance],
      [-distance, -distance],
    );
  }

  const gap = 16;

  function check(respectBounds: boolean, candidate: BoardPosition) {
    if (
      respectBounds &&
      bounds &&
      (candidate.x < bounds.minX ||
        candidate.y < bounds.minY ||
        candidate.x + width > bounds.maxX ||
        candidate.y + height > bounds.maxY)
    ) {
      return false;
    }

    return !nodes.some((node) => {
      const other = node.position;
      const otherHeight = estimateItemHeight(node.data.item);

      return !(
        candidate.x + width + gap <= other.x ||
        other.x + NOTE_WIDTH + gap <= candidate.x ||
        candidate.y + height + gap <= other.y ||
        other.y + otherHeight + gap <= candidate.y
      );
    });
  }

  for (const [dx, dy] of offsets) {
    const candidate = { x: start.x + dx, y: start.y + dy };
    if (check(true, candidate)) return candidate;
  }

  for (const [dx, dy] of offsets) {
    const candidate = { x: start.x + dx, y: start.y + dy };
    if (check(false, candidate)) return candidate;
  }

  return start;
}

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);

    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

export default function SlopBoard({ posts }: Props) {
  return (
    <ReactFlowProvider>
      <SlopBoardInner posts={posts} />
    </ReactFlowProvider>
  );
}

function SlopBoardInner({ posts }: Props) {
  const isMobile = useMediaQuery("(max-width: 900px)");
  const boardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toastTimer = useRef<number | null>(null);
  const organizeTimer = useRef<number | null>(null);
  const deleteTimers = useRef<number[]>([]);
  const tickerTimer = useRef<number | null>(null);
  const [notes, setNotes] = useState<SlopNote[]>([]);
  const [comments, setComments] = useState<Record<string, SlopComment[]>>({});
  const [positions, setPositions] = useState<Record<string, BoardPosition>>({});
  const [nodes, setNodes, onNodesChange] = useNodesState<SlopBoardNode>([]);
  const [filter, setFilter] = useState<Filter>("todos");
  const [composerOpen, setComposerOpen] = useState(false);
  const [reading, setReading] = useState<SlopItem | null>(null);
  const [readerFocusComments, setReaderFocusComments] = useState(false);
  const [organizing, setOrganizing] = useState(false);
  const [toast, setToast] = useState<{ id: number; text: string } | null>(null);
  const [tickerEvent, setTickerEvent] = useState<TickerEvent | null>(null);
  const [ready, setReady] = useState(false);
  const nodesInitialized = useNodesInitialized();
  const didFit = useRef(false);
  const { screenToFlowPosition, fitView, getViewport, setViewport } =
    useReactFlow<SlopBoardNode>();

  const showToast = useCallback((text: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current);

    setToast({ id: Date.now(), text });
    toastTimer.current = window.setTimeout(() => setToast(null), 2600);
  }, []);

  const signal = useCallback(
    (text: string, tone: TickerTone = "info", duration = 4600) => {
      if (tickerTimer.current) window.clearTimeout(tickerTimer.current);

      setTickerEvent({ id: Date.now(), text, tone });
      tickerTimer.current = window.setTimeout(
        () => setTickerEvent(null),
        duration,
      );
    },
    [],
  );

  useEffect(() => {
    const saved = loadBoard();
    const items = toItems(posts, saved.notes);
    const width = boardRef.current?.clientWidth ?? 1000;
    const auto = layoutMasonry(items, width);
    const nextPositions = { ...auto, ...saved.positions };

    setNotes(saved.notes);
    setComments(saved.comments);
    setPositions(nextPositions);
    setNodes(
      items.map((item, index) =>
        toBoardNode(
          item,
          index,
          nextPositions[item.id] ?? auto[item.id] ?? { x: 0, y: index * 200 },
        ),
      ),
    );
    setReady(true);
  }, [posts, setNodes]);

  useEffect(() => {
    if (isMobile || !ready || !nodesInitialized || didFit.current) return;

    didFit.current = true;

    const timer = window.setTimeout(() => {
      void fitView({ padding: 0.04, minZoom: 0.75, maxZoom: 1.15 }).then(
        () => {
          const viewport = getViewport();

          setViewport({ ...viewport, y: 32 });
        },
      );
    }, 60);

    return () => window.clearTimeout(timer);
  }, [fitView, getViewport, isMobile, nodesInitialized, ready, setViewport]);

  useEffect(() => {
    if (!ready) return;

    const timer = window.setTimeout(() => {
      saveBoard({ version: 1, notes, positions, comments });
    }, 240);

    return () => window.clearTimeout(timer);
  }, [comments, notes, positions, ready]);

  useEffect(() => {
    setNodes((current) =>
      current.map((node) => ({
        ...node,
        hidden: filter !== "todos" && node.data.item.tool !== filter,
      })),
    );
  }, [filter, setNodes]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (composerOpen || reading || event.defaultPrevented) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const target = event.target as HTMLElement | null;

      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (event.key.toLowerCase() === "n") {
        event.preventDefault();
        setComposerOpen(true);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [composerOpen, reading]);

  useEffect(() => {
    return () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
      if (organizeTimer.current) window.clearTimeout(organizeTimer.current);
      if (tickerTimer.current) window.clearTimeout(tickerTimer.current);
      deleteTimers.current.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const copy = useCallback(
    (text: string) => {
      if (!navigator.clipboard?.writeText) {
        showToast("cópia indisponível neste navegador");
        signal("sinal corrompido // clipboard indisponível", "error");
        return;
      }

      void navigator.clipboard.writeText(text).then(
        () => {
          showToast("slop copiado!");
          signal("copiado // texto completo", "ok", 2600);
        },
        () => {
          showToast("não deu pra copiar :(");
          signal("falha na cópia // tenta de novo", "error");
        },
      );
    },
    [showToast, signal],
  );

  const openReader = useCallback(
    (item: SlopItem, focusComments = false) => {
      setReading(item);
      setReaderFocusComments(focusComments);
      signal(
        focusComments
          ? `comentários // ${item.text.slice(0, 30)}`
          : `lendo // ${item.text.slice(0, 34)}`,
        "info",
        5200,
      );
    },
    [signal],
  );

  const addComment = useCallback(
    (itemId: string, text: string, author?: string) => {
      const clean = sanitizeText(text, MAX_COMMENT);

      if (!clean) return;

      const comment: SlopComment = {
        id: createSlopId(),
        text: clean,
        author: author
          ? sanitizeText(author, MAX_AUTHOR) || undefined
          : undefined,
        createdAt: new Date().toISOString(),
      };

      setComments((current) => {
        const list = [...(current[itemId] ?? []), comment];
        return { ...current, [itemId]: list.slice(-MAX_COMMENTS) };
      });
      showToast("comentário salvo no teu navegador");
      signal("+ comentário // salvo localmente", "ok", 3400);
    },
    [showToast, signal],
  );

  const removeComment = useCallback(
    (itemId: string, commentId: string) => {
      setComments((current) => {
        const next = { ...current };
        const list = (next[itemId] ?? []).filter(
          (comment) => comment.id !== commentId,
        );

        if (list.length > 0) next[itemId] = list;
        else delete next[itemId];

        return next;
      });
      showToast("comentário apagado");
      signal("− comentário // apagado", "warn", 3000);
    },
    [showToast, signal],
  );

  const commentCountFor = useCallback(
    (id: string) => comments[id]?.length ?? 0,
    [comments],
  );

  const selectFilter = useCallback(
    (next: Filter) => {
      setFilter(next);
      signal(
        next === "todos" ? "filtro // todos os slops" : `filtro // ${next}`,
        "info",
        3400,
      );
    },
    [signal],
  );

  const addNote = useCallback(
    (draft: SlopDraft) => {
      if (notes.length >= MAX_NOTES) {
        showToast(`limite de ${MAX_NOTES} slops na lousa`);
        signal("buffer cheio // limite de slops", "warn");
        return;
      }

      const text = sanitizeText(draft.text);

      if (!text) return;

      const note: SlopNote = {
        id: createSlopId(),
        text,
        tool: draft.tool,
        author: draft.author || undefined,
        color: draft.color,
        createdAt: new Date().toISOString(),
        fresh: true,
      };
      const item: SlopItem = { ...note, kind: "note" };
      const board = boardRef.current;
      let position: BoardPosition;

      if (board && !isMobile) {
        const rect = board.getBoundingClientRect();
        const topLeft = screenToFlowPosition({
          x: rect.left,
          y: rect.top,
        });
        const bottomRight = screenToFlowPosition({
          x: rect.right,
          y: rect.bottom,
        });
        const center = {
          x: (topLeft.x + bottomRight.x) / 2,
          y: (topLeft.y + bottomRight.y) / 2,
        };
        const bounds = {
          minX: topLeft.x + 18,
          minY: topLeft.y + 18,
          maxX: bottomRight.x - 18,
          maxY: bottomRight.y - 18,
        };

        position = findFreePosition(item, center, nodes, bounds);
      } else {
        position = {
          x: 40 + (notes.length % 3) * 290,
          y: 40 + Math.floor(notes.length / 3) * 70,
        };
      }

      setNotes((current) => [note, ...current]);
      setPositions((current) => ({ ...current, [note.id]: position }));
      setNodes((current) => [...current, toBoardNode(item, 0, position)]);
      setFilter("todos");
      setComposerOpen(false);
      showToast("slop pregado! fica no teu navegador");
      signal(
        `+ slop pregado // ${notes.filter((note) => !note.deleting).length + 1} notas locais`,
        "ok",
      );
    },
    [
      isMobile,
      nodes,
      notes,
      screenToFlowPosition,
      setNodes,
      showToast,
      signal,
    ],
  );

  const remove = useCallback(
    (id: string) => {
      const note = notes.find((candidate) => candidate.id === id);

      if (!note || note.deleting) return;

      setNotes((current) =>
        current.map((candidate) =>
          candidate.id === id ? { ...candidate, deleting: true } : candidate,
        ),
      );
      setNodes((current) =>
        current.map((node) =>
          node.id === id
            ? {
                ...node,
                data: {
                  ...node.data,
                  item: { ...node.data.item, deleting: true },
                },
              }
            : node,
        ),
      );

      const timer = window.setTimeout(() => {
        setNotes((current) =>
          current.filter((candidate) => candidate.id !== id),
        );
        setNodes((current) => current.filter((node) => node.id !== id));
        setPositions((current) => {
          const next = { ...current };
          delete next[id];
          return next;
        });
        setComments((current) => {
          const next = { ...current };
          delete next[id];
          return next;
        });
        showToast("slop apagado");
        signal(
          `− slop apagado // ${Math.max(
            0,
            notes.filter((candidate) => !candidate.deleting).length - 1,
          )} notas locais`,
          "error",
          5600,
        );
      }, 360);

      deleteTimers.current.push(timer);
    },
    [notes, setNodes, showToast, signal],
  );

  const organize = useCallback(() => {
    const items = toItems(
      posts,
      notes.filter((note) => !note.deleting),
    );
    const width = boardRef.current?.clientWidth ?? 1000;
    const nextPositions = layoutMasonry(items, width);

    setPositions(nextPositions);
    setNodes((current) =>
      current.map((node) => ({
        ...node,
        position: nextPositions[node.id] ?? node.position,
      })),
    );
    setOrganizing(true);

    if (organizeTimer.current) window.clearTimeout(organizeTimer.current);

    organizeTimer.current = window.setTimeout(() => setOrganizing(false), 580);
    showToast("lousa organizada");
    signal("lousa organizada // posições recalculadas", "info");
  }, [notes, posts, setNodes, showToast, signal]);

  const exportBoard = useCallback(() => {
    const notesForExport = notes
      .filter((note) => !note.deleting)
      .map((note) => ({
        id: note.id,
        text: note.text,
        tool: note.tool,
        author: note.author,
        color: note.color,
        createdAt: note.createdAt,
      }));

    const commentCount = Object.values(comments).reduce(
      (total, list) => total + list.length,
      0,
    );

    if (notesForExport.length === 0 && commentCount === 0) {
      showToast("lousa vazia — nada pra exportar");
      signal("nada pra exportar // lousa vazia", "warn");
      return;
    }

    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      notes: notesForExport,
      positions,
      comments,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `ai-slops-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1500);
    showToast(
      `${notesForExport.length} slop(s) + ${commentCount} comentário(s) exportado(s)`,
    );
    signal(
      `exportado // ${notesForExport.length} notas · ${commentCount} comentários`,
      "info",
    );
  }, [comments, notes, positions, showToast, signal]);

  const importBoard = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const input = event.currentTarget;
      const file = input.files?.[0];
      input.value = "";

      if (!file) return;

      const parsed = parseBoard(await file.text());

      if (!parsed) {
        showToast("arquivo inválido ou de outra versão");
        signal("sinal corrompido // arquivo inválido", "error", 6000);
        return;
      }

      if (
        notes.length > 0 &&
        !window.confirm(
          `substituir os ${notes.length} slops atuais pelos ${parsed.notes.length} do arquivo?`,
        )
      ) {
        return;
      }

      const items = toItems(posts, parsed.notes);
      const width = boardRef.current?.clientWidth ?? 1000;
      const auto = layoutMasonry(items, width);
      const nextPositions = { ...auto, ...parsed.positions };

      setNotes(parsed.notes);
      setComments(parsed.comments);
      setPositions(nextPositions);
      setNodes(
        items.map((item, index) =>
          toBoardNode(
            item,
            index,
            nextPositions[item.id] ??
              auto[item.id] ?? { x: 0, y: index * 200 },
          ),
        ),
      );
      setFilter("todos");
      showToast(`lousa importada: ${parsed.notes.length} slop(s)`);
      signal(`importado // ${parsed.notes.length} notas locais`, "info", 6000);
    },
    [notes.length, posts, setNodes, showToast, signal],
  );

  const clearBoard = useCallback(() => {
    if (notes.length === 0) return;

    if (
      !window.confirm(
        "apagar todos os teus slops? os textos do site continuam pregados.",
      )
    ) {
      return;
    }

    const nextPositions: Record<string, BoardPosition> = {};

    for (const [id, position] of Object.entries(positions)) {
      if (id.startsWith("post-")) nextPositions[id] = position;
    }

    const localIds = new Set(notes.map((note) => note.id));

    setNotes([]);
    setComments((current) =>
      Object.fromEntries(
        Object.entries(current).filter(([id]) => !localIds.has(id)),
      ),
    );
    setPositions(nextPositions);
    setNodes((current) =>
      current.filter((node) => node.data.item.kind === "post"),
    );
    showToast("lousa limpa");
    signal("sinal perdido // lousa limpa", "error", 7200);
  }, [notes, positions, setNodes, showToast, signal]);

  const handleDragStop: OnNodeDrag<SlopBoardNode> = useCallback(
    (_event, node) => {
      setPositions((current) => ({
        ...current,
        [node.id]: { x: node.position.x, y: node.position.y },
      }));
    },
    [],
  );

  const allItems = useMemo(() => toItems(posts, notes), [posts, notes]);
  const visibleItems = useMemo(
    () =>
      filter === "todos"
        ? allItems
        : allItems.filter((item) => item.tool === filter),
    [allItems, filter],
  );
  const customCount = notes.filter((note) => !note.deleting).length;

  return (
    <SlopNoteActionsContext.Provider
      value={{ open: openReader, remove, commentCountFor }}
    >
      <div className="slop-shell">
        <SlopTicker
          notesCount={customCount}
          siteCount={posts.length}
          latestTitle={posts[0]?.title}
          ready={ready}
          event={tickerEvent}
        />

        <div className="slop-toolbar">
          <div className="slop-toolbar-main">
            <p className="slop-count">
              <strong key={customCount}>{customCount}</strong> teus{" "}
              <span>·</span> {posts.length} do site
            </p>

            <div
              className="slop-filters"
              role="group"
              aria-label="filtrar a lousa"
            >
              {FILTERS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className="slop-filter"
                  data-tool={option.value}
                  aria-pressed={filter === option.value}
                  onClick={() => selectFilter(option.value)}
                >
                  <i className="slop-filter-dot" aria-hidden="true" />
                  {option.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              className="slop-btn slop-btn--primary"
              onClick={() => setComposerOpen(true)}
            >
              <span className="slop-btn-plus" aria-hidden="true">
                +
              </span>
              pregar slop
            </button>
          </div>

          <div className="slop-toolbar-actions">
            <div
              className="slop-btn-group"
              role="group"
              aria-label="ferramentas da lousa"
            >
              {!isMobile && (
                <button
                  type="button"
                  className="slop-btn"
                  onClick={organize}
                  disabled={!ready}
                >
                  <span className="slop-btn-icon" aria-hidden="true">
                    ▦
                  </span>
                  organizar
                </button>
              )}

              <button
                type="button"
                className="slop-btn"
                onClick={exportBoard}
                disabled={!ready}
              >
                <span className="slop-btn-icon" aria-hidden="true">
                  ↓
                </span>
                exportar
              </button>

              <button
                type="button"
                className="slop-btn"
                onClick={() => fileInputRef.current?.click()}
              >
                <span className="slop-btn-icon" aria-hidden="true">
                  ↑
                </span>
                importar
              </button>
              <input
                ref={fileInputRef}
                className="slop-file-input"
                type="file"
                accept="application/json,.json"
                aria-label="importar lousa"
                onChange={importBoard}
              />
            </div>

            <button
              type="button"
              className="slop-btn slop-btn--danger"
              onClick={clearBoard}
              disabled={customCount === 0}
            >
              <span className="slop-btn-icon" aria-hidden="true">
                ×
              </span>
              limpar
            </button>
          </div>
        </div>

        {isMobile ? (
          <div className="slop-wall">
            {visibleItems.length === 0 ? (
              <p className="slop-empty">
                nenhum slop com esse filtro.{" "}
                <button
                  type="button"
                  className="slop-empty-link"
                  onClick={() => setComposerOpen(true)}
                >
                  pregar o primeiro
                </button>
              </p>
            ) : (
              visibleItems.map((item, index) => (
                <SlopCard
                  key={item.id}
                  item={item}
                  index={index}
                  commentCount={commentCountFor(item.id)}
                  onOpen={openReader}
                  onComment={() => openReader(item, true)}
                  onDelete={remove}
                />
              ))
            )}
          </div>
        ) : (
          <div
            ref={boardRef}
            className={`slop-board${organizing ? " is-organizing" : ""}`}
          >
            {ready ? (
              <ReactFlow<SlopBoardNode>
                nodes={nodes}
                onNodesChange={onNodesChange}
                onNodeDragStop={handleDragStop}
                nodeTypes={nodeTypes}
                minZoom={0.2}
                maxZoom={2.4}
                nodesConnectable={false}
                zoomOnDoubleClick={false}
                defaultViewport={{ x: 18, y: 32, zoom: 1 }}
              >
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={26}
                  size={1.4}
                  color="var(--border)"
                />
                <Controls showInteractive={false} />
                <MiniMap
                  pannable
                  zoomable
                  nodeColor={(node) =>
                    NOTE_HEX[(node.data as SlopNoteData).item.color] ??
                    NOTE_HEX[0]
                  }
                  maskColor="rgb(3 5 12 / 0.72)"
                  style={{ bottom: 30 }}
                />
                <Panel position="top-left" className="slop-panel">
                  <span>lousa local · clica pra ler</span>
                </Panel>
              </ReactFlow>
            ) : (
              <p className="slop-loading">carregando a lousa…</p>
            )}

            {ready && visibleItems.length === 0 && (
              <div className="slop-board-empty">
                <div>
                  <p>nada com esse filtro.</p>
                  <button
                    type="button"
                    className="slop-btn"
                    onClick={() => selectFilter("todos")}
                  >
                    ver todos
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <SlopComposer
        open={composerOpen}
        onClose={() => setComposerOpen(false)}
        onSubmit={addNote}
      />

      <SlopReader
        item={reading}
        comments={reading ? comments[reading.id] ?? [] : []}
        focusComments={readerFocusComments}
        onClose={() => {
          setReading(null);
          setReaderFocusComments(false);
        }}
        onCopy={copy}
        onAddComment={(text, author) => {
          if (reading) addComment(reading.id, text, author);
        }}
        onDeleteComment={(commentId) => {
          if (reading) removeComment(reading.id, commentId);
        }}
      />

      {toast && (
        <div className="slop-toast" key={toast.id} role="status">
          {toast.text}
        </div>
      )}
    </SlopNoteActionsContext.Provider>
  );
}

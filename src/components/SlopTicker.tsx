import { useEffect, useMemo, useRef, useState } from "react";

export type TickerTone = "ok" | "warn" | "error" | "info";

export type TickerEvent = {
  id: number;
  text: string;
  tone: TickerTone;
};

type Props = {
  notesCount: number;
  siteCount: number;
  latestTitle?: string;
  ready: boolean;
  event: TickerEvent | null;
};

const GLYPHS = "█▓▒░#@%&";
const SIGNAL_KEY = "slop-signal";

function corrupt(text: string, intensity = 0.16) {
  return [...text]
    .map((char) => {
      if (char === " " || Math.random() > intensity) return char;
      return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
    })
    .join("");
}

function useClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );

    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return time;
}

export default function SlopTicker({
  notesCount,
  siteCount,
  latestTitle,
  ready,
  event,
}: Props) {
  const [index, setIndex] = useState(0);
  const [glitching, setGlitching] = useState(false);
  const [lost, setLost] = useState(false);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const [bootEvent, setBootEvent] = useState<TickerEvent | null>(null);
  const [signalOn, setSignalOn] = useState(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem(SIGNAL_KEY) !== "off";
  });
  const time = useClock();
  const bootTimer = useRef<number | null>(null);
  const booted = useRef(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!reduceMotion) return;
    setGlitching(false);
    setLost(false);
  }, [reduceMotion]);

  const messages = useMemo(
    () =>
      [
        "nada sai do teu navegador",
        "o mural vive só ali",
        "clica num post-it pra ler",
        "arrasta pelo cabeçalho",
        "sem conta · sem servidor · sem cookies",
        `${siteCount} textos do site continuam pregados`,
        "o teu slop é teu",
        "se apagar, some",
        ...(latestTitle ? [`último texto // ${latestTitle}`] : []),
      ].filter(Boolean),
    [siteCount, latestTitle],
  );

  useEffect(() => {
    if (!ready || booted.current) return;

    booted.current = true;
    setBootEvent({
      id: Date.now(),
      tone: notesCount > 0 ? "ok" : "info",
      text:
        notesCount > 0
          ? `bem-vindo de volta // ${notesCount} nota${notesCount === 1 ? "" : "s"} encontrada${notesCount === 1 ? "" : "s"}`
          : "primeira visita // lousa vazia",
    });

    bootTimer.current = window.setTimeout(() => setBootEvent(null), 4600);

    return () => {
      if (bootTimer.current) window.clearTimeout(bootTimer.current);
    };
  }, [ready]);

  useEffect(() => {
    if (paused || hovered || event || bootEvent || !ready) return;

    const timer = window.setInterval(
      () => setIndex((current) => current + 1),
      5000,
    );

    return () => window.clearInterval(timer);
  }, [bootEvent, event, hovered, paused, ready]);

  useEffect(() => {
    if (!signalOn || paused || hovered || !ready || reduceMotion) return;

    let alive = true;
    let timer = 0;

    const flash = () => {
      if (!alive) return;

      setGlitching(true);
      const duration = 130 + Math.random() * 210;

      timer = window.setTimeout(() => {
        if (!alive) return;
        setGlitching(false);

        if (Math.random() < 0.2) {
          setLost(true);
          timer = window.setTimeout(() => {
            if (!alive) return;
            setLost(false);
            timer = window.setTimeout(flash, 5000 + Math.random() * 4000);
          }, 900);
          return;
        }

        timer = window.setTimeout(flash, 5000 + Math.random() * 4000);
      }, duration);
    };

    timer = window.setTimeout(flash, 2200 + Math.random() * 2200);

    return () => {
      alive = false;
      window.clearTimeout(timer);
    };
  }, [hovered, paused, ready, reduceMotion, signalOn]);

  useEffect(() => {
    if (!event) return;

    const timer = window.setTimeout(() => {
      setGlitching(false);
      setLost(false);
    }, 300);

    return () => window.clearTimeout(timer);
  }, [event]);

  const activeEvent = event ?? bootEvent;
  const idle = messages[index % messages.length] ?? "sinal local";
  const visualIdle =
    glitching && signalOn ? corrupt(idle, 0.22) : idle;
  const visualEvent =
    activeEvent && glitching && signalOn
      ? { ...activeEvent, text: corrupt(activeEvent.text, 0.12) }
      : activeEvent;

  const tone = lost
    ? "error"
    : activeEvent
      ? activeEvent.tone
      : glitching
        ? "warn"
        : "idle";

  function toggleSignal() {
    const next = !signalOn;
    setSignalOn(next);
    localStorage.setItem(SIGNAL_KEY, next ? "on" : "off");
    if (!next) {
      setGlitching(false);
      setLost(false);
    }
  }

  return (
    <div
      className={[
        "slop-ticker",
        glitching ? "is-glitching" : "",
        lost ? "is-lost" : "",
        paused || hovered ? "is-stable" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-tone={tone}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      onClick={() => setPaused((current) => !current)}
      role="group"
      aria-label="status da lousa"
      title={paused ? "clique para retomar" : "clique para pausar · hover estabiliza"}
    >
      <span className="slop-ticker-status">
        <i className="slop-ticker-led" aria-hidden="true" />
        <span>sys.local</span>
        {time && <span className="slop-ticker-clock">{time}</span>}
      </span>

      <div className="slop-ticker-window" aria-hidden="true">
        {lost ? (
          <span className="slop-ticker-line">
            ▓▓▓ sinal perdido ▓▓▓
          </span>
        ) : visualEvent ? (
          <span className="slop-ticker-line is-event">
            {visualEvent.text}
          </span>
        ) : (
          <div className="slop-ticker-track" key={index}>
            <span>{visualIdle}</span>
            <span>{visualIdle}</span>
          </div>
        )}
      </div>

      <span className="slop-ticker-counts">
        {lost ? "--" : notesCount} local
        <span aria-hidden="true"> · </span>
        {lost ? "--" : siteCount} site
      </span>

      <button
        type="button"
        className="slop-ticker-sig"
        onClick={(clickEvent) => {
          clickEvent.stopPropagation();
          toggleSignal();
        }}
        aria-pressed={signalOn}
        title={signalOn ? "estabilizar ticker" : "reativar corrupção"}
      >
        sig
      </button>

      <span className="visually-hidden" role="status" aria-live="polite">
        {activeEvent?.text ?? ""}
      </span>
    </div>
  );
}

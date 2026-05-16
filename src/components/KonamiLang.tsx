import { useState, useEffect, useRef } from "react";

const KONAMI = [
  "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
  "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
  "b","a",
];

export default function KonamiLang() {
  const [visible, setVisible] = useState(false);
  const [lang, setLang] = useState("pt-br");
  const seq = useRef([]);

  useEffect(() => {
    const saved = localStorage.getItem("lang") || "pt-br";
    setLang(saved);
    document.documentElement.setAttribute("data-lang", saved);
    if (saved === "en") setVisible(true);
  }, []);

  useEffect(() => {
    function onKey(e) {
      seq.current = [...seq.current, e.key].slice(-KONAMI.length);
      if (seq.current.join(",") === KONAMI.join(",")) {
        setVisible(true);
        seq.current = [];
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function toggle() {
    const next = lang === "pt-br" ? "en" : "pt-br";
    setLang(next);
    localStorage.setItem("lang", next);
    document.documentElement.setAttribute("data-lang", next);
    document.documentElement.lang = next;
  }

  if (!visible) return null;

  return (
    <button
      onClick={toggle}
      title={lang === "pt-br" ? "switch to english" : "mudar para portugues"}
      aria-label="toggle language"
      className="lang-toggle"
    >
      {lang === "pt-br" ? "en" : "pt"}
    </button>
  );
}

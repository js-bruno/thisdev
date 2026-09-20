import { useState, useEffect } from "react";

export default function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as "dark" | "light" | null;
    const initial = stored ?? "dark";
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  function toggle() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      title={theme === "dark" ? "Mudar para claro" : "Mudar para escuro"}
      style={{
        background: "none",
        border: "none",
        color: "var(--muted)",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: "0.95em",
        padding: "0.2rem 0",
        lineHeight: 1.4,
      }}
    >
      {theme === "dark" ? "claro" : "escuro"}
    </button>
  );
}

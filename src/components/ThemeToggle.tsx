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
      title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      style={{
        background: "none",
        border: "1px solid currentColor",
        color: "inherit",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: "0.85em",
        padding: "2px 8px",
        borderRadius: "2px",
        lineHeight: 1.4,
        opacity: 0.75,
      }}
    >
      {theme === "dark" ? "☀ light" : "☾ dark"}
    </button>
  );
}

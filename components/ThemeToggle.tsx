"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, SunMoon } from "lucide-react";
import { THEME_STORAGE_KEY, type ThemeMode } from "@/lib/theme";

// Why this is a Client Component: it reads and writes localStorage and
// mutates a DOM attribute directly (document.documentElement) on click —
// both are browser-only operations with no server-side equivalent. There's
// no way to express "handle this click" or "remember this choice across
// reloads" from a Server Component; that's the actual dividing line the
// project's component table draws between Server and Client, not "this one
// happens to have UI".
function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  if (mode === "system") {
    // No attribute = defer to the `@media (prefers-color-scheme)` rule in
    // globals.css. This is the "forget my choice, follow the OS" state.
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", mode);
  }
}

const OPTIONS: { mode: ThemeMode; label: string; Icon: typeof Sun }[] = [
  { mode: "light", label: "Light theme", Icon: Sun },
  { mode: "system", label: "Match system theme", Icon: SunMoon },
  { mode: "dark", label: "Dark theme", Icon: Moon },
];

export function ThemeToggle() {
  // Server-rendered HTML has no idea what the user previously chose — that
  // information lives only in the browser's localStorage. So the very first
  // render (on the server, and on the client before hydration finishes) has
  // to assume "system", the same default the blocking script in
  // app/layout.tsx falls back to. We only look at localStorage inside
  // useEffect, i.e. after that first render is already committed — reading
  // it any earlier would make the client's first render disagree with the
  // server's, which React flags as a hydration mismatch. This is the same
  // shape as deferring an I/O read in Python to right after construction
  // instead of doing it in __init__: the object has to exist in a valid
  // default state before it can go find out the real answer.
  const [mode, setMode] = useState<ThemeMode>("system");

  useEffect(() => {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
      // This lint rule generally warns against effect -> setState because
      // that value could often be derived during render instead. It can't
      // be here: localStorage doesn't exist during server rendering, so
      // there is no "during render" moment where both environments could
      // compute the same answer. Reading it once, after mount, with an
      // empty dependency array, is precisely React's documented pattern
      // for synchronizing state from a browser-only external system.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode(stored);
    }
  }, []);

  function choose(next: ThemeMode) {
    setMode(next);
    if (next === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    }
    applyTheme(next);
  }

  return (
    <div
      role="group"
      aria-label="Theme"
      className="flex items-center gap-1 text-text-muted"
    >
      {OPTIONS.map(({ mode: optionMode, label, Icon }) => (
        <button
          key={optionMode}
          type="button"
          aria-label={label}
          aria-pressed={mode === optionMode}
          onClick={() => choose(optionMode)}
          className={`rounded p-1 transition-colors hover:text-text ${
            mode === optionMode ? "text-text" : ""
          }`}
        >
          <Icon size={14} strokeWidth={1.75} />
        </button>
      ))}
    </div>
  );
}

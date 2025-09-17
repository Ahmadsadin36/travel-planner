"use client";

import { useEffect, useState } from "react";

/**
 * Toggle between 'fantasy' (default) and 'dark' themes using daisyUI.
 * - Uses daisyUI's swap + rotate animation.
 * - Persists choice in localStorage.
 */
export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  // Initialize from localStorage (if present), else default to 'fantasy'
  useEffect(() => {
    const saved =
      typeof window !== "undefined" ? localStorage.getItem("theme") : null;
    const theme = saved === "dark" ? "dark" : "fantasy";
    document.documentElement.setAttribute("data-theme", theme);
    setIsDark(theme === "dark");
  }, []);

  const toggle = () => {
    const next = isDark ? "fantasy" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    setIsDark(!isDark);
  };

  return (
    <label className="swap swap-rotate" aria-label="Toggle dark mode">
      {/* Hidden checkbox drives the swap animation */}
      <input
        type="checkbox"
        onChange={toggle}
        checked={isDark}
        aria-label="theme toggle"
      />

      {/* sun icon (shown in dark mode to switch back) */}
      <svg
        className="swap-on h-5 w-5 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        // fill="currentColor"
      >
        <path d="M5.64 17.657a8 8 0 1 0 11.314-11.314 8 8 0 0 0-11.314 11.314ZM12 2.75a.75.75 0 0 1 .75.75v2a.75.75 0 0 1-1.5 0v-2A.75.75 0 0 1 12 2.75Zm0 15a.75.75 0 0 1 .75.75v2a.75.75 0 1 1-1.5 0v-2a.75.75 0 0 1 .75-.75Zm8.5-6.5a.75.75 0 0 1 .75.75h2a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1-.75-.75.75.75 0 0 1 .75-.75Zm-19 0a.75.75 0 0 1 .75.75.75.75 0 0 1-.75.75H.5a.75.75 0 0 1 0-1.5h1ZM18.364 5.636a.75.75 0 0 1 1.06 0l1.414 1.414a.75.75 0 1 1-1.06 1.06L18.364 6.697a.75.75 0 0 1 0-1.06Zm-14.142 14.142a.75.75 0 0 1 1.06 0l1.414 1.414a.75.75 0 1 1-1.06 1.06L4.222 20.84a.75.75 0 0 1 0-1.06ZM4.222 4.222a.75.75 0 0 1 1.06 0L6.697 5.64a.75.75 0 1 1-1.06 1.06L4.222 5.282a.75.75 0 0 1 0-1.06ZM18.364 18.364a.75.75 0 0 1 1.06 0l1.414 1.414a.75.75 0 1 1-1.06 1.06L18.364 19.424a.75.75 0 0 1 0-1.06Z" />
      </svg>

      {/* moon icon (shown in light/fantasy mode to switch to dark) */}
      <svg
        className="swap-off h-5 w-5 fill-current"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        // fill="currentColor"
      >
        <path d="M21.752 15.002a9 9 0 1 1-12.754-11.03.75.75 0 0 1 .997.96 7.5 7.5 0 0 0 9.073 9.074.75.75 0 0 1 .684.996Z" />
      </svg>
    </label>
  );
}

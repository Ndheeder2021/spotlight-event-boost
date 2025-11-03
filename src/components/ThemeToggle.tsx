import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import "./theme-toggle.css";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isLight = theme === "light";

  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={isLight}
        onChange={(e) => setTheme(e.target.checked ? "light" : "dark")}
        aria-label="Växla tema"
      />
      <span className="slider">
        <div className="star star_1"></div>
        <div className="star star_2"></div>
        <div className="star star_3"></div>
        <svg
          className="cloud"
          viewBox="0 0 64 64"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#fff"
            d="M55.3 29.9c-.2-5.1-4.5-9.2-9.7-9.2-1.4 0-2.7.3-3.9.8-1.6-3.9-5.5-6.6-10-6.6-5.5 0-10 4.1-10.7 9.4-3.8.6-6.7 3.9-6.7 7.9 0 4.4 3.6 8 8 8h30c4.4 0 8-3.6 8-8 0-4-3-7.3-6.9-7.9-.1-.1-.1-.3-.1-.4z"
          />
        </svg>
      </span>
    </label>
  );
}

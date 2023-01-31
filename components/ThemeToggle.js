import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import MoonIcon from '../public/img/icons/moon.svg';
import SunIcon from '../public/img/icons/sun.svg';
import clsx from "clsx";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleThemeClicked = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");

    let resizeTimer;
    document.body.classList.add("resize-animation-stopper");
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      document.body.classList.remove("resize-animation-stopper");
    }, 400);
  }

  if (!mounted) return <></>;

  return (
    <button
      onClick={toggleThemeClicked}>
        {resolvedTheme === "light"
            ? <SunIcon className="h-5 w-5 fill-grey-350" />
            : <MoonIcon className="h-5 w-5 fill-grey-750" />
        }
    </button>
  );
}

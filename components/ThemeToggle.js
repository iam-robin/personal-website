import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { RadioGroup } from "@headlessui/react";
import clsx from "clsx";
import MoonIcon from "../public/img/icons/moon.svg";
import SunIcon from "../public/img/icons/sun.svg";
import DropletIcon from "../public/img/icons/droplet.svg";

const themes = [
    {
        name: "blue",
        icon: DropletIcon,
    },
    {
        name: "light",
        icon: SunIcon,
    },
    {
        name: "dark",
        icon: MoonIcon,
    },
];

export default function ThemeToggle(props) {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        let resizeTimer;
        document.body.classList.add("resize-animation-stopper");
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove("resize-animation-stopper");
        }, 400);
    }, [resolvedTheme]);

    const handleThemeChange = (theme) => {
        if (props.isCollided) {
            const currentIndex = themes.findIndex((t) => t.name === theme.name);
            if (currentIndex === -1) return null;
            let nextIndex = currentIndex + 1;
            if (nextIndex === themes.length) {
                nextIndex = 0;
            }
            const newIndex = themes[nextIndex];
            setTheme(newIndex.name);
        }
    };

    if (!mounted) return <></>;

    return (
        <RadioGroup
            value={resolvedTheme}
            onChange={setTheme}
            className={clsx(
                "flex w-full bg-nav-bg-lvl-2 rounded-lg",
                props.isCollided ? "p-0" : "p-1"
            )}
        >
            <RadioGroup.Label className="sr-only">
                theme toggle
            </RadioGroup.Label>
            {themes.map((theme, i) => (
                <RadioGroup.Option
                    key={i}
                    value={theme.name}
                    onClick={() => handleThemeChange(theme)}
                    className={clsx(
                        "w-[30%] rounded-lg cursor-pointer text-nav-text-lvl-1 text-center flex gap-1 justify-center items-center",
                        "ui-checked:bg-nav-bg-lvl-1 ui-checked:w-[40%] ui-checked:items-center",
                        props.isCollided ?
                            "ui-not-checked:hidden ui-checked:w-full p-4" : "p-2"
                    )}
                >
                    <theme.icon
                        className={clsx(
                            "fill-nav-text-lvl-3 h-[14px] w-[14px] shrink-0",
                            "ui-checked:fill-nav-text-lvl-1 ui-checked:h-3 ui-checked:w-3"
                        )}
                    />
                    <span
                        className={clsx(
                            "ui-not-checked:hidden short-transition origin-bottom-left",
                            props.isCollided ? "text-[0] opacity-[0]" : "text-xs opacity-100"
                        )}
                    >
                        {theme.name.charAt(0).toUpperCase() +
                            theme.name.slice(1)}
                    </span>
                </RadioGroup.Option>
            ))}
        </RadioGroup>
    );
}

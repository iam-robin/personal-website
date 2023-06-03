import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Sidebar from "../Sidebar";
import clsx from "clsx";
import IconMenu from "../../public/img/icons/menu.svg";
import IconClose from "../../public/img/icons/close.svg";
import { subscribe } from "../../lib/events";

function useFirstRender() {
    const firstRender = useRef(true);

    useEffect(() => {
        firstRender.current = false;
    }, []);

    return firstRender.current;
}

const MainLayout = (props) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(true);
    const firstRender = useFirstRender();

    useEffect(() => {
        subscribe("navItemClicked", () => setIsMobileMenuOpen(false));

        const handleResize = () => {
            setIsDesktopMenuOpen(window.innerWidth >= 1264);
        };

        handleResize(); // Check initial viewport width

        if (typeof window !== "undefined") {
            window.addEventListener("resize", handleResize);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("resize", handleResize);
            }
        };
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.classList.add("mobile-menu-open");
        } else {
            document.body.classList.remove("mobile-menu-open");
        }
    }, [isMobileMenuOpen]);

    useEffect(() => {
        if (firstRender) return;

        const markers = document.querySelectorAll(".rough-annotation");
        markers.forEach((marker) => {
            marker.style.opacity = "0";
            marker.style.transition = "all 0.1s";
        });

        setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
        }, "700");

        setTimeout(() => {
            markers.forEach((marker) => {
                marker.style.opacity = "100";
            });
        }, "1200");
    }, [firstRender, isDesktopMenuOpen]);

    return (
        <div
            className={clsx(
                "flex flex-col",
                "sm:m-3",
                "md:flex-row",
                "transition-[margin] duration-[700ms] ease-in-out",
                isDesktopMenuOpen ? "md:m-12 md:ml-[0]" : "md:m-4 md:ml-[0]"
            )}
        >
            <div
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                    "h-screen w-screen fixed top-[0] left-[0] z-40 bg-black dark:bg-grey-900 opacity-50 dark:opacity-80",
                    isMobileMenuOpen ? "block md:hidden" : "hidden"
                )}
            ></div>
            <Link
                href="/"
                className={clsx(
                    "flex items-center gap-3 fixed top-4 left-4 z-50",
                    "md:hidden"
                )}
            >
                <div className="h-4 w-4 bg-blue rounded-full"></div>
                <div className={clsx("text-xs flex flex-col justify-center")}>
                    <h1 className="text-nav-text-lvl-1 font-bold">
                        Robin Spielmann
                    </h1>
                    <h2 className="text-nav-text-lvl-2">Design Engineer</h2>
                </div>
            </Link>
            <button
                className="self-end md:hidden fixed right-4 top-2 z-[100]"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
                {isMobileMenuOpen ? (
                    <IconClose className="fill-nav-text-lvl-1 sm:fill-white h-12 w-12 p-2" />
                ) : (
                    <IconMenu className="fill-nav-text-lvl-1 h-12 w-12 p-2" />
                )}
            </button>
            {/* start: workaround for scroll container border radius */}
            <div
                className={clsx(
                    "fixed left-[0] right-[0] top-[0] z-20 h-16",
                    "sm:left-3 sm:right-3",
                    "transition-[left,right,height] duration-[700ms] ease-in-out",
                    isDesktopMenuOpen
                        ? "md:left-[240px] md:right-12 md:h-12"
                        : "md:left-20 md:right-4 md:h-4"
                )}
            >
                <div
                    className={clsx(
                        "bg-bg-body mx-auto h-full relative",
                        "after:content-[''] after:absolute after:bg-bg-lvl-1 after:-bottom-6 after:h-6 after:w-6 after:left-[0] after:rounded-tl-[20px]",
                        "before:content-[''] before:absolute before:bg-bg-lvl-1 before:-bottom-6 before:h-6 before:w-6 before:right-[0] before:rounded-tr-[20px]"
                    )}
                >
                    <div className="absolute -bottom-6 h-6 w-6 left-[0] bg-bg-body -z-10"></div>
                    <div className="absolute -bottom-6 h-6 w-6 right-[0] bg-bg-body -z-10"></div>
                </div>
            </div>
            <div
                className={clsx(
                    "hidden fixed h-3 bottom-[0] z-20",
                    "sm:left-3 sm:right-3 sm:block",
                    "transition-[right,left,height] duration-[700ms] ease-in-out",
                    isDesktopMenuOpen
                        ? "md:right-12 md:left-[240px] md:h-12"
                        : "md:left-20 md:right-4 md:h-4"
                )}
            >
                <div
                    className={clsx(
                        "bg-bg-body mx-auto h-full relative",
                        "after:content-[''] after:absolute after:bg-bg-lvl-1 after:bottom-3 after:h-6 after:w-6 after:left-[0] after:rounded-bl-[20px]",
                        "before:content-[''] before:absolute before:bg-bg-lvl-1 before:bottom-3 before:h-6 before:w-6 before:right-[0] before:rounded-br-[20px]",
                        "after:transition-[bottom] after:duration-[700ms] after:ease-in-out before:transition-[bottom] before:duration-[700ms] before:ease-in-out",
                        isDesktopMenuOpen
                            ? "md:after:bottom-12 md:before:bottom-12"
                            : "md:after:bottom-4 md:before:bottom-4"
                    )}
                >
                    <div
                        className={clsx(
                            "absolute bottom-3 h-6 w-6 left-[0] bg-bg-body -z-10",
                            "transition-[bottom] duration-[700ms] ease-in-out",
                            isDesktopMenuOpen ? "md:bottom-12" : "md:bottom-4"
                        )}
                    ></div>
                    <div
                        className={clsx(
                            "absolute bottom-3 h-6 w-6 right-[0] bg-bg-body -z-10",
                            "transition-[bottom] duration-[700ms] ease-in-out",
                            isDesktopMenuOpen ? "md:bottom-12" : "md:bottom-4"
                        )}
                    ></div>
                </div>
            </div>
            {/* end: workaround for scroll container border radius */}
            <aside
                className={clsx(
                    "bg-bg-body fixed w-full h-screen overflow-auto overflow-x-hidden left-[0] top-[0] z-50 px-8 py-10",
                    isMobileMenuOpen ? "left-[0]" : "-left-[calc(100vw)]",
                    "sm:w-2/4",
                    "md:left-[0] md:top-auto md:bg-transparent md:py-4 md:pb-1",
                    "transition-[width,height,padding] duration-[700ms] ease-in-out",
                    isDesktopMenuOpen
                        ? "md:w-60 md:px-8 md:h-[calc(100vh-96px)]"
                        : "md:w-20 md:px-2 md:h-[calc(100vh-32px)]"
                )}
            >
                <Sidebar collided={!isDesktopMenuOpen} />
            </aside>
            <main className="w-full">
                <div
                    className={clsx(
                        "bg-bg-lvl-1 p-8 h-full mx-auto pt-28 min-h-screen relative",
                        "sm:p-16 sm:pt-24 sm:min-h-[calc(100vh-24px)]",
                        "md:p-30 md:pt-17",
                        "transition-[min-height, margin] duration-[700ms] ease-in-out",
                        isDesktopMenuOpen
                            ? "md:min-h-[calc(100vh-96px)] md:ml-60"
                            : "md:min-h-[calc(100vh-32px)] md:ml-20"
                    )}
                >
                    <section className="mx-auto max-w-[992px]">
                        {props.children}
                    </section>
                </div>
            </main>
        </div>
    );
};

export default MainLayout;

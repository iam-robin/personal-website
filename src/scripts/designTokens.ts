function initTokenLab() {
    const root = document.querySelector<HTMLElement>("[data-token-lab]");
    if (!root || root.dataset.initialized) return;
    root.dataset.initialized = "true";

    for (const control of root.querySelectorAll<HTMLElement>("[data-enhancement], [data-copy-value]")) {
        control.hidden = false;
    }

    const stage = root.querySelector<HTMLElement>("[data-type-stage]")!;
    const widthSelect = root.querySelector<HTMLSelectElement>("#type-width")!;
    const widthOutput = root.querySelector<HTMLOutputElement>("[data-type-width]")!;
    const samples = [...root.querySelectorAll<HTMLElement>("[data-type-sample]")];
    const sizes = [...root.querySelectorAll<HTMLOutputElement>("[data-type-value]")];
    const lengths = [...root.querySelectorAll<HTMLOutputElement>("[data-length-value]")];
    const number = (value: number) => String(Math.round(value * 100) / 100);

    // Resolves rem/calc lengths with the browser's own CSS engine. It has no
    // layout footprint and stays inside the specimen scope, where tokens that
    // Tailwind would otherwise prune are mirrored from the source files.
    const probe = document.createElement("span");
    probe.setAttribute("aria-hidden", "true");
    probe.style.cssText = "position:fixed;left:0;top:0;height:0;visibility:hidden;pointer-events:none;";
    root.append(probe);

    function measure() {
        const actual = stage.getBoundingClientRect().width;
        const requested = Number(widthSelect.value);
        widthOutput.textContent = `${number(actual)}px actual${actual < requested - 1 ? " · capped to available space" : ""}`;
        for (const sample of samples) {
            const output = sizes.find((item) => item.dataset.typeValue === sample.dataset.typeSample);
            const computed = getComputedStyle(sample);
            if (output) output.textContent = `${number(parseFloat(computed.fontSize))}px / ${number(parseFloat(computed.lineHeight))}px line`;
        }
        for (const output of lengths) {
            probe.style.width = `var(${output.dataset.lengthValue})`;
            output.textContent = `${number(parseFloat(getComputedStyle(probe).width))}px`;
        }
    }
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    widthSelect.addEventListener("change", () => {
        stage.style.maxWidth = `${widthSelect.value}px`;
        measure();
    });
    void document.fonts.ready.then(measure);
    measure();

    const status = root.querySelector<HTMLElement>("[data-copy-status]")!;
    let statusTimer: ReturnType<typeof setTimeout> | undefined;
    for (const button of root.querySelectorAll<HTMLButtonElement>("[data-copy-value]")) {
        button.addEventListener("click", async () => {
            clearTimeout(statusTimer);
            try {
                await navigator.clipboard.writeText(button.dataset.copyValue!);
                status.textContent = `Copied ${button.dataset.copyValue}.`;
            } catch {
                status.textContent = "Clipboard unavailable. Select and copy the token name instead.";
            }
            statusTimer = setTimeout(() => { status.textContent = ""; }, 6000);
        });
    }

    const replay = root.querySelector<HTMLButtonElement>("[data-replay]")!;
    const note = root.querySelector<HTMLElement>("[data-motion-note]")!;
    const dots = [...root.querySelectorAll<HTMLElement>("[data-easing]")];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    const animations = new Map<HTMLElement, Animation>();
    const supported = dots.every((dot) => CSS.supports("animation-timing-function", getComputedStyle(dot).getPropertyValue(dot.dataset.easing!)));

    function cancelMotion() {
        for (const animation of animations.values()) animation.cancel();
        animations.clear();
    }
    function motionPreference() {
        cancelMotion();
        replay.disabled = reduced.matches || !supported;
        note.textContent = reduced.matches
            ? "I’m keeping the previews still to respect your reduced-motion preference."
            : !supported
                ? "This browser can show the curves, but cannot animate these linear() easings."
                : "900ms preview for comparison. Duration is not a theme token.";
    }
    replay.addEventListener("click", () => {
        if (reduced.matches || !supported) return;
        cancelMotion();
        for (const dot of dots) {
            // Leave space past the resting point for the playful overshoot.
            const distance = (dot.parentElement!.clientWidth - dot.offsetWidth) * 0.75;
            const easing = getComputedStyle(dot).getPropertyValue(dot.dataset.easing!).trim();
            animations.set(dot, dot.animate([
                { transform: "translateX(0)" },
                { transform: `translateX(${distance}px)` },
            ], { duration: 900, easing, fill: "forwards" }));
        }
    });
    reduced.addEventListener("change", motionPreference);
    motionPreference();

    document.addEventListener("astro:before-swap", () => {
        observer.disconnect();
        probe.remove();
        cancelMotion();
        clearTimeout(statusTimer);
        reduced.removeEventListener("change", motionPreference);
    }, { once: true });
}

initTokenLab();
document.addEventListener("astro:page-load", initTokenLab);

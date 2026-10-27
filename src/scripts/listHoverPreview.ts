// Cursor-following preview for list rows (.list-item-image-hover-effect, with
// a .cover-image inside), dimming the other rows.
const coverDistance = 32;
const initialized = new WeakSet<Element>();

// Hover-capable pointer on a viewport wide enough for md:group-hover. On touch
// the dimming would latch. Checked per event so resizing takes effect.
const canPreview = () =>
    window.matchMedia("(hover: hover) and (min-width: 48rem)").matches;

function positionCover(event: MouseEvent, item: Element, cover: HTMLElement) {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    cover.style.left = `${x + coverDistance}px`;
    cover.style.top = `${y - cover.offsetHeight - coverDistance}px`;
}

function initHoverEffect() {
    const items = document.querySelectorAll(".list-item-image-hover-effect");

    items.forEach((item) => {
        if (initialized.has(item)) return;
        initialized.add(item);

        const cover = item.querySelector<HTMLElement>(".cover-image");
        // Broken covers don't count; covers still loading do (they load lazily).
        const isCoverValid = () =>
            !!cover &&
            cover.style.display !== "none" &&
            (!(cover instanceof HTMLImageElement) ||
                !(cover.complete && cover.naturalWidth === 0));

        // Position right away, but fade in only once every image has loaded, or the
        // first hover shows empty frames.
        if (cover) {
            const images =
                cover instanceof HTMLImageElement
                    ? [cover]
                    : [...cover.querySelectorAll("img")];
            const pending = images.filter(
                (img) => !(img.complete && img.naturalWidth > 0),
            );
            let remaining = pending.length;
            cover.dataset.previewReady = String(remaining === 0);

            // `error` settles too, or one broken image holds the preview at opacity 0.
            pending.forEach((img) => {
                let settled = false;
                const settle = () => {
                    if (settled) return;
                    settled = true;
                    if (--remaining <= 0) cover.dataset.previewReady = "true";
                };
                img.addEventListener("load", settle, { once: true });
                img.addEventListener("error", settle, { once: true });
            });
        }

        item.addEventListener("mouseover", (event) => {
            if (!canPreview()) return;
            if (isCoverValid()) positionCover(event as MouseEvent, item, cover!);
            items.forEach((other) => {
                if (other !== item) other.classList.add("opacity-20");
            });
        });

        item.addEventListener("mousemove", (event) => {
            if (!canPreview()) return;
            if (isCoverValid()) positionCover(event as MouseEvent, item, cover!);
        });

        item.addEventListener("mouseout", () => {
            if (cover) {
                cover.style.left = "auto";
                cover.style.top = "auto";
            }
            items.forEach((other) => other.classList.remove("opacity-20"));
        });
    });
}

initHoverEffect();
document.addEventListener("astro:page-load", initHoverEffect);

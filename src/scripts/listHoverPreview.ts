// Cursor-following preview (a bookmark cover image, a project fan, …)
// shown while hovering a list row, dimming the other rows. The row
// needs the .list-item-image-hover-effect class (plus group/relative);
// the floating element inside it the .cover-image class. Rows without
// a .cover-image still take part in the dimming. Ported from v3.
const coverDistance = 32;
const initialized = new WeakSet<Element>();

// The whole effect — floating cover *and* the dimming that frames it — only
// exists where the cover does: a pointer that can hover, on a viewport wide
// enough for `md:group-hover:block` to fire. Without both, dimming nine rows
// buys nothing and, on touch, latches (tap fires mouseover, never mouseout).
// Checked per event rather than once at init so resizing a window across the
// breakpoint takes effect immediately.
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
        // A cover counts unless it's a broken one: display:none from its own
        // onerror handler, or finished loading with nothing in it. An image
        // still in flight is fine to place — /series loads its posters lazily,
        // so the first hover is always the one that fetches, and skipping it
        // would leave that poster sitting at its static position.
        const isCoverValid = () =>
            !!cover &&
            cover.style.display !== "none" &&
            (!(cover instanceof HTMLImageElement) ||
                !(cover.complete && cover.naturalWidth === 0));

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

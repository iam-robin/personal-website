// Cursor-following preview (a bookmark cover image, a project fan, …)
// shown while hovering a list row, dimming the other rows. The row
// needs the .list-item-image-hover-effect class (plus group/relative);
// the floating element inside it the .cover-image class. Rows without
// a .cover-image still take part in the dimming. Ported from v3.
const coverDistance = 32;
const initialized = new WeakSet<Element>();

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
        // Images only count once they actually loaded (a broken cover
        // sets display:none via its onerror handler); other elements
        // just need to exist.
        const isCoverValid = () =>
            !!cover &&
            cover.style.display !== "none" &&
            (!(cover instanceof HTMLImageElement) || cover.naturalWidth > 0);

        item.addEventListener("mouseover", (event) => {
            if (isCoverValid()) positionCover(event as MouseEvent, item, cover!);
            items.forEach((other) => {
                if (other !== item) other.classList.add("opacity-20");
            });
        });

        item.addEventListener("mousemove", (event) => {
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

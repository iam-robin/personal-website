const coverDistance = 32;

// Track initialized elements to prevent duplicate event listeners
const initializedItems = new WeakSet<Element>();

function initHoverEffect() {
    const listItems = document.querySelectorAll(
        ".list-item-image-hover-effect"
    );

    listItems.forEach((item: Element) => {
        // Skip if already initialized
        if (initializedItems.has(item)) return;
        initializedItems.add(item);

        const cover = item.querySelector(
            ".cover-image"
        ) as HTMLImageElement | null;

        // Check if image is valid (not broken)
        const isImageValid = () => {
            return (
                cover &&
                cover.style.display !== "none" &&
                cover.naturalWidth > 0
            );
        };

        item.addEventListener("mouseover", (event: any) => {
            if (isImageValid()) {
                positionCover(event, item, cover!);
            }
            listItems.forEach((otherItem) => {
                if (otherItem !== item) {
                    otherItem.classList.add("opacity-20");
                }
            });
        });

        item.addEventListener("mousemove", (event: any) => {
            if (isImageValid()) {
                positionCover(event, item, cover!);
            }
        });

        item.addEventListener("mouseout", () => {
            if (cover) {
                cover.style.left = "auto";
                cover.style.top = "auto";
            }
            listItems.forEach((otherItem) => {
                otherItem.classList.remove("opacity-20");
            });
        });
    });
}

// For view transitions (navigation between pages)
document.addEventListener("astro:page-load", initHoverEffect);

// For direct page loads - run immediately if DOM is ready
if (document.readyState !== "loading") {
    initHoverEffect();
}

const positionCover = (event: any, item: Element, cover: HTMLImageElement) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    cover.style.left = `${x + coverDistance}px`;
    cover.style.top = `${y - cover.offsetHeight - coverDistance}px`;
};

const coverDistance = 32;
document.addEventListener('DOMContentLoaded', () => {
    const listItem = document.querySelectorAll('.list-item-image-hover-effect');
    console.log('listItem', listItem);

    listItem.forEach((item: Element) => {
        const cover = item.querySelectorAll('.cover-image')[0] as HTMLImageElement;
        item.addEventListener('mouseover', (event: any) => {
            positionCover(event, item, cover);
            listItem.forEach((otherItem) => {
                if (otherItem !== item) {
                    otherItem.classList.add('opacity-20');
                }
            });
        });

        item.addEventListener('mousemove', (event: any) => {
            positionCover(event, item, cover);
        });

        item.addEventListener('mouseout', () => {
            cover.style.left = 'auto';
            cover.style.top = 'auto';
            listItem.forEach((otherItem) => {
                otherItem.classList.remove('opacity-20');
            });
        });
    });
});

const positionCover = (event: any, item: Element, cover: HTMLImageElement) => {
    const rect = item.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    cover.style.left = `${x + coverDistance}px`;
    cover.style.top = `${y - cover.offsetHeight - coverDistance}px`;
};

document.addEventListener('DOMContentLoaded', () => {
    // Convert markdown footnotes to sidenotes
    convertFootnotesToSidenotes();
});

// Function to convert standard markdown footnotes to sidenotes
function convertFootnotesToSidenotes() {
    // Find all footnote references - support both remark-footnotes and remark-gfm formats
    const footnoteRefs = document.querySelectorAll(
        'a[data-footnote-ref], a.data-footnote-ref, sup a[href^="#fn"]'
    );

    // Find all footnotes
    const footnotes = document.querySelectorAll(
        '.footnotes li, section.footnotes li, div.footnotes li'
    );

    if (footnoteRefs.length === 0 || footnotes.length === 0) {
        console.log('No footnotes found on this page');
        return;
    }

    // Add desktop-only class to the footnotes section instead of hiding it completely
    const footnotesSection = document.querySelector('.footnotes, section.footnotes, div.footnotes');
    if (footnotesSection) {
        footnotesSection.classList.add('desktop-hidden');
    }

    // Process each footnote reference
    footnoteRefs.forEach((ref, index) => {
        const href = ref.getAttribute('href');
        if (!href) return;

        const id = href.substring(1);
        const footnote = document.getElementById(id);

        if (footnote) {
            const footnoteContent = footnote.querySelector('p')?.innerHTML || footnote.innerHTML;

            // Create sidenote elements
            const checkboxId = `sn-${index}`;

            // Replace the footnote reference with sidenote structure
            const sidenoteNumber = document.createElement('label');
            sidenoteNumber.className = 'margin-toggle sidenote-number';
            sidenoteNumber.setAttribute('for', checkboxId);

            const toggleCheckbox = document.createElement('input');
            toggleCheckbox.type = 'checkbox';
            toggleCheckbox.id = checkboxId;
            toggleCheckbox.className = 'margin-toggle';

            const sidenote = document.createElement('span');
            sidenote.className = 'sidenote desktop-only';
            sidenote.innerHTML = footnoteContent;

            // Handle different DOM structures (sup > a or just a)
            const parent = ref.parentNode.tagName === 'SUP' ? ref.parentNode : ref;
            const container = parent.parentNode;

            container.insertBefore(sidenoteNumber, parent);
            container.insertBefore(toggleCheckbox, parent);
            container.insertBefore(sidenote, parent);

            // On mobile, keep original reference link to navigate to footnotes
            if (parent.tagName === 'SUP') {
                parent.classList.add('mobile-only');
            } else {
                // Create a mobile-only sup with the original reference
                const mobileRef = ref.cloneNode(true);
                const mobileSup = document.createElement('sup');
                mobileSup.appendChild(mobileRef);
                mobileSup.classList.add('mobile-only');
                container.insertBefore(mobileSup, parent);
                container.removeChild(parent);
            }
        }
    });

    // Add CSS to control visibility based on screen size
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        @media (min-width: 1025px) {
            .desktop-hidden { display: none; }
            .mobile-only { display: none; }
        }
        @media (max-width: 1024px) {
            .desktop-only { display: none; }
            .desktop-hidden { display: block; }
            .margin-toggle:not(:checked) + .sidenote { display: none; }
            .margin-toggle { display: none; }
        }
    `;
    document.head.appendChild(styleElement);
}

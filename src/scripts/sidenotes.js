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

    // Hide the footnotes section
    const footnotesSection = document.querySelector('.footnotes, section.footnotes, div.footnotes');
    if (footnotesSection) {
        footnotesSection.style.display = 'none';
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
            sidenote.className = 'sidenote';
            sidenote.innerHTML = footnoteContent;

            // Handle different DOM structures (sup > a or just a)
            const parent = ref.parentNode.tagName === 'SUP' ? ref.parentNode : ref;
            const container = parent.parentNode;

            container.insertBefore(sidenoteNumber, parent);
            container.insertBefore(toggleCheckbox, parent);
            container.insertBefore(sidenote, parent);
            container.removeChild(parent);
        }
    });

    // Add click handler for mobile sidenotes
    document.querySelectorAll('.sidenote-number').forEach((sidenote) => {
        sidenote.addEventListener('click', function (e) {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                const checkboxId = this.getAttribute('for');
                const checkbox = document.getElementById(checkboxId);
                if (checkbox) {
                    checkbox.checked = !checkbox.checked;
                }
            }
        });
    });
}

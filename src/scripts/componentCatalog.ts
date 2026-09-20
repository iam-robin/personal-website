export function initComponentCatalog() {
    const root = document.querySelector<HTMLElement>("[data-component-catalog]");
    if (!root || root.dataset.initialized) return;
    root.dataset.initialized = "true";
    const form = root.querySelector<HTMLFormElement>("[data-catalog-controls]")!;
    const search = root.querySelector<HTMLInputElement>("#component-search")!;
    const area = root.querySelector<HTMLSelectElement>("#component-group")!;
    const status = root.querySelector<HTMLElement>("[data-catalog-status]")!;
    const empty = root.querySelector<HTMLElement>("[data-catalog-empty]")!;
    const groups = [...root.querySelectorAll<HTMLElement>("[data-catalog-group]")];
    const entries = [...root.querySelectorAll<HTMLDetailsElement>("[data-component]")];
    form.hidden = false;

    function filter(writeUrl = true) {
        const words = search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
        let count = 0;
        for (const group of groups) {
            let visible = 0;
            for (const entry of group.querySelectorAll<HTMLDetailsElement>("[data-component]")) {
                const matches = (area.value === "all" || area.value === group.dataset.catalogGroup)
                    && words.every((word) => entry.dataset.search!.includes(word));
                entry.hidden = !matches;
                if (matches) visible++;
            }
            group.hidden = visible === 0;
            count += visible;
        }
        status.textContent = `${count} of ${entries.length} components`;
        empty.hidden = count !== 0;
        if (writeUrl) {
            const url = new URL(location.href);
            search.value.trim() ? url.searchParams.set("q", search.value.trim()) : url.searchParams.delete("q");
            area.value === "all" ? url.searchParams.delete("area") : url.searchParams.set("area", area.value);
            history.replaceState(null, "", url);
        }
    }

    function revealHash() {
        let id: string;
        try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
        const target = document.getElementById(id);
        if (!target || !root!.contains(target)) return;
        if (target.hidden || target.closest("[hidden]")) {
            search.value = "";
            area.value = "all";
            filter();
        }
        if (target instanceof HTMLDetailsElement) target.open = true;
        requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
    }

    function restore() {
        const params = new URLSearchParams(location.search);
        search.value = params.get("q") ?? "";
        const requestedArea = params.get("area") ?? "all";
        area.value = [...area.options].some((option) => option.value === requestedArea) ? requestedArea : "all";
        filter(false);
        revealHash();
    }
    search.addEventListener("input", () => filter());
    area.addEventListener("change", () => filter());
    form.addEventListener("submit", (event) => event.preventDefault());
    form.addEventListener("reset", (event) => {
        event.preventDefault();
        search.value = "";
        area.value = "all";
        filter();
        search.focus();
    });
    document.querySelectorAll<HTMLAnchorElement>('[data-lab-page-nav] a[href^="#"], [data-component-catalog] a[href^="#"]').forEach((link) => {
        link.addEventListener("click", () => {
            // A category jump is also an exit from a narrowed search.
            if (link.hash.startsWith("#area-")) {
                search.value = "";
                area.value = "all";
                filter();
            }
            if (link.hash === location.hash) revealHash();
        });
    });
    window.addEventListener("hashchange", revealHash);
    window.addEventListener("popstate", restore);
    restore();
}

/**
 * Remembers, per history entry, whether the close button may step back.
 * Lives in history.state, so it survives reloads and back/forward, and a
 * fresh entry never inherits a stale answer.
 */

const CARRY_KEY = "close-return-carry";

export function initCloseReturn() {
    if (typeof history.state?.closeReturn === "boolean") return;

    let closeReturn = false;
    const carried = sessionStorage.getItem(CARRY_KEY);
    sessionStorage.removeItem(CARRY_KEY);

    if (carried) {
        // Arrived by prev/next: the entry was replaced, the origin is still
        // one step back if it was before.
        const { url, value } = JSON.parse(carried);
        if (url === location.pathname) closeReturn = value === true;
    } else if (document.referrer && history.length > 1) {
        try {
            const from = new URL(document.referrer);
            closeReturn =
                from.origin === location.origin &&
                from.pathname !== location.pathname;
        } catch {
            closeReturn = false;
        }
    }

    history.replaceState({ ...history.state, closeReturn }, "");
}

/** Prev/next: swap this entry for the sibling instead of stacking one. */
export function replaceSibling(href: string) {
    const url = new URL(href, location.href);
    sessionStorage.setItem(
        CARRY_KEY,
        JSON.stringify({
            url: url.pathname,
            value: history.state?.closeReturn === true,
        }),
    );
    location.replace(url.href);
}

/**
 * A human "x time ago" string for a past date. Computed at build time, so it
 * reflects the moment the site was last built (fine for a changelog).
 * Ported from v3.
 */
export function timeSince(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;

    if (interval >= 1) {
        const years = Math.floor(interval);
        const totalMonths = Math.round((interval - years) * 12);
        const adjustedMonths =
            totalMonths <= 12 ? totalMonths : totalMonths - 12;
        if (adjustedMonths === 0 || (adjustedMonths === 1 && years === 1)) {
            return `${years} year${years > 1 ? "s" : ""} ago`;
        } else {
            return `${years} year${years > 1 ? "s" : ""} and ${
                adjustedMonths === 12 ? 11 : adjustedMonths
            } month${adjustedMonths > 1 ? "s" : ""} ago`;
        }
    }

    interval = seconds / 2592000;
    if (interval > 1) {
        return ago(interval, "month");
    }

    interval = seconds / 86400;
    if (interval > 1) {
        return ago(interval, "day");
    }

    interval = seconds / 3600;
    if (interval > 1) {
        return ago(interval, "hour");
    }

    interval = seconds / 60;
    if (interval > 1) {
        return ago(interval, "minute");
    }

    return ago(seconds, "second");
}

/** "3 days ago" / "1 day ago" — pluralise the unit for a whole count. */
function ago(count: number, unit: string): string {
    const n = Math.floor(count);
    return `${n} ${unit}${n === 1 ? "" : "s"} ago`;
}

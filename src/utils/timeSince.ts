export function timeSince(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;

    if (interval >= 1) {
        const years = Math.floor(interval);
        const totalMonths = Math.round((interval - years) * 12);
        const adjustedMonths = totalMonths <= 12 ? totalMonths : totalMonths - 12;
        if (adjustedMonths === 0 || (adjustedMonths === 1 && years === 1)) {
            return `${years} year${years > 1 ? 's' : ''} ago`;
        } else {
            return `${years} year${years > 1 ? 's' : ''} and ${
                adjustedMonths === 12 ? 11 : adjustedMonths
            } month${adjustedMonths > 1 ? 's' : ''} ago`;
        }
    }

    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + ' months ago';
    }

    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + ' days ago';
    }

    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + ' hours ago';
    }

    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + ' minutes ago';
    }

    return Math.floor(seconds) + ' seconds ago';
}

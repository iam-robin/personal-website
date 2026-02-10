interface SpineColors {
    background: string;
    text: string;
}

const defaultColors: SpineColors = {
    background: "#666666",
    text: "#FFFFFF",
};

export function getSpineColors(_title: string): SpineColors {
    return defaultColors;
}

const DEFAULT_PAGE_COUNT = 250;

export function getSpineHeight(pages: number): number {
    const pageCount = Number(pages) || DEFAULT_PAGE_COUNT;
    return Math.max(12, pageCount * 0.11);
}

export function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

import { getColorFromURL } from 'color-thief-node';

// Interface for spine color configuration
export interface SpineColors {
    background: string;
    text: string;
}

// Mapping of book titles to their spine colors
const spineColorMap: Record<string, SpineColors> = {
    // Add specific books with custom spine colors
    'Hello World': {
        background: '#00AEAD',
        text: '#FFFFFF'
    },
    'The Glass Castle': {
        background: '#021C37',
        text: '#fff'
    },
    'Project Hail Mary': {
        background: '#2E6CB6',
        text: '#000000'
    }
};

/**
 * Gets spine colors for a book, either from predefined values or by analyzing the cover
 * @param title Book title
 * @param coverUrl URL of the book cover
 * @returns Promise resolving to SpineColors object
 */
export async function getSpineColors(title: string, coverUrl: string): Promise<SpineColors> {
    // First try to find an exact match (case insensitive)
    const normalizedTitle = title.toLowerCase().trim();

    for (const [bookTitle, colors] of Object.entries(spineColorMap)) {
        if (bookTitle.toLowerCase().trim() === normalizedTitle) {
            return colors;
        }
    }

    // If no match, fall back to analyzing the cover
    return getSpineColorsFromCover(coverUrl);
}

/**
 * Extracts spine colors from book cover image
 * @param coverUrl URL of the book cover
 * @returns Promise resolving to SpineColors object
 */
async function getSpineColorsFromCover(coverUrl: string): Promise<SpineColors> {
    try {
        const dominantColor = await getColorFromURL(coverUrl);

        // Convert RGB array to hex string
        const rgbToHex = (rgb: number[]) =>
            '#' +
            rgb
                .map((x) => {
                    const hex = x.toString(16);
                    return hex.length === 1 ? '0' + hex : hex;
                })
                .join('');

        const spineBackground = rgbToHex(dominantColor);

        // Determine text color based on background brightness
        // Use light text on dark backgrounds and dark text on light backgrounds
        const brightness =
            (dominantColor[0] * 299 + dominantColor[1] * 587 + dominantColor[2] * 114) / 1000;
        const textColor = brightness < 128 ? '#FFFFFF' : '#000000';

        return {
            background: spineBackground,
            text: textColor
        };
    } catch (error) {
        console.warn(`Could not extract color from cover: ${error.message}`);

        // Default fallback colors
        return {
            background: '#666666',
            text: '#FFFFFF'
        };
    }
}

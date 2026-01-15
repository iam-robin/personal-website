import { getColorFromURL } from "color-thief-node";

interface SpineColors {
    background: string;
    text: string;
}

// Manual overrides for specific books
const spineColorMap: Record<string, SpineColors> = {
    "hello world: being human in the age of algorithms": {
        background: "#00AEAD",
        text: "#FFFFFF",
    },
    "The Glass Castle: A Memoir": {
        background: "#021C37",
        text: "#fff",
    },
    "Project Hail Mary": {
        background: "#2E6CB6",
        text: "#000000",
    },
};

export async function getSpineColors(
    title: string,
    coverUrl: string
): Promise<SpineColors> {
    const lowerTitle = title.toLowerCase();
    for (const [key, value] of Object.entries(spineColorMap)) {
        console.log(
            "key.toLowerCase()",
            key.toLowerCase(),
            "lowerTitle",
            lowerTitle
        );

        if (key.toLowerCase() === lowerTitle) {
            return value;
        }
    }
    return getSpineColorsFromCover(coverUrl);
}

async function getSpineColorsFromCover(coverUrl: string): Promise<SpineColors> {
    try {
        const dominantColor = await getColorFromURL(coverUrl);
        const [r, g, b] = dominantColor;

        // Convert RGB to hex
        const toHex = (n: number) => n.toString(16).padStart(2, "0");
        const background = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

        // Calculate brightness for text color
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        const text = brightness < 128 ? "#FFFFFF" : "#000000";

        return { background, text };
    } catch (e) {
        console.warn(`Could not extract color from ${coverUrl}`);
        return { background: "#666666", text: "#FFFFFF" };
    }
}

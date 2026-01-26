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

const defaultColors: SpineColors = {
    background: "#666666",
    text: "#FFFFFF",
};

export function getSpineColors(title: string): SpineColors {
    const lowerTitle = title.toLowerCase();
    for (const [key, value] of Object.entries(spineColorMap)) {
        if (key.toLowerCase() === lowerTitle) {
            return value;
        }
    }
    return defaultColors;
}

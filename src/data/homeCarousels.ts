import type { ImageMetadata } from "astro";

// Imported one by one: an eager glob over the photo folder would emit every
// original into the build.
import photo01 from "../assets/photos/01.jpg";
import photo02 from "../assets/photos/02.jpg";
import photo03 from "../assets/photos/03.jpg";
import photo04 from "../assets/photos/04.jpg";
import photo05 from "../assets/photos/05.jpg";
import photo07 from "../assets/photos/07.jpg";
import photo08 from "../assets/photos/08.jpg";
import photo09 from "../assets/photos/09.jpg";
import photo10 from "../assets/photos/10.jpg";
import photo11 from "../assets/photos/11.jpg";
import photo12 from "../assets/photos/12.jpg";
import flowGarden from "../assets/projects/handcoded/00-flow-garden.webp";
import art01 from "../assets/projects/handcoded/01.webp";
import art02 from "../assets/projects/handcoded/02.webp";
import art03 from "../assets/projects/handcoded/03.webp";
import art04 from "../assets/projects/handcoded/04.webp";
import art05 from "../assets/projects/handcoded/05.webp";
import art06 from "../assets/projects/handcoded/06.webp";
import art07 from "../assets/projects/handcoded/07.webp";

export type Slide = { src: ImageMetadata; alt: string };

/** A selection, ordered so neighbours contrast: city, nature, colour, dark. */
export const photos: Slide[] = [
    { src: photo01, alt: "A tram in front of a columned building in winter, a woman with a cargo bike beside it." },
    { src: photo02, alt: "Green leaves against a black background." },
    { src: photo04, alt: "A man in a dark coat walking past an exhibition poster." },
    { src: photo10, alt: "Painted lines on a red running track." },
    { src: photo05, alt: "A narrow alley between old houses, a church spire at the end." },
    { src: photo11, alt: "Jellyfish glowing in blue water." },
    { src: photo08, alt: "The Louvre pyramid, framed by a dark archway." },
    { src: photo09, alt: "An orange tree behind a white wall." },
    { src: photo03, alt: "Railway tracks seen through a wire fence." },
    { src: photo12, alt: "The rear light of an old green car." },
    { src: photo07, alt: "Small white flowers in the dark." },
];

export const art: Slide[] = [
    { src: flowGarden, alt: "Blue flowers with yellow centres on tall green stems." },
    { src: art01, alt: "Geometric shapes in blue, pink, red and yellow on a grid." },
    { src: art02, alt: "A wireframe mountain in front of an orange sun." },
    { src: art05, alt: "A red sun over wavy black lines." },
    { src: art06, alt: "Blobs of blue, red, yellow and pink fitted together." },
    { src: art03, alt: "Overlapping mountain shapes drawn in thin vertical lines." },
    { src: art04, alt: "Orange arches drawn in parallel lines." },
    { src: art07, alt: "Nine wireframe rings, each tilted a little differently." },
];

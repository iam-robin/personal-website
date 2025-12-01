<script>
import Carousel from "../carousel/Carousel.svelte";
import CarouselItem from "../carousel/CarouselItem.svelte";

import Photo01 from "@assets/landingpage-photos/01.jpg";
import Photo02 from "@assets/landingpage-photos/02.jpg";
import Photo03 from "@assets/landingpage-photos/03.jpg";
import Photo04 from "@assets/landingpage-photos/04.jpg";
import Photo05 from "@assets/landingpage-photos/05.jpg";
import Photo06 from "@assets/landingpage-photos/06.jpg";
import Photo07 from "@assets/landingpage-photos/07.jpg";
import Photo08 from "@assets/landingpage-photos/08.jpg";
import Photo09 from "@assets/landingpage-photos/09.jpg";
import Photo10 from "@assets/landingpage-photos/10.jpg";
import Photo11 from "@assets/landingpage-photos/11.jpg";
import Photo12 from "@assets/landingpage-photos/12.jpg";
import Photo13 from "@assets/landingpage-photos/13.jpg";
import Photo14 from "@assets/landingpage-photos/14.jpg";
import Photo15 from "@assets/landingpage-photos/15.jpg";
import Photo16 from "@assets/landingpage-photos/16.jpg";
import Photo17 from "@assets/landingpage-photos/17.png";

const photos = [
    Photo01,
    Photo02,
    Photo17,
    Photo15,
    Photo03,
    Photo04,
    Photo05,
    Photo06,
    Photo07,
    Photo08,
    Photo09,
    Photo10,
    Photo11,
    Photo12,
    Photo13,
    Photo14,
    Photo16,
];

    const headline = "headline";

    const link = {
    href: "#",
    text: 'More Photos',
    }

    const description = "Ipsum deserunt sunt eu. Tempor id commodo ex dolore labore. Anim cupidatat veniam commodo reprehenderit minim commodo nostrud anim cupidatat. Magna cupidatat sit quis mollit aute esse et veniam cillum do incididunt."
</script>

<Carousel {headline} {description} {link}>
    {#each photos as photo}
        <CarouselItem largeSpan={4} paddingBottom={24} paddingTop={24}>
            <img
                src={photo.src}
                alt="Photography"
                width={photo.width}
                height={photo.height}
                class="bg-neutral-100"
                loading="lazy"
            />
        </CarouselItem>
    {/each}
</Carousel>

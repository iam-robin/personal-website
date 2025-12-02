<script>
import Carousel from "../carousel/Carousel.svelte";
import CarouselItem from "../carousel/CarouselItem.svelte";
import PostcardItem from "./PostcardItem.svelte";

let { postcards } = $props();

    const headline = "Postcards";

    const link = {
    href: "/postcards",
    text: 'All Postcards',
    }

    const description = "This website is mostly me talking. This postcard gives you a chance to talk back — even just a line. Drop me a postcard. Tell me what you’re thinking, where you’re visiting from, or simply that you stopped by. I’d love to hear from you."
</script>

<Carousel {headline} {description} {link}>

    {#each postcards as postcard}
        <CarouselItem largeSpan={6} paddingBottom={64} paddingTop={24}>
            <PostcardItem
                author={postcard.author}
                body={postcard.body}
                date={postcard.date}
                websiteUrl={postcard.websiteUrl ?? undefined}
                marginBottom={postcard.marginBottom ?? undefined}
                marginRight={postcard.marginRight ?? undefined}
                rotation={postcard.rotation ?? undefined}
                penColor={postcard.penColor ?? undefined}
                paperColor={postcard.paperColor ?? undefined}
                fontSizeFactor={postcard.fontSizeFactor ?? undefined}
                lineHeight={postcard.lineHeight ?? undefined}
                authorLeftOffset={postcard.authorLeftOffset ?? undefined}
                authorTopOffset={postcard.authorTopOffset ?? undefined}
                authorRotation={postcard.authorRotation ?? undefined}
                dateLeftOffset={postcard.dateLeftOffset ?? undefined}
                dateTopOffset={postcard.dateTopOffset ?? undefined}
                dateRotation={postcard.dateRotation ?? undefined}
                bodyLeftOffset={postcard.bodyLeftOffset ?? undefined}
                bodyTopOffset={postcard.bodyTopOffset ?? undefined}
                bodyRotation={postcard.bodyRotation ?? undefined}
                stampSvg={postcard.stampSvg ?? undefined}
                country={postcard.country ?? undefined}
                postOfficeStampTop={postcard.postOfficeStampTop ?? undefined}
                postOfficeStampRight={postcard.postOfficeStampRight ?? undefined}
                postOfficeStampRotation={postcard.postOfficeStampRotation ?? undefined}
                wavyStampTop={postcard.wavyStampTop ?? undefined}
                wavyStampRight={postcard.wavyStampRight ?? undefined}
                wavyStampRotation={postcard.wavyStampRotation ?? undefined}
            />
        </CarouselItem>
    {/each}
</Carousel>

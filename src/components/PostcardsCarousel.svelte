<script>
import Carousel from "./Carousel.svelte";
import CarouselItem from "./CarouselItem.svelte";
import PostcardItem from "./PostcardItem.svelte";

let { postcards } = $props();
</script>

<Carousel>
    {#each postcards as postcard}
        <CarouselItem largeSpan={6} paddingBottom={24} paddingTop={24}>
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

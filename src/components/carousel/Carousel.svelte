<script>
  import { BlossomCarousel } from '@blossom-carousel/svelte';
  import '@blossom-carousel/core/style.css';

  let {
    columns,
    gap,
    headline,
    description,
    link,
    children
  } = $props();
</script>

<section
  class="flex flex-col"
  style:--columns={columns}
  style:--gap={gap}
  style:gap="var(--gap)"
>
  {#if headline || description}
    <hgroup class="max-w-(--max-width) mx-auto w-full grid grid-cols-12 gap-4 pb-6">
      {#if headline}
        <h2 class="text-xl font-bold col-start-1 col-end-4">{headline}</h2>
      {/if}
      {#if description}
        <p class="text-base font-mono col-start-5 col-end-12">{description}</p>
      {/if}
    </hgroup>
  {/if}

  <div class="carousel-wrapper">
    <BlossomCarousel as="ul" class="carousel">
      {@render children?.()}
    </BlossomCarousel>
  </div>

  {#if link}
    <div class="max-w-(--max-width) mx-auto w-full flex justify-end">
      <a href={link.href} class="text-inherit">{link.text}</a>
    </div>
  {/if}
</section>

<style>
    .carousel-wrapper :global(.carousel) {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: calc((var(--max-width) - (var(--columns) - 1) * var(--gap)) / var(--columns));
        gap: var(--gap);
        padding-inline: max(0px, calc((100vw - var(--max-width)) / 2));
        scroll-padding-inline-start: max(0px, calc((100vw - var(--max-width)) / 2));
    }

    @media (max-width: 800px) {
        .carousel-wrapper :global(.carousel) {
            grid-auto-columns: calc((100vw - (var(--columns) - 1) * var(--gap) - 2 * var(--gap)) / var(--columns));
            padding-inline: unset;
            scroll-padding-inline-start: unset;
        }
    }
</style>

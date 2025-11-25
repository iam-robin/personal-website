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
  class="carousel-section"
  style:--columns={columns}
  style:--gap={gap}
>
  {#if headline || description}
    <hgroup class="carousel-header">
      {#if headline}
        <h2 class="carousel-headline">{headline}</h2>
      {/if}
      {#if description}
        <p class="carousel-description">{description}</p>
      {/if}
    </hgroup>
  {/if}

  <div class="carousel-wrapper">
    <BlossomCarousel as="ul" class="carousel">
      {@render children?.()}
    </BlossomCarousel>
  </div>

  {#if link}
    <div class="carousel-link-container">
      <a href={link.href} class="carousel-link">{link.text}</a>
    </div>
  {/if}
</section>

<style>
    .carousel-section {
        display: flex;
        flex-direction: column;
        gap: var(--gap);
    }

    .carousel-header {
        max-width: var(--max-width);
        margin: 0 auto;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(12, 1fr);
        gap: 16px;
        padding-bottom: 24px;

        h2 {
            grid-column-start: 1;
            grid-column-end: 5;
        }

        p {
            grid-column-start: 6;
            grid-column-end: 13;
        }
    }

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

    .carousel-link-container {
        max-width: var(--max-width);
        margin: 0 auto;
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }

    .carousel-link {
        color: inherit;
    }
</style>

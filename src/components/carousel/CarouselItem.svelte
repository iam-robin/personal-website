<script>
  let { smallSpan = 10, mediumSpan = 5, largeSpan = 4, paddingTop = 0, paddingBottom = 0, children } = $props();
</script>

<li
  class="carousel-item"
  style:--small-span={smallSpan}
  style:--medium-span={mediumSpan}
  style:--large-span={largeSpan}
  style:--padding-top={`${paddingTop}px`}
  style:--padding-bottom={`${paddingBottom}px`}
>
  {@render children?.()}
</li>

<style>
  .carousel-item {
    /* aspect-ratio: 3/4; */
    grid-column: span var(--large-span);
    padding-top: var(--padding-top);
    padding-bottom: var(--padding-bottom);
  }

  @media (max-width: 800px) {
    .carousel-item {
      grid-column: span var(--medium-span);
    }
  }

  @media (max-width: 480px) {
    .carousel-item {
      grid-column: span var(--small-span);
    }
  }
</style>

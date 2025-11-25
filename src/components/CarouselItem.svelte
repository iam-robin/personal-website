<script>
  let { smallSpan = 4, mediumSpan = 4, largeSpan = 4, children } = $props();
</script>

<li
  class="carousel-item"
  style:--small-span={smallSpan}
  style:--medium-span={mediumSpan}
  style:--large-span={largeSpan}
>
  {@render children?.()}
</li>

<style>
  .carousel-item {
    aspect-ratio: 3/4;
    grid-column: span var(--large-span);
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

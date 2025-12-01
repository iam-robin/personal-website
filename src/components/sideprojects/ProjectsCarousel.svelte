<script>
  import Carousel from '../carousel/Carousel.svelte';
  import CarouselItem from '../carousel/CarouselItem.svelte';
  import ProjectCard from './ProjectCard.svelte';

  let { projects = [] } = $props();

  const smallSpan = 10;
  const mediumSpan = 5;
  const largeSpan = 4;

  const headline = "Projects";

  const description = "A selection of side projects and experiments I've been working on."
</script>

<Carousel {headline} {description}>
  {#each projects as project}
    <CarouselItem {smallSpan} {mediumSpan} {largeSpan}>
      <ProjectCard
        slug={project.slug}
        title={project.title}
        description={project.description}
        year={project.year}
        bgColor={project.bgColor}
        thumbnail={project.thumbnail}
      />
    </CarouselItem>
  {/each}
</Carousel>

<script>
  import Carousel from '../carousel/Carousel.svelte';
  import CarouselItem from '../carousel/CarouselItem.svelte';
  import ProjectCard from './ProjectCard.svelte';

  let { projects = [] } = $props();

  const smallSpan = 10;
  const mediumSpan = 5;
  const largeSpan = 4;

  const headline = "Projects";

  const link = {
    href: "/projects",
    text: 'View all projects',
  }

  const description = "A selection of side projects and experiments I've been working on."
</script>

<Carousel {headline} {description} {link}>
  {#each projects as project}
    <CarouselItem {smallSpan} {mediumSpan} {largeSpan}>
      <ProjectCard
        slug={project.slug}
        title={project.title}
        description={project.description}
      />
    </CarouselItem>
  {/each}
</Carousel>

<script>
  import Carousel from '../carousel/Carousel.svelte';
  import CarouselItem from '../carousel/CarouselItem.svelte';
  import ProjectCard from './ProjectCard.svelte';

  let { projects = [] } = $props();

  const smallSpan = 10;
  const mediumSpan = 5;
  const largeSpan = 4;

  const headline = "Projects";

  const description = "Like most of us – I have lot of ideas and projects that I would like to implement. Many of them get lost in my notes or as random thoughts on my computer. But can you believe it? Some of them actually happen."
</script>

<Carousel {headline} {description}>
  {#each projects as project}
    <CarouselItem {smallSpan} {mediumSpan} {largeSpan} paddingBottom={64} paddingTop={24}>
      <ProjectCard
        slug={project.slug}
        title={project.title}
        description={project.description}
        year={project.year}
        bgColor={project.bgColor}
        thumbnail={project.thumbnail}
        thumbnailWidth={project.thumbnailWidth}
        externalUrl={project.externalUrl}
      />
    </CarouselItem>
  {/each}
</Carousel>

<script>
  import Carousel from '../carousel/Carousel.svelte';
  import CarouselItem from '../carousel/CarouselItem.svelte';
  import ProjectCard from './ProjectCard.svelte';

  const smallSpan = 10;
  const mediumSpan = 5;
  const largeSpan = 4;

  const projects = [
    { title: "Project 1", description: "A cool project" },
    { title: "Project 2", description: "Another great project" },
    { title: "Project 3", description: "Something amazing" },
    { title: "Project 4", description: "More awesome work" },
    { title: "Project 5", description: "More awesome work" },
    { title: "Project 6", description: "More awesome work" },
    { title: "Project 7", description: "More awesome work" },
    { title: "Project 8", description: "More awesome work" },
    { title: "Project 9", description: "More awesome work" },
  ];

  const headline = "headline";

  const link = {
    href: "#",
    text: 'test',
  }

  const description = "Ipsum deserunt sunt eu. Tempor id commodo ex dolore labore. Anim cupidatat veniam commodo reprehenderit minim commodo nostrud anim cupidatat. Magna cupidatat sit quis mollit aute esse et veniam cillum do incididunt."
</script>

<Carousel {headline} {description} {link}>
  {#each projects as project}
    <CarouselItem {smallSpan} {mediumSpan} {largeSpan}>
      <ProjectCard {...project} />
    </CarouselItem>
  {/each}
</Carousel>

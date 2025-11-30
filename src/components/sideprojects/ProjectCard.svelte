<script>
  let { title, description = '', slug } = $props();
</script>

<a href="/projects/{slug}" class="project-card block h-full">
  <div class="card-content">
    <h3>{title}</h3>
    {#if description}
      <p>{description}</p>
    {/if}
  </div>
</a>

<style>
  .project-card {
    height: 100%;
    text-decoration: none;
    color: inherit;
    display: block;
  }

  .card-content {
    height: 100%;
    padding: 1rem;
    background-color: tomato;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
  }
</style>

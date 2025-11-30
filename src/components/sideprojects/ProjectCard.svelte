<script>
  let { title, description = '' } = $props();
</script>

<div class="project-card">
  <h3>{title}</h3>
  {#if description}
    <p>{description}</p>
  {/if}
</div>

<style>
  .project-card {
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

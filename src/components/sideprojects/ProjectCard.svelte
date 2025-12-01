<script>
  let { title, description, year, slug, bgColor = '#ef4444', thumbnail } = $props();
</script>

<a href="/projects/{slug}" class="h-full relative aspect-4/5 rounded-2xl p-5 flex flex-col justify-between" style="background-color: {bgColor}">
    <div class="flex justify-between">
        <span class="rounded-full bg-neutral-100/20 px-3 py-1 text-white">{year}</span>
        icon
    </div>
    <div class="h-full flex-center">
        {#if thumbnail}
            <img src={thumbnail} alt={title} class="w-full h-full object-contain p-24" />
        {:else}
            <span class="text-neutral-500">–</span>
        {/if}
    </div>
    <div class="shrink-0 text-white">
        <h3>{title}</h3>
        <p class="opacity-70">{description}</p>
    </div>
</a>

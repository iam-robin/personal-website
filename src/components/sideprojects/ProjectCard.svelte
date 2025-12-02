<script>
    import ArrowsOut from "phosphor-svelte/lib/ArrowsOut";
    import ArrowUpRight from "phosphor-svelte/lib/ArrowUpRight";

    let { title, description, year, slug, bgColor = '#ef4444', thumbnail, thumbnailWidth, externalUrl } = $props();

    const href = externalUrl || `/projects/${slug}`;
    const isExternal = !!externalUrl;
</script>

<a
    {href}
    target={isExternal ? "_blank" : undefined}
    rel={isExternal ? "noopener noreferrer" : undefined}
    class="hover-lift h-full relative aspect-4/5 rounded-2xl p-3 flex flex-col justify-between"
    style="background-color: {bgColor}"
>
    <div class="flex justify-between items-center">
        <span class="rounded-full bg-neutral-100/10 px-3 py-1 text-white">{year}</span>
        <span class="rounded-full bg-neutral-100/10 p-2 text-white">
            {#if isExternal}
                <ArrowUpRight color="white" weight="bold" />
            {:else}
                <ArrowsOut color="white" weight="bold" />
            {/if}
        </span>
    </div>
    <div class="h-full flex-center">
        {#if thumbnail}
            <img src={thumbnail} alt={title} class="h-full object-contain" style={thumbnailWidth ? `width: ${thumbnailWidth}` : 'width: 30%'} />
        {:else}
            <span class="text-neutral-500">–</span>
        {/if}
    </div>
    <div class="shrink-0 text-white">
        <h3>{title}</h3>
        <p class="opacity-70">{description}</p>
    </div>
</a>

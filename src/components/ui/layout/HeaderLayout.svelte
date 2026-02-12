<script lang="ts">
  import { type Snippet } from 'svelte';

  let { children, title, description, background = 'a' }: { children?: Snippet; title: string; description: string; background?: 'a' | 'b' } = $props();
</script>

<header>
  <div aria-hidden="true" class="relative">
    {#if background === 'a'}
      <enhanced:img src="$lib/assets/wallpaper/nms_legacy_15.png?enhanced" alt="" class="h-64 w-full object-cover lg:rounded-t-lg" sizes="min(1920px, 100vw)" fetchpriority="high" />
    {:else}
      <enhanced:img src="$lib/assets/wallpaper/NMS_Contemporary_05.png?enhanced" alt="" class="h-64 w-full object-cover lg:rounded-t-lg" sizes="min(3840px, 100vw)" fetchpriority="high" />
    {/if}
    <div class="absolute inset-0 bg-linear-to-t from-white dark:from-zinc-900"></div>
  </div>

  <div class="relative mx-auto -mt-12 max-w-7xl px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8">
    <div class="mx-auto max-w-2xl text-center lg:max-w-4xl">
      <h2 class="text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl dark:text-white">{title}</h2>
      <p class="mt-4 text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  </div>
</header>

<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
  {@render children?.()}
</div>

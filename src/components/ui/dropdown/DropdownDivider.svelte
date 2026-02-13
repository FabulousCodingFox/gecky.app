<script lang="ts">
  import { clsx } from 'clsx';
  import type { SvelteHTMLElements } from 'svelte/elements';

  let { class: className = '', ...props }: { class?: string } & Omit<SvelteHTMLElements['div'], 'class'> = $props();
</script>

<div {...props} role="separator" class={clsx(className, 'col-span-full mx-3.5 my-1 h-px border-0 bg-zinc-950/5 sm:mx-3 dark:bg-white/10 forced-colors:bg-[CanvasText]')}></div>

<script lang="ts">
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';
  import type { SvelteHTMLElements } from 'svelte/elements';

  let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<SvelteHTMLElements['div'], 'class'> = $props();
</script>

<div data-slot="control" {...props} class={clsx(className, 'grid gap-8 lg:grid-cols-2 xl:grid-cols-3')}>{@render children?.()}</div>

<script lang="ts">
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';
  import type { SvelteHTMLElements } from 'svelte/elements';

  let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<SvelteHTMLElements['a'], 'class'> = $props();
</script>

<a {...props} class={clsx(className, 'text-zinc-950 underline decoration-zinc-950/50 hover:decoration-zinc-950 dark:text-white dark:decoration-white/50 dark:hover:decoration-white')}>{@render children?.()}</a>

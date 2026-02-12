<script lang="ts">
  import clsx from 'clsx';
  import type { Snippet } from 'svelte';
  import type { SvelteHTMLElements } from 'svelte/elements';

  let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<SvelteHTMLElements['div'], 'class'> = $props();
</script>

<div {...props} class={clsx('flex flex-col border-t border-zinc-950/5 p-4 dark:border-white/5 [&>[data-slot=section]+[data-slot=section]]:mt-2.5', className)}>{@render children?.()}</div>

<script lang="ts">
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';
  import type { SvelteHTMLElements } from 'svelte/elements';

  let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<SvelteHTMLElements['span'], 'class'> = $props();
</script>

<span {...props} class={clsx('ml-2.5 truncate first:ml-0 sm:ml-2 sm:first:ml-0', className)}>{@render children?.()}</span>

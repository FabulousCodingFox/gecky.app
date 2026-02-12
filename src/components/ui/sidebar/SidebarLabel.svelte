<script lang="ts">
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';
  import type { SvelteHTMLElements } from 'svelte/elements';

  let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<SvelteHTMLElements['span'], 'class'> = $props();
</script>

<span {...props} class={clsx('truncate', className)}>{@render children?.()}</span>

<script lang="ts">
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';
  import type { SvelteHTMLElements } from 'svelte/elements';

  let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<SvelteHTMLElements['div'], 'class'> = $props();
</script>

<div aria-hidden="true" {...props} class={clsx(className, '-ml-4 flex-1')}>{@render children?.()}</div>

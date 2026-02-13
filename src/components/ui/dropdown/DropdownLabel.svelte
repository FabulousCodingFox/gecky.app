<script lang="ts">
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';
  import type { SvelteHTMLElements } from 'svelte/elements';

  let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<SvelteHTMLElements['div'], 'class'> = $props();
</script>

<div {...props} data-slot="label" class={clsx(className, 'col-start-2 row-start-1')}>
  {@render children?.()}
</div>

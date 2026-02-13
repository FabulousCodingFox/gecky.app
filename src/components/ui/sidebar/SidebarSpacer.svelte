<script lang="ts">
  import clsx from 'clsx';
  import type { SvelteHTMLElements } from 'svelte/elements';

  let { class: className = '', ...props }: { class?: string } & Omit<SvelteHTMLElements['div'], 'class' | 'aria-hidden'> = $props();
</script>

<div aria-hidden="true" {...props} class={clsx('mt-8 flex-1', className)}></div>

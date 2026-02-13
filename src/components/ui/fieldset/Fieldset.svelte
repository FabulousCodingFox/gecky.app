<script lang="ts">
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';
  import type { SvelteHTMLElements } from 'svelte/elements';

  let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<SvelteHTMLElements['fieldset'], 'class'> = $props();
</script>

<fieldset {...props} class={clsx('*:data-[slot=text]:mt-1 [&>*+[data-slot=control]]:mt-6', className)}>{@render children?.()}</fieldset>

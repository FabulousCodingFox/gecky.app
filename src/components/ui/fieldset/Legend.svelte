<script lang="ts">
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<HTMLAttributes<HTMLLegendElement>, 'class'> = $props();
</script>

<legend data-slot="legend" {...props} class={clsx('text-base/6 font-semibold text-zinc-950 data-disabled:opacity-50 sm:text-sm/6 dark:text-white', className)}>{@render children?.()}</legend>

<script lang="ts">
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  let { children, class: className = '', level = 1, ...props }: { children?: Snippet; class?: string; level?: 1 | 2 | 3 | 4 | 5 | 6 } & Omit<HTMLAttributes<HTMLHeadingElement>, 'class'> = $props();
</script>

<svelte:element this={`h${level}`} {...props} class={clsx(className, 'text-2xl/8 font-semibold text-zinc-950 sm:text-xl/8 dark:text-white')}>{@render children?.()}</svelte:element>

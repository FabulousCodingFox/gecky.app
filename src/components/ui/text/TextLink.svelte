<script lang="ts">
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';
  import type { HTMLAnchorAttributes } from 'svelte/elements';

  let { children, class: className = '', href = '#', ...props }: { children?: Snippet; href?: string; class?: string } & Omit<HTMLAnchorAttributes, 'class'> = $props();
</script>

<a {...props} {href} class={clsx(className, 'text-zinc-950 underline decoration-zinc-950/50 data-hover:decoration-zinc-950 dark:text-white dark:decoration-white/50 dark:data-hover:decoration-white')}>{@render children?.()}</a>

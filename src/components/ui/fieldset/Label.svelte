<script lang="ts">
  import { Label } from 'bits-ui';
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';

  let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<Label.RootProps, 'class'> = $props();
</script>

<Label.Root data-slot="label" {...props} class={clsx(className, 'text-base/6 text-zinc-950 select-none data-disabled:opacity-50 sm:text-sm/6 dark:text-white')}>{@render children?.()}</Label.Root>

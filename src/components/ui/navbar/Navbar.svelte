<script lang="ts">
  import { NavigationMenu, type NavigationMenuRootProps } from 'bits-ui';
  import clsx from 'clsx';
  import type { Snippet } from 'svelte';

  let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<NavigationMenuRootProps, 'class'> = $props();
</script>

<NavigationMenu.Root {...props} class={clsx('flex flex-1 items-center gap-4 py-2.5', className)}>{@render children?.()}</NavigationMenu.Root>

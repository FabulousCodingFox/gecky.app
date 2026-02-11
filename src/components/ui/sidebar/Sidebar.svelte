<script lang="ts">
  import { NavigationMenu, type NavigationMenuRootProps } from 'bits-ui';
  import clsx from 'clsx';
  import type { Snippet } from 'svelte';

  let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<NavigationMenuRootProps, 'class'> = $props();
</script>

<NavigationMenu.Root {...props} class={clsx('flex h-full min-h-0 flex-col', className)}>{@render children?.()}</NavigationMenu.Root>

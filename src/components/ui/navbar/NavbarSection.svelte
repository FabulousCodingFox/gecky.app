<script lang="ts">
  import { NavigationMenu, type NavigationMenuListProps } from 'bits-ui';
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';

  let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<NavigationMenuListProps, 'class'> = $props();
</script>

<NavigationMenu.List {...props} class={clsx('flex items-center gap-3', className)}>{@render children?.()}</NavigationMenu.List>

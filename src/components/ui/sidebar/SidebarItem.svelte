<script lang="ts">
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';
  import TouchTarget from '../button/TouchTarget.svelte';
  import { NavigationMenu, type NavigationMenuLinkProps } from 'bits-ui';

  const classes = clsx(
    // Base
    'flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-base/6 font-medium text-zinc-950 sm:py-2 sm:text-sm/5',
    // Leading icon/icon-only
    '*:data-[slot=icon]:size-6 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:fill-zinc-500 sm:*:data-[slot=icon]:size-5',
    // Trailing icon (down chevron or similar)
    '*:last:data-[slot=icon]:ml-auto *:last:data-[slot=icon]:size-5 sm:*:last:data-[slot=icon]:size-4',
    // Avatar
    '*:data-[slot=avatar]:-m-0.5 *:data-[slot=avatar]:size-7 sm:*:data-[slot=avatar]:size-6',
    // Hover
    'data-hover:bg-zinc-950/5 data-hover:*:data-[slot=icon]:fill-zinc-950',
    // Active
    'data-active:bg-zinc-950/5 data-active:*:data-[slot=icon]:fill-zinc-950',
    // Current
    'data-current:*:data-[slot=icon]:fill-zinc-950',
    // Dark mode
    'dark:text-white dark:*:data-[slot=icon]:fill-zinc-400',
    'dark:data-hover:bg-white/5 dark:data-hover:*:data-[slot=icon]:fill-white',
    'dark:data-active:bg-white/5 dark:data-active:*:data-[slot=icon]:fill-white',
    'dark:data-current:*:data-[slot=icon]:fill-white'
  );

  type Props = {
    current?: boolean;
    class?: string;
    children?: Snippet;
  } & Omit<NavigationMenuLinkProps, 'class'>;

  let { children, class: className = '', current = false, ...props }: Props = $props();
</script>

<NavigationMenu.Item class={clsx(className, 'relative')}>
  {#if current}
    <span class="absolute inset-y-2 -left-4 w-0.5 rounded-full bg-zinc-950 dark:bg-white"></span>
  {/if}
  <NavigationMenu.Link {...props} class={clsx('cursor-default', classes)} data-current={current ? 'true' : undefined}>
    <TouchTarget>{@render children?.()}</TouchTarget>
  </NavigationMenu.Link>
</NavigationMenu.Item>

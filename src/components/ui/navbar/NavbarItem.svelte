<script lang="ts">
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';
  import TouchTarget from '../button/TouchTarget.svelte';
  import { NavigationMenu, type NavigationMenuLinkProps } from 'bits-ui';

  const classes = clsx(
    // Base
    'relative flex min-w-0 items-center gap-3 rounded-lg p-2 text-left text-base/6 font-medium text-zinc-950 sm:text-sm/5',
    // Leading icon/icon-only
    '*:data-[slot=icon]:size-6 *:data-[slot=icon]:shrink-0 *:data-[slot=icon]:fill-zinc-500 sm:*:data-[slot=icon]:size-5',
    // Trailing icon (down chevron or similar)
    '*:not-nth-2:last:data-[slot=icon]:ml-auto *:not-nth-2:last:data-[slot=icon]:size-5 sm:*:not-nth-2:last:data-[slot=icon]:size-4',
    // Avatar
    '*:data-[slot=avatar]:-m-0.5 *:data-[slot=avatar]:size-7 *:data-[slot=avatar]:[--avatar-radius:var(--radius-md)] sm:*:data-[slot=avatar]:size-6',
    // Hover
    'hover:bg-zinc-950/5 hover:*:data-[slot=icon]:fill-zinc-950',
    // Active
    'active:bg-zinc-950/5 active:*:data-[slot=icon]:fill-zinc-950',
    // Dark mode
    'dark:text-white dark:*:data-[slot=icon]:fill-zinc-400',
    'dark:hover:bg-white/5 dark:hover:*:data-[slot=icon]:fill-white',
    'dark:active:bg-white/5 dark:active:*:data-[slot=icon]:fill-white'
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
    <span class="absolute inset-x-2 -bottom-2.5 h-0.5 rounded-full bg-zinc-950 dark:bg-white"></span>
  {/if}
  <NavigationMenu.Link {...props} class={classes} data-current={current ? 'true' : undefined}>
    <TouchTarget>{@render children?.()}</TouchTarget>
  </NavigationMenu.Link>
</NavigationMenu.Item>

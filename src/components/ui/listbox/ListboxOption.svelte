<script lang="ts">
  import { Select, type SelectItemProps } from 'bits-ui';
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';

  let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<SelectItemProps, 'class'> = $props();

  const sharedClasses = clsx(
    // Base
    'flex min-w-0 items-center',
    // Icons
    '*:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 sm:*:data-[slot=icon]:size-4',
    '*:data-[slot=icon]:text-zinc-500 group-data-highlighted/option:*:data-[slot=icon]:text-white dark:*:data-[slot=icon]:text-zinc-400',
    'forced-colors:*:data-[slot=icon]:text-[CanvasText] forced-colors:group-data-highlighted/option:*:data-[slot=icon]:text-[Canvas]',
    // Avatars
    '*:data-[slot=avatar]:-mx-0.5 *:data-[slot=avatar]:size-6 sm:*:data-[slot=avatar]:size-5'
  );
</script>

<Select.Item
  class={clsx(
    // Basic layout
    'group/option grid cursor-default grid-cols-[--spacing(5)_1fr] items-baseline gap-x-2 rounded-lg py-2.5 pr-3.5 pl-2 sm:grid-cols-[--spacing(4)_1fr] sm:py-1.5 sm:pr-3 sm:pl-1.5',
    // Typography
    'text-base/6 text-zinc-950 sm:text-sm/6 dark:text-white forced-colors:text-[CanvasText]',
    // Focus
    'outline-hidden data-highlighted:bg-blue-500 data-highlighted:text-white',
    // Forced colors mode
    'forced-color-adjust-none forced-colors:data-highlighted:bg-[Highlight] forced-colors:data-highlighted:text-[HighlightText]',
    // Disabled
    'data-disabled:opacity-50'
  )}
  {...props}
>
  <svg class="relative hidden size-5 self-center stroke-current group-data-selected/option:inline sm:size-4" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 8.5l3 3L12 4" stroke-width={1.5} stroke-linecap="round" stroke-lineJoin="round" />
  </svg>
  <span class={clsx(className, sharedClasses, 'col-start-2')}>{@render children?.()}</span>
</Select.Item>

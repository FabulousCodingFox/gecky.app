<script lang="ts">
  import { Select, type SelectRootPropsWithoutHTML } from 'bits-ui';
  import clsx from 'clsx';
  import type { Snippet, SvelteComponent } from 'svelte';
  import ListboxOption from './ListboxOption.svelte';
  import ListboxLabel from './ListboxLabel.svelte';
  import { sharedClasses } from '.';

  type Props = {
    children?: Snippet;
    value: string;
    class?: string;
    items: { value: string; label: string; icon?: SvelteComponent }[];
  } & Omit<SelectRootPropsWithoutHTML, 'class'>;

  let { children, items = [], class: className = '', value = $bindable(), ...props }: Props = $props();

  let item = $derived(items.find((o) => o.value === value)!);
</script>

<Select.Root {...props as SelectRootPropsWithoutHTML} bind:value={value as never}>
  <Select.Trigger
    data-slot="control"
    class={clsx([
      className,
      // Basic layout
      'group relative block w-full',
      // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
      'before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm',
      // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
      'dark:before:hidden',
      // Hide default focus styles
      'focus:outline-hidden',
      // Focus ring
      'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset data-focus:after:ring-2 data-focus:after:ring-blue-500',
      // Disabled state
      'data-disabled:opacity-50 data-disabled:before:bg-zinc-950/5 data-disabled:before:shadow-none'
    ])}
  >
    <span
      class={clsx([
        // Basic layout
        'relative block w-full appearance-none rounded-lg py-[calc(--spacing(2.5)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
        // Set minimum height for when no value is selected
        'min-h-11 sm:min-h-9',
        // Horizontal padding
        'pr-[calc(--spacing(7)-1px)] pl-[calc(--spacing(3.5)-1px)] sm:pl-[calc(--spacing(3)-1px)]',
        // Typography
        'text-left text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white forced-colors:text-[CanvasText]',
        // Border
        'border border-zinc-950/10 group-data-active:border-zinc-950/20 group-data-hover:border-zinc-950/20 dark:border-white/10 dark:group-data-active:border-white/20 dark:group-data-hover:border-white/20',
        // Background color
        'bg-transparent dark:bg-white/5',
        // Invalid state
        'group-data-invalid:border-red-500 group-data-hover:group-data-invalid:border-red-500 dark:group-data-invalid:border-red-600 dark:data-hover:group-data-invalid:border-red-600',
        // Disabled state
        'group-data-disabled:border-zinc-950/20 group-data-disabled:opacity-100 dark:group-data-disabled:border-white/15 dark:group-data-disabled:bg-white/2.5 dark:group-data-disabled:data-hover:border-white/15'
      ])}
    >
      <div class={clsx(sharedClasses, 'gap-2')}>
        <item.icon width="20" height="20" data-slot="icon" />
        {item.label}
      </div>
    </span>
    <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
      <svg class="size-5 stroke-zinc-500 group-data-disabled:stroke-zinc-600 sm:size-4 dark:stroke-zinc-400 forced-colors:stroke-[CanvasText]" viewBox="0 0 16 16" aria-hidden="true" fill="none">
        <path d="M5.75 10.75L8 13L10.25 10.75" stroke-width={1.5} stroke-linecap="round" stroke-linejoin="round" />
        <path d="M10.25 5.25L8 3L5.75 5.25" stroke-width={1.5} stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </span>
  </Select.Trigger>
  <Select.Portal>
    <Select.Content
      align="center"
      class={clsx(
        // Anchor positioning
        '[--anchor-offset:-1.625rem] [--anchor-padding:--spacing(4)] sm:[--anchor-offset:-1.375rem]',
        // Base styles
        'isolate w-max min-w-[calc(var(--button-width)+1.75rem)] scroll-py-1 rounded-xl p-1 select-none',
        // Invisible border that is only visible in `forced-colors` mode for accessibility purposes
        'outline outline-transparent focus:outline-hidden',
        // Handle scrolling when menu won't fit in viewport
        'overflow-y-scroll overscroll-contain',
        // Popover background
        'bg-white/75 backdrop-blur-xl dark:bg-zinc-800/75',
        // Shadows
        'shadow-lg ring-1 ring-zinc-950/10 dark:ring-white/10 dark:ring-inset',
        // Transitions
        'transition-opacity duration-100 ease-in data-closed:data-leave:opacity-0 data-transition:pointer-events-none'
      )}
    >
      {#each items as { value, label, icon: Icon } (value)}
        <ListboxOption {value} {label}>
          <Icon width="20" height="20" data-slot="icon" />
          <ListboxLabel>{label}</ListboxLabel>
        </ListboxOption>
      {/each}
    </Select.Content>
  </Select.Portal>
</Select.Root>

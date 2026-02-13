<script lang="ts">
  import { clsx } from 'clsx';
  import { styles } from '../button/buttonStyles';
  import type { SvelteHTMLElements } from 'svelte/elements';

  const dateTypes = ['date', 'datetime-local', 'month', 'time', 'week'];
  type DateType = (typeof dateTypes)[number];

  type InputProps = {
    class?: string;
    type?: 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url' | DateType | 'button';
    value?: string;
  } & Omit<SvelteHTMLElements['input'], 'class' | 'type' | 'value'>;

  let { class: className = '', type = 'text', value = $bindable(), ...props }: InputProps = $props();
</script>

<span
  data-slot="control"
  class={clsx([
    className,
    // Basic layout
    'relative block w-full',
    // Background color + shadow applied to inset pseudo element, so shadow blends with border in light mode
    'before:absolute before:inset-px before:rounded-[calc(var(--radius-lg)-1px)] before:bg-white before:shadow-sm',
    // Background color is moved to control and shadow is removed in dark mode so hide `before` pseudo
    'dark:before:hidden',
    // Focus ring
    'after:pointer-events-none after:absolute after:inset-0 after:rounded-lg after:ring-transparent after:ring-inset sm:focus-within:after:ring-2 sm:focus-within:after:ring-blue-500',
    // Disabled state
    'disabled:opacity-50 disabled:before:bg-zinc-950/5 disabled:before:shadow-none'
  ])}
>
  <input
    {type}
    bind:value
    {...props}
    class={type === 'button'
      ? clsx(styles.base, styles.solid, styles.colors['dark/zinc'])
      : clsx([
          // Date classes
          type &&
            dateTypes.includes(type) && [
              '[&::-webkit-datetime-edit-fields-wrapper]:p-0',
              '[&::-webkit-date-and-time-value]:min-h-[1.5em]',
              '[&::-webkit-datetime-edit]:inline-flex',
              '[&::-webkit-datetime-edit]:p-0',
              '[&::-webkit-datetime-edit-year-field]:p-0',
              '[&::-webkit-datetime-edit-month-field]:p-0',
              '[&::-webkit-datetime-edit-day-field]:p-0',
              '[&::-webkit-datetime-edit-hour-field]:p-0',
              '[&::-webkit-datetime-edit-minute-field]:p-0',
              '[&::-webkit-datetime-edit-second-field]:p-0',
              '[&::-webkit-datetime-edit-millisecond-field]:p-0',
              '[&::-webkit-datetime-edit-meridiem-field]:p-0'
            ],
          // Basic layout
          'relative block w-full appearance-none rounded-lg px-[calc(--spacing(3.5)-1px)] py-[calc(--spacing(2.5)-1px)] sm:px-[calc(--spacing(3)-1px)] sm:py-[calc(--spacing(1.5)-1px)]',
          // Typography
          'text-base/6 text-zinc-950 placeholder:text-zinc-500 sm:text-sm/6 dark:text-white',
          // Border
          'border border-zinc-950/10 hover:border-zinc-950/20 dark:border-white/10 dark:hover:border-white/20',
          // Background color
          'bg-transparent dark:bg-white/5',
          // Hide default focus styles
          'focus:outline-hidden',
          // Invalid state
          'aria-invalid:border-red-500 aria-invalid:hover:border-red-500 dark:aria-invalid:border-red-600 dark:aria-invalid:hover:border-red-600',
          // Disabled state
          'disabled:border-zinc-950/20 dark:disabled:border-white/15 dark:disabled:bg-white/2.5 dark:hover:disabled:border-white/15',
          // System icons
          'dark:scheme-dark'
        ])}
  />
</span>

<script lang="ts">
  import { Dialog } from 'bits-ui';
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';

  let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<Dialog.TitleProps, 'class'> = $props();
</script>

<Dialog.Title {...props} class={clsx(className, 'text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white')}>{@render children?.()}</Dialog.Title>

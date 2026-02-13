<script lang="ts">
  import { Dialog } from 'bits-ui';
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';

  let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<Dialog.DescriptionProps, 'class'> = $props();
</script>

<Dialog.Description {...props} class={clsx(className, 'mt-2 text-pretty', 'text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400')} data-slot="text">{@render children?.()}</Dialog.Description>

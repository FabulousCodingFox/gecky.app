<script lang="ts">
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';
  import type { HTMLFieldsetAttributes } from 'svelte/elements';

  let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<HTMLFieldsetAttributes, 'class'> = $props();
</script>

<fieldset {...props} class={clsx('*:data-[slot=text]:mt-1 [&>*+[data-slot=control]]:mt-6', className)}>{@render children?.()}</fieldset>

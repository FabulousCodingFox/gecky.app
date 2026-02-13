<script lang="ts">
  import { clsx } from 'clsx';
  import type { HTMLAttributes } from 'svelte/elements';

  let { class: className = '', soft = false, ...props }: { class?: string; soft?: boolean } & Omit<HTMLAttributes<HTMLHRElement>, 'class'> = $props();
</script>

<hr role="presentation" {...props} class={clsx(className, 'w-full border-t', soft && 'border-zinc-950/5 dark:border-white/5', !soft && 'border-zinc-950/10 dark:border-white/10')} />

<script lang="ts">
	import { clsx } from 'clsx';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<HTMLAttributes<HTMLElement>, 'class'> = $props();
</script>

<p data-slot="text" {...props} class={clsx('text-base/6 text-zinc-500 sm:text-sm/6 dark:text-zinc-400', className)}>{@render children?.()}</p>

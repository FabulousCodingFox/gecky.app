<script lang="ts">
	import { clsx } from 'clsx';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, class: className = '', level = 2, ...props }: { children?: Snippet; class?: string; level?: 1 | 2 | 3 | 4 | 5 | 6 } & Omit<HTMLAttributes<HTMLHeadingElement>, 'class'> = $props();
</script>

<svelte:element this={`h${level}`} {...props} class={clsx(className, 'text-base/7 font-semibold text-zinc-950 sm:text-sm/6 dark:text-white')}>{@render children?.()}</svelte:element>

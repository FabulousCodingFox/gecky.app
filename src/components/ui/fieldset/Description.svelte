<script lang="ts">
	import { clsx } from 'clsx';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<HTMLAttributes<HTMLDivElement>, 'class'> = $props();
</script>

<div {...props} data-slot="description" class={clsx(className, 'text-base/6 text-zinc-500 data-disabled:opacity-50 sm:text-sm/6 dark:text-zinc-400')}>{@render children?.()}</div>

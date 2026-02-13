<script lang="ts">
	import { clsx } from 'clsx';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<HTMLAttributes<HTMLDivElement>, 'class'> = $props();
</script>

<div {...props} data-slot="error" class={clsx(className, 'text-base/6 text-red-600 disabled:opacity-50 sm:text-sm/6 dark:text-red-500')}>{@render children?.()}</div>

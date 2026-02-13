<script lang="ts">
	import { clsx } from 'clsx';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<HTMLAttributes<HTMLDivElement>, 'class'> = $props();
</script>

<div
	{...props}
	class={clsx(
		className,
		'[&>[data-slot=label]+[data-slot=control]]:mt-3',
		'[&>[data-slot=label]+[data-slot=description]]:mt-1',
		'[&>[data-slot=description]+[data-slot=control]]:mt-3',
		'[&>[data-slot=control]+[data-slot=description]]:mt-3',
		'[&>[data-slot=control]+[data-slot=error]]:mt-3',
		'*:data-[slot=label]:font-medium'
	)}
>
	{@render children?.()}
</div>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<strong class="font-medium text-zinc-950 dark:text-white">{@render children?.()}</strong>

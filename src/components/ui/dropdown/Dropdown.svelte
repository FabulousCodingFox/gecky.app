<script lang="ts">
	import { DropdownMenu } from 'bits-ui';

	let { ...props }: DropdownMenu.RootProps = $props();
</script>

<DropdownMenu.Root {...props}></DropdownMenu.Root>

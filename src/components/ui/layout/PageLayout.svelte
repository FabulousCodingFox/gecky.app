<script lang="ts">
  import { type Snippet } from 'svelte';

  let { children }: { children?: Snippet } = $props();
</script>

<div class="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
  {@render children?.()}
</div>

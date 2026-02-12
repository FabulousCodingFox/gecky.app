<script lang="ts">
  import { type Snippet } from 'svelte';
  import Sidebar from '../sidebar/Sidebar.svelte';

  let { children, sidebar }: { children?: Snippet; sidebar: Snippet } = $props();
</script>

<div class="relative isolate flex min-h-svh w-full bg-white max-lg:flex-col lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
  <div class="fixed inset-y-0 left-0 w-64 max-lg:hidden">
    <Sidebar>
      {@render sidebar?.()}
    </Sidebar>
  </div>

  <main class="flex flex-1 flex-col pb-2 lg:min-w-0 lg:pt-2 lg:pr-2 lg:pl-64">
    <div class="grow lg:rounded-lg lg:bg-white lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
      {@render children?.()}
    </div>
  </main>
</div>

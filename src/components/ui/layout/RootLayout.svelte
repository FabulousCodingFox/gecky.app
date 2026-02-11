<script lang="ts">
  import { type Snippet } from 'svelte';
  import clsx from 'clsx';
  import { sidebar } from '$lib/sidebar.svelte';
  import Sidebar from '../sidebar/Sidebar.svelte';
  import SidebarBody from '../sidebar/SidebarBody.svelte';

  let { children, navbar }: { children?: Snippet; navbar: Snippet } = $props();
</script>

<div class="relative isolate flex min-h-svh w-full flex-col bg-white lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
  {#if sidebar.snippet}
    <div class="fixed inset-y-0 left-0 w-64 pt-14 max-lg:hidden">
      <Sidebar>
        <SidebarBody>
          {@render sidebar.snippet?.()}
        </SidebarBody>
      </Sidebar>
    </div>
  {/if}

  <header class={clsx('flex items-center px-4', sidebar.snippet && 'lg:pl-64')}>
    <div class="min-w-0 flex-1">
      {@render navbar?.()}
    </div>
  </header>

  <main class={clsx('flex flex-1 flex-col pb-2 lg:px-2', sidebar.snippet && 'lg:pl-64')}>
    <div class="grow lg:rounded-lg lg:bg-white lg:shadow-xs lg:ring-1 lg:ring-zinc-950/5 dark:lg:bg-zinc-900 dark:lg:ring-white/10">
      {@render children?.()}
    </div>
  </main>
</div>

<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import { toast_store } from './index.svelte';
  import ToastItem from './ToastItem.svelte';
</script>

<div aria-live="assertive" class="pointer-events-none fixed inset-0 z-[60000] flex items-end px-4 py-6 sm:items-start sm:p-6">
  <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
    {#each toast_store as item (item.id)}
      <div
        in:fly={{ x: 300 }}
        out:fade
        animate:flip={{ duration: 200 }}
        class="dark:bg- pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black/5 transition data-closed:opacity-0 data-enter:transform data-enter:duration-300 data-enter:ease-out data-closed:data-enter:translate-y-2 data-leave:duration-100 data-leave:ease-in data-closed:data-enter:sm:translate-x-2 data-closed:data-enter:sm:translate-y-0 dark:bg-zinc-900 dark:ring-white/5"
      >
        <ToastItem options={item} />
      </div>
    {/each}
  </div>
</div>

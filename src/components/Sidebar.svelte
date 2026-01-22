<script lang="ts">
  import { page } from '$app/state';
  import type { Component } from 'svelte';

  let { data }: { data: { name: string; href: string; icon: Component | null }[] } = $props();
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<div class="hidden pt-16 lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col dark:bg-gray-900">
  <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pt-5 dark:border-white/10 dark:bg-black/10">
    <nav class="flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" class="-mx-2 space-y-1">
            {#each data as sidebarItem (sidebarItem.name)}
              <li>
                {#if page.url.pathname === sidebarItem.href}
                  <a href={sidebarItem.href} class="group flex gap-x-3 rounded-md bg-gray-50 p-2 text-sm/6 font-semibold text-primary-600 dark:bg-white/5 dark:text-white">
                    {#if sidebarItem.icon}
                      <sidebarItem.icon width="24" height="24" class="size-6 shrink-0 text-primary-600 dark:text-white" />
                    {/if}
                    {sidebarItem.name}
                  </a>
                {:else}
                  <a href={sidebarItem.href} class="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-primary-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white">
                    {#if sidebarItem.icon}
                      <sidebarItem.icon width="24" height="24" class="size-6 shrink-0 text-gray-400 group-hover:text-primary-600 dark:group-hover:text-white" />
                    {/if}
                    {sidebarItem.name}
                  </a>
                {/if}
              </li>
            {/each}
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</div>

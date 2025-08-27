<script lang="ts">
  import type { LocalSettingsStore } from '$lib';
  import type { LocalState } from '$lib/localState.svelte';
  import { getContext } from 'svelte';

  let { children } = $props();

  const localSettings = getContext('localSettings') as LocalSettingsStore;
  const localState = getContext('localState') as LocalState;
</script>

{#snippet sideBarTab(text, active)}
  <li>
    {#if active}
      <a href="#" class="group flex gap-x-3 rounded-md bg-gray-50 p-2 text-sm/6 font-semibold text-indigo-600 dark:bg-white/5 dark:text-white">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-white">
          <path
            d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {text}
      </a>
    {:else}
      <a href="#" class="group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6 shrink-0 text-gray-400 group-hover:text-indigo-600 dark:text-gray-400 dark:group-hover:text-white">
          <path
            d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {text}
      </a>
    {/if}
  </li>
{/snippet}

<div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col dark:bg-gray-900">
  <!-- Sidebar component, swap this element with another sidebar if you like -->
  <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 dark:border-white/10 dark:bg-black/10">
    <div class="flex h-16 shrink-0 items-center">
      <img src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" class="h-8 w-auto" />
    </div>
    <nav class="flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" class="flex flex-1 flex-col gap-y-7">
            <li>
              <ul role="list" class="-mx-2 space-y-1">
                {@render sideBarTab('Dashboard', true)}
                {@render sideBarTab('Exosuit', false)}
                {@render sideBarTab('Multitool', false)}
                {@render sideBarTab('Ships', false)}
                {@render sideBarTab('Squadron', false)}
                {@render sideBarTab('Freighter', false)}
                {@render sideBarTab('Frigates', false)}
                {@render sideBarTab('Vehicles', false)}
                {@render sideBarTab('Companions', false)}
                {@render sideBarTab('Bases & Storage', false)}
                {@render sideBarTab('Settlements', false)}
                {@render sideBarTab('Discovery', false)}
                {@render sideBarTab('Milestones', false)}
                {@render sideBarTab('Account', false)}
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</div>

<div
  class="sticky top-0 z-40 flex items-center gap-x-6 bg-white px-4 py-4 shadow-xs sm:px-6 lg:hidden dark:bg-gray-900 dark:shadow-none dark:after:pointer-events-none dark:after:absolute dark:after:inset-0 dark:after:border-b dark:after:border-white/10 dark:after:bg-black/10"
>
  <button type="button" command="show-modal" commandfor="sidebar" class="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden dark:text-gray-400 dark:hover:text-white">
    <span class="sr-only">Open sidebar</span>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6">
      <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
  <div class="flex-1 text-sm/6 font-semibold text-gray-900 dark:text-white">Dashboard</div>
</div>

<main class="py-10 lg:pl-72">
  <div class="px-4 sm:px-6 lg:px-8">
    {@render children?.()}
  </div>
</main>

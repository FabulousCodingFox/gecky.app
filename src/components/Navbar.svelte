<script lang="ts">
  import { languages, themes, type LocalSettingsStore } from '$lib';
  import type { LocalState } from '$lib/localState.svelte';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { Select } from 'bits-ui';
  import { getContext } from 'svelte';

  let { children } = $props();

  const localSettings = getContext('localSettings') as LocalSettingsStore;
  const localState = getContext('localState') as LocalState;

  let currentLanguageObject = $derived(Object.values(languages).find((lang) => lang.id === localSettings.language) || languages.en);
  let currentThemeObject = $derived(Object.values(themes).find((theme) => theme.id === localSettings.theme) || themes.light);
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

<div class="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col dark:bg-gray-900">
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

<div class="lg:pl-72">
  <div class="sticky top-0 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-xs sm:gap-x-6 sm:px-6 lg:px-8 dark:border-white/10 dark:bg-gray-900">
    <button type="button" command="show-modal" commandfor="sidebar" class="-m-2.5 p-2.5 text-gray-700 hover:text-gray-900 lg:hidden dark:text-gray-400 dark:hover:text-white">
      <span class="sr-only">Open sidebar</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6">
        <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <!-- Separator -->
    <div aria-hidden="true" class="h-6 w-px bg-gray-900/10 lg:hidden dark:bg-white/10"></div>

    <div class="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
      <form action="#" method="GET" class="grid flex-1 grid-cols-1">
        <input
          name="search"
          placeholder="Search"
          aria-label="Search"
          class="col-start-1 row-start-1 block size-full border-none bg-white pl-8 text-base text-gray-900 outline-hidden placeholder:text-gray-400 sm:text-sm/6 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500"
        />
        <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="pointer-events-none col-start-1 row-start-1 size-5 self-center text-gray-400">
          <path d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z" clip-rule="evenodd" fill-rule="evenodd" />
        </svg>
      </form>
      <div class="flex items-center gap-x-4 lg:gap-x-6">
        <Select.Root type="single" allowDeselect={false} bind:value={localSettings.theme}>
          <Select.Trigger
            aria-haspopup="listbox"
            type="button"
            class="grid cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:focus-visible:outline-indigo-500"
          >
            <div class="col-start-1 row-start-1 flex items-center gap-3 pr-6">
              <Icon src={currentThemeObject.icon} class="size-5 shrink-0 rounded-full" theme="outline" size="20px" />
              <span class="block truncate">{currentThemeObject.name}</span>
            </div>
            <svg viewBox="0 0 16 16" fill="currentColor" data-slot="icon" aria-hidden="true" class="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400">
              <path
                d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z"
                clip-rule="evenodd"
                fill-rule="evenodd"
              />
            </svg>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content class="max-h-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 sm:text-sm dark:bg-gray-800 dark:outline-white/10">
              {#each Object.values(themes) as theme (theme.id)}
                <Select.Item
                  value={theme.id}
                  class="group/option relative block cursor-default py-2 pr-9 pl-3 text-gray-900 select-none focus:bg-indigo-600 focus:text-white focus:outline-hidden dark:text-white dark:focus:bg-indigo-500 dark:focus:text-white"
                >
                  <div class="flex items-center">
                    <Icon src={theme.icon} class="size-5 shrink-0 rounded-full text-white" theme="outline" size="20px" />
                    <span class="ml-3 block truncate font-normal group-aria-selected/option:font-semibold">{theme.name}</span>
                  </div>
                  <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-aria-selected/option:hidden group-focus/option:text-white in-[el-selectedcontent]:hidden dark:text-indigo-400">
                    <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-5">
                      <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" fill-rule="evenodd" />
                    </svg>
                  </span>
                </Select.Item>
              {/each}
            </Select.Content>
          </Select.Portal>
        </Select.Root>

        <!-- Separator -->
        <div aria-hidden="true" class="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-900/10 dark:lg:bg-gray-100/10"></div>

        <Select.Root type="single" allowDeselect={false} bind:value={localSettings.language}>
          <Select.Trigger
            aria-haspopup="listbox"
            type="button"
            class="grid cursor-default grid-cols-1 rounded-md bg-white py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:focus-visible:outline-indigo-500"
          >
            <div class="col-start-1 row-start-1 flex items-center gap-3 pr-6">
              <!--temp fix-->
              {#if currentLanguageObject.id === 'de'}
                <img src={languages.de.flag} alt="" class="size-5 shrink-0 rounded-full bg-gray-100 dark:bg-gray-700 dark:-outline-offset-1 dark:outline-white/10" />
              {:else}
                <img src={languages.en.flag} alt="" class="size-5 shrink-0 rounded-full bg-gray-100 dark:bg-gray-700 dark:-outline-offset-1 dark:outline-white/10" />
              {/if}
              <span class="block truncate">{currentLanguageObject.name}</span>
            </div>
            <svg viewBox="0 0 16 16" fill="currentColor" data-slot="icon" aria-hidden="true" class="col-start-1 row-start-1 size-5 self-center justify-self-end text-gray-500 sm:size-4 dark:text-gray-400">
              <path
                d="M5.22 10.22a.75.75 0 0 1 1.06 0L8 11.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-2.25 2.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 0 1 0-1.06ZM10.78 5.78a.75.75 0 0 1-1.06 0L8 4.06 6.28 5.78a.75.75 0 0 1-1.06-1.06l2.25-2.25a.75.75 0 0 1 1.06 0l2.25 2.25a.75.75 0 0 1 0 1.06Z"
                clip-rule="evenodd"
                fill-rule="evenodd"
              />
            </svg>
          </Select.Trigger>
          <Select.Portal>
            <Select.Content class="max-h-56 overflow-auto rounded-md bg-white py-1 text-base shadow-lg outline-1 outline-black/5 sm:text-sm dark:bg-gray-800 dark:outline-white/10">
              {#each Object.values(languages) as lang (lang.id)}
                <Select.Item
                  value={lang.id}
                  class="group/option relative block cursor-default py-2 pr-9 pl-3 text-gray-900 select-none focus:bg-indigo-600 focus:text-white focus:outline-hidden dark:text-white dark:focus:bg-indigo-500 dark:focus:text-white"
                >
                  <div class="flex items-center">
                    <img src={lang.flag} alt="" class="size-5 shrink-0 rounded-full" />
                    <span class="ml-3 block truncate font-normal group-aria-selected/option:font-semibold">{lang.name}</span>
                  </div>
                  <span class="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-aria-selected/option:hidden group-focus/option:text-white in-[el-selectedcontent]:hidden dark:text-indigo-400">
                    <svg viewBox="0 0 20 20" fill="currentColor" data-slot="icon" aria-hidden="true" class="size-5">
                      <path d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clip-rule="evenodd" fill-rule="evenodd" />
                    </svg>
                  </span>
                </Select.Item>
              {/each}
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>
    </div>
  </div>

  <main class="py-10">
    <div class="px-4 sm:px-6 lg:px-8">
      {@render children?.()}
    </div>
  </main>
</div>

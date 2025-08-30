<script lang="ts">
  import { languages, themes, type LocalSettingsStore } from '$lib';
  import { m } from '$lib/paraglide/messages';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { Select } from 'bits-ui';
  import { getContext } from 'svelte';

  const localSettings = getContext('localSettings') as LocalSettingsStore;

  let { activeTab = null }: { activeTab?: null | 'account' | 'save' } = $props();

  let currentLanguageObject = $derived(Object.values(languages).find((lang) => lang.id === localSettings.language) || languages.en);
  let currentThemeObject = $derived(Object.values(themes).find((theme) => theme.id === localSettings.theme) || themes.light);
</script>

{#snippet navLink(text: string, href: string, active: boolean)}
  {#if active}
    <a {href} aria-current="page" class="inline-flex items-center border-b-2 border-indigo-600 px-1 pt-1 text-sm font-medium text-gray-900 dark:border-indigo-500 dark:text-white">{text}</a>
  {:else}
    <a {href} class="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 dark:text-gray-300 dark:hover:border-white/20 dark:hover:text-white">{text}</a>
  {/if}
{/snippet}

<nav class="relative bg-white dark:dark:bg-gray-800/50 dark:after:pointer-events-none dark:after:absolute dark:after:inset-x-0 dark:after:bottom-0 dark:after:h-px dark:after:bg-white/10 light:shadow-sm">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <div class="flex h-16 justify-between">
      <div class="flex">
        <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
          {@render navLink(m.page_save_title(), '/save/', activeTab === 'save')}
          {@render navLink(m.page_account_title(), '/account/', activeTab === 'account')}
        </div>
      </div>
      <div class="hidden sm:ml-6 sm:flex sm:items-center sm:gap-x-4 lg:gap-x-6">
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
                    <Icon src={theme.icon} class="size-5 shrink-0 rounded-full text-gray-900 dark:text-white" theme="outline" size="20px" />
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
      <div class="-mr-2 flex items-center sm:hidden">
        <!-- Mobile menu button -->
        <button
          type="button"
          command="--toggle"
          commandfor="mobile-menu"
          class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-2 focus:-outline-offset-1 focus:outline-indigo-600"
        >
          <span class="absolute -inset-0.5"></span>
          <span class="sr-only">Open main menu</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6 in-aria-expanded:hidden">
            <path d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" data-slot="icon" aria-hidden="true" class="size-6 not-in-aria-expanded:hidden">
            <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</nav>

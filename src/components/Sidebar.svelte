<script lang="ts">
  import { Icon } from '@steeze-ui/svelte-icon';

  let { data, value = $bindable() }: { data: { name: string; tab: string; icon: any | null }[]; value: string } = $props();
</script>

<div class="bg-white pt-16 lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col dark:bg-gray-900">
  <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 px-6 pt-5 dark:border-white/10">
    <nav class="flex flex-1 flex-col">
      <ul role="list" class="flex flex-1 flex-col gap-y-7">
        <li>
          <ul role="list" class="-mx-2 space-y-1">
            {#each data as sidebarItem}
              <li>
                <button
                  type="button"
                  onclick={() => (value = sidebarItem.tab)}
                  class={'group flex w-full cursor-pointer gap-x-3 rounded-md p-2 text-sm/6 font-semibold ' +
                    (sidebarItem.tab === value ? 'bg-gray-50 text-indigo-600 dark:bg-white/5 dark:text-white' : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-white')}
                >
                  {#if sidebarItem.icon}
                    <Icon src={sidebarItem.icon} theme="outline" size="24px" class="size-6 shrink-0" />
                  {/if}
                  {sidebarItem.name}
                </button>
              </li>
            {/each}
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</div>

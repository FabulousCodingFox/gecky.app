<script lang="ts">
  type Item = {
    value: string;
    values: string[];
  };

  type Group = {
    label: string;
    items: Item[];
  };

  let { values = $bindable(), header, groups }: { values: string[]; header: string[]; groups: Group[] } = $props();
</script>

<div class="mt-8 flow-root">
  <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
      <div class="group/table relative">
        <table id="users-table" class="relative min-w-full table-fixed divide-y divide-gray-300 dark:divide-white/15">
          <thead>
            <tr>
              <th scope="col" class="relative px-7 sm:w-12 sm:px-6">
                <div class="group absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1">
                  <input
                    type="checkbox"
                    class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-gray-800/50 checked:border-indigo-600 checked:bg-indigo-500 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/20 dark:checked:border-indigo-500 dark:indeterminate:border-indigo-500 dark:indeterminate:bg-indigo-500 dark:disabled:border-white/10 dark:disabled:bg-gray-800 dark:disabled:checked:bg-gray-800 forced-colors:appearance-auto"
                  />
                  <svg viewBox="0 0 14 14" fill="none" class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25 dark:group-has-disabled:stroke-white/25">
                    <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-checked:opacity-100" />
                    <path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-indeterminate:opacity-100" />
                  </svg>
                </div>
              </th>
              {#each header as h, i (h)}
                {#if i === 0}
                  <th scope="col" class="py-3.5 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white">{h}</th>
                {:else}
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">{h}</th>
                {/if}
              {/each}
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-white/10">
            {#each groups as group (group.label)}
              <tr class="border-t border-gray-200 dark:border-white/10">
                <th scope="colgroup" colSpan={5} class="bg-gray-100 py-2 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-3 dark:bg-gray-800/50 dark:text-white">
                  {group.label}
                </th>
              </tr>
              {#each group.items as item (item.value)}
                <tr class="group has-checked:bg-gray-50 dark:has-checked:bg-gray-800/50">
                  <td class="relative px-7 sm:w-12 sm:px-6">
                    <div class="absolute inset-y-0 left-0 hidden w-0.5 bg-indigo-600 group-has-checked:block dark:bg-indigo-500"></div>

                    <div class="group absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1">
                      <input
                        checked={values.includes(item.value)}
                        type="checkbox"
                        onchange={(e) => {
                          if (e.currentTarget.checked) {
                            if (!values.includes(item.value)) values.push(item.value);
                          } else {
                            values = values.filter((v) => v !== item.value);
                          }
                        }}
                        class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-gray-800/50 checked:border-indigo-600 checked:bg-indigo-500 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/20 dark:checked:border-indigo-500 dark:indeterminate:border-indigo-500 dark:indeterminate:bg-indigo-500 dark:disabled:border-white/10 dark:disabled:bg-gray-800 dark:disabled:checked:bg-gray-800 forced-colors:appearance-auto"
                      />
                      <svg viewBox="0 0 14 14" fill="none" class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-white/25">
                        <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-checked:opacity-100" />
                        <path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-indeterminate:opacity-100" />
                      </svg>
                    </div>
                  </td>
                  {#each item.values as v, i (v)}
                    {#if i === 0}
                      <td class="py-4 pr-3 text-sm font-medium whitespace-nowrap text-gray-900 group-has-checked:text-indigo-600 dark:text-white dark:group-has-checked:text-indigo-400">{v}</td>
                    {:else}
                      <td class="px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400">{v}</td>
                    {/if}
                  {/each}
                </tr>
              {/each}
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  </div>
</div>

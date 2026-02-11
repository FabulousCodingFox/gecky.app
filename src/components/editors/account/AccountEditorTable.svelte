<script lang="ts">
  interface TableItem {
    value: string;
    values: string[];
  }

  interface TableGroup {
    label: string | null;
    items: TableItem[];
  }

  interface Props {
    values: string[];
    header: string[];
    groups: TableGroup[];
  }

  let { values = $bindable(), header, groups }: Props = $props();

  // Constants for styling
  const CHECKBOX_CLASSES =
    'col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-gray-800/50 checked:border-primary-600 checked:bg-primary-500 indeterminate:border-primary-600 indeterminate:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 dark:border-white/20 dark:checked:border-primary-500 dark:indeterminate:border-primary-500 dark:indeterminate:bg-primary-500 dark:disabled:border-white/10 dark:disabled:bg-gray-800 dark:disabled:checked:bg-gray-800 forced-colors:appearance-auto';

  const SVG_CLASSES = 'pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25 dark:group-has-disabled:stroke-white/25';

  // Derived states for better performance
  const allItemValues = $derived(groups.flatMap((g) => g.items.map((i) => i.value)));
  const selectedCount = $derived(values.length);
  const totalCount = $derived(allItemValues.length);
  const isAllSelected = $derived(selectedCount === totalCount && totalCount > 0);
  const isPartiallySelected = $derived(selectedCount > 0 && selectedCount < totalCount);
  const isIndeterminate = $derived(isPartiallySelected);

  // Event handlers
  function handleSelectAll(event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    if (target.checked) {
      values = [...allItemValues];
    } else {
      values = [];
    }
  }

  function handleItemToggle(itemValue: string) {
    if (!values.includes(itemValue)) {
      values = [...values, itemValue];
    } else {
      values = values.filter((v) => v !== itemValue);
    }
  }

  function handleGroupToggle(group: TableGroup, event: Event) {
    const target = event.currentTarget as HTMLInputElement;
    const groupValues = group.items.map((item) => item.value);

    if (target.checked) {
      // Add all group items that aren't already selected
      const newValues = groupValues.filter((gv) => !values.includes(gv));
      values = [...values, ...newValues];
    } else {
      // Remove all group items from selection
      values = values.filter((v) => !groupValues.includes(v));
    }
  }

  function isGroupSelected(group: TableGroup): boolean {
    return group.items.every((item) => values.includes(item.value));
  }

  function isGroupPartiallySelected(group: TableGroup): boolean {
    const groupValues = group.items.map((item) => item.value);
    const selectedInGroup = groupValues.filter((gv) => values.includes(gv));
    return selectedInGroup.length > 0 && selectedInGroup.length < groupValues.length;
  }
</script>

<div class="mt-8 flow-root">
  <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
    <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
      <div class="group/table relative">
        <table class="relative min-w-full table-fixed divide-y divide-gray-300 dark:divide-white/15" aria-label="Account editor data table">
          <thead>
            <tr>
              <th scope="col" class="relative px-7 sm:w-12 sm:px-6" aria-label="Select all items">
                <div class="group absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onchange={handleSelectAll}
                    class={CHECKBOX_CLASSES}
                    aria-label={isAllSelected ? 'Deselect all items' : 'Select all items'}
                    aria-describedby="select-all-description"
                  />
                  <svg viewBox="0 0 14 14" fill="none" class={SVG_CLASSES} aria-hidden="true">
                    <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-checked:opacity-100" />
                    <path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-indeterminate:opacity-100" />
                  </svg>
                </div>
                <span class="sr-only">
                  {selectedCount} of {totalCount} items selected
                </span>
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
            {#each groups as group, groupIndex (group.label)}
              {#if group.label}
                <tr class="group border-t border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-gray-800/50">
                  <th scope="colgroup" class="relative px-7 sm:w-12 sm:px-6">
                    <div class="absolute inset-y-0 left-0 hidden w-0.5 bg-primary-600 group-has-checked:block dark:bg-primary-500" aria-hidden="true"></div>
                    <div class="group absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1">
                      <input type="checkbox" checked={isGroupSelected(group)} indeterminate={isGroupPartiallySelected(group)} onchange={(e) => handleGroupToggle(group, e)} class={CHECKBOX_CLASSES} aria-label={`Select all items in ${group.label} group`} />
                      <svg viewBox="0 0 14 14" fill="none" class={SVG_CLASSES} aria-hidden="true">
                        <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-checked:opacity-100" />
                        <path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-indeterminate:opacity-100" />
                      </svg>
                    </div>
                  </th>
                  <th scope="colgroup" colspan={header.length} class="py-2 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white">
                    <span>{group.label}</span>
                  </th>
                </tr>
              {/if}
              {#each group.items as item, itemIndex (item.value)}
                <tr class="group hover:bg-gray-25 transition-colors duration-150 has-checked:bg-gray-50 dark:hover:bg-gray-800/25 dark:has-checked:bg-gray-800/50" aria-rowindex={groupIndex * group.items.length + itemIndex + 2}>
                  <td class="relative px-7 sm:w-12 sm:px-6">
                    <div class="absolute inset-y-0 left-0 hidden w-0.5 bg-primary-600 group-has-checked:block dark:bg-primary-500" aria-hidden="true"></div>

                    <div class="group absolute top-1/2 left-4 -mt-2 grid size-4 grid-cols-1">
                      <input
                        type="checkbox"
                        checked={values.includes(item.value)}
                        onchange={() => handleItemToggle(item.value)}
                        class={CHECKBOX_CLASSES}
                        aria-label={`Select ${item.values[0] || item.value}`}
                        aria-describedby={`item-description-${groupIndex}-${itemIndex}`}
                      />
                      <svg viewBox="0 0 14 14" fill="none" class={SVG_CLASSES} aria-hidden="true">
                        <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-checked:opacity-100" />
                        <path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-indeterminate:opacity-100" />
                      </svg>
                    </div>
                  </td>
                  {#each item.values as value, valueIndex (value)}
                    <td
                      class={valueIndex === 0
                        ? 'py-4 pr-3 text-sm font-medium whitespace-nowrap text-gray-900 group-has-checked:text-primary-600 dark:text-white dark:group-has-checked:text-primary-400'
                        : 'px-3 py-4 text-sm whitespace-nowrap text-gray-500 dark:text-gray-400'}
                      id={valueIndex === 0 ? `item-description-${groupIndex}-${itemIndex}` : undefined}
                    >
                      {value}
                    </td>
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

<script lang="ts">
  import type { JSONSaveData } from '$lib/json';
  import clsx from 'clsx';
  import itemData from '../../data/items.json';
  import { ContextMenu, DropdownMenu } from 'bits-ui';
  import ChevronDownIcon from '@iconify-svelte/heroicons/chevron-down-20-solid';

  type Props = {
    value: JSONSaveData;
    type: 'cargo' | 'tech';
  };

  let { value = $bindable(), type = 'cargo' }: Props = $props();

  let size = $derived(value.Width * value.Height);

  let inventoryID = crypto.randomUUID();

  function dragstartHandler(
    event: DragEvent & {
      currentTarget: EventTarget & HTMLDivElement;
    }
  ) {
    if (event.dataTransfer == null) return;
    event.dataTransfer.setData('data', event.currentTarget.getAttribute('data-data') ?? '');
    event.dataTransfer.setData('inventory', inventoryID);
  }

  function dragoverHandler(event: DragEvent) {
    event.preventDefault();
  }

  function dropHandler(
    event: DragEvent & {
      currentTarget: EventTarget & HTMLDivElement;
    }
  ) {
    event.preventDefault();
    if (event.dataTransfer == null) return;
    const inventory = event.dataTransfer.getData('inventory');
    if (inventory !== inventoryID) return;
    const data = JSON.parse(event.dataTransfer.getData('data'));

    // Remove item from its previous slot
    value.Slots = value.Slots.filter((slot: JSONSaveData) => !(slot.Index.X === data.Index.X && slot.Index.Y === data.Index.Y));
    value.Slots.push({
      ...data,
      Index: {
        X: event.currentTarget.dataset.x ? parseInt(event.currentTarget.dataset.x) : 0,
        Y: event.currentTarget.dataset.y ? parseInt(event.currentTarget.dataset.y) : 0
      }
    });
  }

  function refillAllSlots() {
    for (const slot of value.Slots) {
      if (slot.Amount >= 0) slot.Amount = slot.MaxAmount;
    }
  }

  function clearSlots() {
    value.Slots = [];
  }

  function enableAllSlots() {
    for (let y = 0; y < value.Height; y++) {
      for (let x = 0; x < value.Width; x++) {
        if (!value.ValidSlotIndices.some((slot: JSONSaveData) => slot.X === x && slot.Y === y)) {
          value.ValidSlotIndices.push({ X: x, Y: y });
        }
      }
    }
  }

  function superchargeAllSlots() {
    for (let y = 0; y < value.Height; y++) {
      for (let x = 0; x < value.Width; x++) {
        if (!value.SpecialSlots.some((slot: JSONSaveData) => slot.Index.X === x && slot.Index.Y === y && slot.Type.InventorySpecialSlotType === 'TechBonus')) {
          value.SpecialSlots.push({ Index: { X: x, Y: y }, Type: { InventorySpecialSlotType: 'TechBonus' } });
        }
      }
    }
  }
</script>

<div class="mt-10">
  <button type="button" class="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring inset-ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:inset-ring-white/5 dark:hover:bg-white/20"
    >Resize</button
  >
  <DropdownMenu.Root>
    <DropdownMenu.Trigger
      class="inline-flex cursor-pointer justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs inset-ring-1 inset-ring-gray-300 hover:bg-gray-50 dark:bg-white/10 dark:text-white dark:inset-ring-white/5 dark:hover:bg-white/20"
    >
      Quick Actions
      <ChevronDownIcon aria-hidden="true" class="-mr-1 size-5 text-gray-400" width="20" height="20" />
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content class="mt-2 w-56 rounded-md bg-white shadow-lg outline-1 outline-black/5 dark:bg-gray-800 dark:outline-white/10">
        <div class="py-1">
          <DropdownMenu.Item
            onclick={refillAllSlots}
            class="block cursor-pointer px-4 py-2 text-sm text-gray-700 data-highlighted:bg-gray-100 data-highlighted:text-gray-900 data-highlighted:outline-hidden dark:text-gray-300 dark:data-highlighted:bg-white/5 dark:data-highlighted:text-white"
            >Refill All Slots</DropdownMenu.Item
          >

          <DropdownMenu.Item
            onclick={enableAllSlots}
            class="block cursor-pointer px-4 py-2 text-sm text-gray-700 data-highlighted:bg-gray-100 data-highlighted:text-gray-900 data-highlighted:outline-hidden dark:text-gray-300 dark:data-highlighted:bg-white/5 dark:data-highlighted:text-white"
            >Enable All Slots</DropdownMenu.Item
          >
          {#if type === 'tech'}
            <DropdownMenu.Item
              onclick={superchargeAllSlots}
              class="block cursor-pointer px-4 py-2 text-sm text-gray-700 data-highlighted:bg-gray-100 data-highlighted:text-gray-900 data-highlighted:outline-hidden dark:text-gray-300 dark:data-highlighted:bg-white/5 dark:data-highlighted:text-white"
              >Turbocharge All Slots</DropdownMenu.Item
            >
          {/if}
          <DropdownMenu.Item
            onclick={clearSlots}
            class="block cursor-pointer px-4 py-2 text-sm text-gray-700 data-highlighted:bg-gray-100 data-highlighted:text-gray-900 data-highlighted:outline-hidden dark:text-gray-300 dark:data-highlighted:bg-white/5 dark:data-highlighted:text-white"
            >Clear</DropdownMenu.Item
          >
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
</div>

<div id={inventoryID} class="relative mt-4 grid w-full gap-px bg-gray-200 p-px dark:bg-white/10" style={`grid-template-columns: repeat(${value.Width}, minmax(0, 1fr)); grid-template-rows: repeat(${value.Height}, minmax(0, 1fr));`}>
  {#each Array.from({ length: size }, (_, i) => i) as index (index)}
    {@const item = value.Slots.find((slot: JSONSaveData) => slot.Index.X + slot.Index.Y * value.Width === index)}
    {@const isSlotEnabled = value.ValidSlotIndices.some((slot: JSONSaveData) => slot.X + slot.Y * value.Width === index)}
    {@const isSlotSpecial = value.SpecialSlots.some((slot: JSONSaveData) => slot.Index.X + slot.Index.Y * value.Width === index && slot.Type.InventorySpecialSlotType === 'TechBonus')}
    <ContextMenu.Root>
      <ContextMenu.Trigger
        data-x={index % value.Width}
        data-y={Math.floor(index / value.Width)}
        ondragover={dragoverHandler}
        ondrop={item ? null : dropHandler}
        class={clsx('group relative aspect-video w-full overflow-hidden', isSlotEnabled ? 'bg-white dark:bg-gray-900' : 'bg-gray-100 dark:bg-gray-900/50', isSlotSpecial ? 'inset-ring-4 inset-ring-yellow-100' : '')}
      >
        {#if item}
          {@const itemMeta = itemData[item.Id.replaceAll('^', '').split('#')[0]] ?? { texture: '', name: item.Id }}
          <div class="isolate flex size-full cursor-grab flex-col items-center justify-end px-1 pb-0.5" draggable="true" data-data={JSON.stringify(item)} ondragstart={dragstartHandler} role="cell" tabindex="-1">
            <img class="pointer-events-none absolute inset-0 -z-10 h-2/3 w-full object-contain p-2 select-none" src={itemMeta.texture} alt="" />
            <p class="pointer-events-none truncate text-xs font-medium text-gray-900 select-none group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">{itemMeta.name}</p>
            {#if item.Amount >= 0}
              <p class="pointer-events-none text-xs text-gray-500 select-none group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-400">{item.Amount}/{item.MaxAmount}</p>
            {/if}
          </div>
        {/if}
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content class="mt-2 w-56 rounded-md bg-white shadow-lg outline-1 outline-black/5 dark:bg-gray-800 dark:outline-white/10">
          <div class="py-1">
            {#if item}
              <ContextMenu.Item
                onclick={() => (value.Slots = value.Slots.filter((slot: JSONSaveData) => !(slot.Index.X === item.Index.X && slot.Index.Y === item.Index.Y)))}
                class="block cursor-pointer px-4 py-2 text-sm text-gray-700 data-highlighted:bg-gray-100 data-highlighted:text-gray-900 data-highlighted:outline-hidden dark:text-gray-300 dark:data-highlighted:bg-white/5 dark:data-highlighted:text-white"
                >Remove Item</ContextMenu.Item
              >
              {#if item.Amount >= 0 && item.Amount < item.MaxAmount}
                <ContextMenu.Item
                  onclick={() => (item.Amount >= 0 ? (item.Amount = item.MaxAmount) : null)}
                  class="block cursor-pointer px-4 py-2 text-sm text-gray-700 data-highlighted:bg-gray-100 data-highlighted:text-gray-900 data-highlighted:outline-hidden dark:text-gray-300 dark:data-highlighted:bg-white/5 dark:data-highlighted:text-white"
                  >Refill Slot</ContextMenu.Item
                >
              {/if}
            {/if}
            {#if isSlotEnabled}
              <ContextMenu.Item
                onclick={() => (value.ValidSlotIndices = value.ValidSlotIndices.filter((slot: JSONSaveData) => !(slot.X === index % value.Width && slot.Y === Math.floor(index / value.Width))))}
                class="block cursor-pointer px-4 py-2 text-sm text-gray-700 data-highlighted:bg-gray-100 data-highlighted:text-gray-900 data-highlighted:outline-hidden dark:text-gray-300 dark:data-highlighted:bg-white/5 dark:data-highlighted:text-white"
                >Disable Slot</ContextMenu.Item
              >
            {:else}
              <ContextMenu.Item
                onclick={() => value.ValidSlotIndices.push({ X: index % value.Width, Y: Math.floor(index / value.Width) })}
                class="block cursor-pointer px-4 py-2 text-sm text-gray-700 data-highlighted:bg-gray-100 data-highlighted:text-gray-900 data-highlighted:outline-hidden dark:text-gray-300 dark:data-highlighted:bg-white/5 dark:data-highlighted:text-white"
                >Enable Slot</ContextMenu.Item
              >
            {/if}
            {#if type === 'tech'}
              {#if isSlotSpecial}
                <ContextMenu.Item
                  onclick={() => (value.SpecialSlots = value.SpecialSlots.filter((slot: JSONSaveData) => !(slot.Index.X === index % value.Width && slot.Index.Y === Math.floor(index / value.Width) && slot.Type.InventorySpecialSlotType === 'TechBonus')))}
                  class="block cursor-pointer px-4 py-2 text-sm text-gray-700 data-highlighted:bg-gray-100 data-highlighted:text-gray-900 data-highlighted:outline-hidden dark:text-gray-300 dark:data-highlighted:bg-white/5 dark:data-highlighted:text-white"
                  >Unturbocharge Slot</ContextMenu.Item
                >
              {:else}
                <ContextMenu.Item
                  onclick={() => value.SpecialSlots.push({ Index: { X: index % value.Width, Y: Math.floor(index / value.Width) }, Type: { InventorySpecialSlotType: 'TechBonus' } })}
                  class="block cursor-pointer px-4 py-2 text-sm text-gray-700 data-highlighted:bg-gray-100 data-highlighted:text-gray-900 data-highlighted:outline-hidden dark:text-gray-300 dark:data-highlighted:bg-white/5 dark:data-highlighted:text-white"
                  >Turbocharge Slot</ContextMenu.Item
                >
              {/if}
            {/if}
          </div>
        </ContextMenu.Content>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  {/each}
</div>

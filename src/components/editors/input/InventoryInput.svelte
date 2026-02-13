<script lang="ts">
  import type { JSONSaveData } from '$lib/json';
  import clsx from 'clsx';
  import itemData from '../../../data/items.json';
  import ChevrotDownIcon from '@iconify-svelte/heroicons/chevron-down-16-solid';
  import Button from '../../ui/button/Button.svelte';
  import ArrowsPointingOutIcon from '@iconify-svelte/heroicons/arrows-pointing-out-16-solid';
  import PencilIcon from '@iconify-svelte/heroicons/pencil-16-solid';
  import Dropdown from '../../ui/dropdown/Dropdown.svelte';
  import DropdownButton from '../../ui/dropdown/DropdownButton.svelte';
  import DropdownMenu from '../../ui/dropdown/DropdownMenu.svelte';
  import DropdownItem from '../../ui/dropdown/DropdownItem.svelte';
  import { ContextMenu } from 'bits-ui';
  import ContextmenuContent from '../../ui/contextmenu/ContextmenuContent.svelte';
  import ContextmenuItem from '../../ui/contextmenu/ContextmenuItem.svelte';
  import Dialog from '../../ui/dialog/Dialog.svelte';
  import DialogTitle from '../../ui/dialog/DialogTitle.svelte';
  import DialogDescription from '../../ui/dialog/DialogDescription.svelte';
  import DialogBody from '../../ui/dialog/DialogBody.svelte';
  import DialogActions from '../../ui/dialog/DialogActions.svelte';
  import Field from '../../ui/fieldset/Field.svelte';
  import Label from '../../ui/fieldset/Label.svelte';
  import FieldGroup from '../../ui/fieldset/FieldGroup.svelte';
  import SimpleNumberInput from './SimpleNumberInput.svelte';
  import toast, { toast_store } from '$lib/toast/index.svelte';
  import { m } from '$lib/paraglide/messages';

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

  let isResizeDialogOpen = $state(false);
  let resizeDialogWidth = $state(value.Width);
  let resizeDialogHeight = $state(value.Height);

  function resize(width: number, height: number) {
    // Check if even possible (Elements being outside the cropped area)
    for (const item of value.Slots) {
      if (item.Index.X >= width || item.Index.Y >= height) {
        toast.error(m.component_inventoryinput_error_resize_outofbounds_title(), m.component_inventoryinput_error_resize_outofbounds_descriptions());
        return;
      }
    }

    value.Width = width;
    value.Height = height;
  }

  let isAddItemDialogOpen = $state(false);
  let addItemDialogX = 0;
  let addItemDialogY = 0;
</script>

<Dialog bind:open={isAddItemDialogOpen}>
  <DialogTitle>{m.component_inventoryinput_dialog_add_title()}</DialogTitle>
  <DialogDescription>{m.component_inventoryinput_dialog_add_description()}</DialogDescription>
  <DialogBody>
    <FieldGroup></FieldGroup>
  </DialogBody>
  <DialogActions>
    <Button plain onclick={() => (isAddItemDialogOpen = false)}>{m.component_inventoryinput_dialog_add_cancel()}</Button>
    <Button
      onclick={() => {
        isAddItemDialogOpen = false;
      }}>{m.component_inventoryinput_dialog_add_apply()}</Button
    >
  </DialogActions>
</Dialog>

<Dialog bind:open={isResizeDialogOpen}>
  <DialogTitle>{m.component_inventoryinput_dialog_resize_title()}</DialogTitle>
  <DialogDescription>{m.component_inventoryinput_dialog_resize_description()}</DialogDescription>
  <DialogBody>
    <FieldGroup>
      <Field>
        <Label>{m.component_inventoryinput_dialog_resize_width()}</Label>
        <SimpleNumberInput placeholder="10" min={1} max={10} bind:value={resizeDialogWidth} />
      </Field>
      <Field>
        <Label>{m.component_inventoryinput_dialog_resize_height()}</Label>
        <SimpleNumberInput placeholder="10" min={1} max={12} bind:value={resizeDialogHeight} />
      </Field>
    </FieldGroup>
  </DialogBody>
  <DialogActions>
    <Button plain onclick={() => (isResizeDialogOpen = false)}>{m.component_inventoryinput_dialog_resize_cancel()}</Button>
    <Button
      onclick={() => {
        isResizeDialogOpen = false;
        resize(resizeDialogWidth, resizeDialogHeight);
      }}>{m.component_inventoryinput_dialog_resize_apply()}</Button
    >
  </DialogActions>
</Dialog>

<Button class="mt-4" onclick={() => (isResizeDialogOpen = true)}>
  <ArrowsPointingOutIcon aria-hidden="true" data-slot="icon" width="16" height="16" />
  {m.component_inventoryinput_button_resize()}
</Button>
<Dropdown>
  <DropdownButton>
    <PencilIcon aria-hidden="true" data-slot="icon" width="16" height="16" />
    {m.component_inventoryinput_button_qa()}
    <ChevrotDownIcon aria-hidden="true" data-slot="icon" width="16" height="16" />
  </DropdownButton>
  <DropdownMenu>
    <DropdownItem onclick={refillAllSlots}>{m.component_inventoryinput_button_qa_refill()}</DropdownItem>
    <DropdownItem onclick={enableAllSlots}>{m.component_inventoryinput_button_qa_enable()}</DropdownItem>
    {#if type === 'tech'}
      <DropdownItem onclick={superchargeAllSlots}>{m.component_inventoryinput_button_qa_turbocharge()}</DropdownItem>
    {/if}
    <DropdownItem onclick={clearSlots}>{m.component_inventoryinput_button_qa_clear()}</DropdownItem>
  </DropdownMenu>
</Dropdown>

<div
  id={inventoryID}
  class="relative mt-4 grid w-full gap-0.5 overflow-hidden rounded-md border-2 border-transparent bg-zinc-950/10 dark:bg-white/10"
  style={`grid-template-columns: repeat(${value.Width}, minmax(0, 1fr)); grid-template-rows: repeat(${value.Height}, minmax(0, 1fr));`}
>
  {#each Array.from({ length: size }, (_, i) => i) as index}
    {@const item = value.Slots.find((slot: JSONSaveData) => slot.Index.X + slot.Index.Y * value.Width === index)}
    {@const isSlotEnabled = value.ValidSlotIndices.some((slot: JSONSaveData) => slot.X + slot.Y * value.Width === index)}
    {@const isSlotSpecial = value.SpecialSlots.some((slot: JSONSaveData) => slot.Index.X + slot.Index.Y * value.Width === index && slot.Type.InventorySpecialSlotType === 'TechBonus')}
    <ContextMenu.Root>
      <ContextMenu.Trigger
        data-x={index % value.Width}
        data-y={Math.floor(index / value.Width)}
        ondragover={dragoverHandler}
        ondrop={item ? null : dropHandler}
        class={clsx('group relative aspect-video w-full overflow-hidden rounded-xs', isSlotEnabled ? 'bg-white dark:bg-gray-900' : 'bg-gray-100 dark:bg-gray-900/50', isSlotSpecial && 'inset-ring-4 inset-ring-yellow-200/60 dark:inset-ring-yellow-200/40')}
      >
        {#if item}
          {@const itemMeta = (itemData as never as Record<string, { texture: string; name: string }>)[item.Id.replaceAll('^', '').split('#')[0]] ?? { texture: '', name: item.Id }}
          <div class="isolate flex size-full cursor-grab flex-col items-center justify-end px-1 pb-0.5" draggable="true" data-data={JSON.stringify(item)} ondragstart={dragstartHandler} role="cell" tabindex="-1">
            <img class="pointer-events-none absolute inset-0 -z-10 h-2/3 w-full object-contain p-2 select-none" src={itemMeta.texture} alt="" decoding="async" loading="lazy" />
            <p class="pointer-events-none truncate text-xs font-medium text-gray-900 select-none group-hover:text-primary-600 dark:text-white dark:group-hover:text-primary-400">{itemMeta.name}</p>
            {#if item.Amount >= 0}
              <p class="pointer-events-none text-xs text-gray-500 select-none group-hover:text-primary-600 dark:text-gray-400 dark:group-hover:text-primary-400">{item.Amount}/{item.MaxAmount}</p>
            {/if}
          </div>
        {/if}
      </ContextMenu.Trigger>
      <ContextmenuContent>
        {#if item}
          <ContextmenuItem onclick={() => (value.Slots = value.Slots.filter((slot: JSONSaveData) => !(slot.Index.X === item.Index.X && slot.Index.Y === item.Index.Y)))}>{m.component_inventoryinput_button_context_remove()}</ContextmenuItem>
          {#if item.Amount >= 0 && item.Amount < item.MaxAmount}
            <ContextmenuItem onclick={() => (item.Amount >= 0 ? (item.Amount = item.MaxAmount) : null)}>{m.component_inventoryinput_button_context_refill()}</ContextmenuItem>
          {/if}
        {:else}
          <ContextmenuItem
            onclick={() => {
              isAddItemDialogOpen = true;
              addItemDialogX = index % value.Width;
              addItemDialogY = Math.floor(index / value.Width);
            }}>{m.component_inventoryinput_button_context_add()}</ContextmenuItem
          >
        {/if}
        {#if isSlotEnabled}
          <ContextmenuItem onclick={() => (value.ValidSlotIndices = value.ValidSlotIndices.filter((slot: JSONSaveData) => !(slot.X === index % value.Width && slot.Y === Math.floor(index / value.Width))))}
            >{m.component_inventoryinput_button_context_disable()}</ContextmenuItem
          >
        {:else}
          <ContextmenuItem onclick={() => value.ValidSlotIndices.push({ X: index % value.Width, Y: Math.floor(index / value.Width) })}>{m.component_inventoryinput_button_context_enable()}</ContextmenuItem>
        {/if}
        {#if type === 'tech'}
          {#if isSlotSpecial}
            <ContextmenuItem
              onclick={() => (value.SpecialSlots = value.SpecialSlots.filter((slot: JSONSaveData) => !(slot.Index.X === index % value.Width && slot.Index.Y === Math.floor(index / value.Width) && slot.Type.InventorySpecialSlotType === 'TechBonus')))}
              >{m.component_inventoryinput_button_context_unturbocharge()}</ContextmenuItem
            >
          {:else}
            <ContextmenuItem onclick={() => value.SpecialSlots.push({ Index: { X: index % value.Width, Y: Math.floor(index / value.Width) }, Type: { InventorySpecialSlotType: 'TechBonus' } })}
              >{m.component_inventoryinput_button_context_turbocharge()}</ContextmenuItem
            >
          {/if}
        {/if}
      </ContextmenuContent>
    </ContextMenu.Root>
  {/each}
</div>

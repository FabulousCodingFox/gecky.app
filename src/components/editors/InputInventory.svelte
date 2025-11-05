<script lang="ts">
  import type { JSONSaveData } from '$lib/json';
  import clsx from 'clsx';
  import itemData from '../../data/items.json';

  type Props = {
    value: JSONSaveData;
  };

  let { value = $bindable() }: Props = $props();

  let size = $derived(value.Width * value.Height);
</script>

<div class="grid w-full grid-cols-3 grid-rows-2 gap-px" style={`grid-template-columns: repeat(${value.Width}, minmax(0, 1fr)); grid-template-rows: repeat(${value.Height}, minmax(0, 1fr));`}>
  {#each Array.from({ length: size }, (_, i) => i) as index}
    {@const item = (value.Slots as { Index: { X: number; Y: number }; Id: string }[]).find((slot) => slot.Index.X + slot.Index.Y * value.Width === index)}
    {@const isSlotEnabled = (value.ValidSlotIndices as { X: number; Y: number }[]).some((slot) => slot.X + slot.Y * value.Width === index)}
    {@const isSlotSpecial = (value.SpecialSlots as { Index: { X: number; Y: number } }[]).some((slot) => slot.Index.X + slot.Index.Y * value.Width === index)}
    <div class={clsx('group relative flex aspect-square flex-col items-center justify-center gap-2 overflow-hidden px-3 py-2 text-gray-500', isSlotEnabled ? 'bg-white' : 'bg-gray-300', isSlotSpecial ? 'inset-ring-4 inset-ring-yellow-100' : '')}>
      {#if item}
        {@const itemMeta = itemData[item.Id.replaceAll('^', '').split('#')[0]] ?? { texture: '', name: item.Id }}
        <img class="aspect-square w-1/2" src={itemMeta.texture} alt="" />
        <p class="text-xs">{itemMeta.name}</p>
        <p class="text-xs">{item.Amount}/{item.MaxAmount}</p>
      {/if}
    </div>
  {/each}
</div>

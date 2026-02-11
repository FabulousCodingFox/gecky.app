<script lang="ts">
  import InputInventory from '../../../components/editors/InputInventory.svelte';
  import InputNumber from '../../../components/editors/InputNumber.svelte';
  import { initContext } from '../shared.svelte';

  let editorData = initContext();
</script>

<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
  <div class="space-y-12">
    <div class="border-b border-gray-900/10 pb-12 dark:border-white/10">
      <h2 class="text-base/7 font-semibold text-gray-900 dark:text-white">Stats</h2>
      <p class="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">Modify the exosuit's core stats.</p>
      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <InputNumber bind:value={editorData.data.BaseContext.PlayerStateData.Health} label="Health" min={0} />
        <InputNumber bind:value={editorData.data.BaseContext.PlayerStateData.Shield} label="Shield" min={0} />
        <InputNumber bind:value={editorData.data.BaseContext.PlayerStateData.Energy} label="Energy" min={0} />
      </div>
    </div>
    <div class="border-b border-gray-900/10 pb-12 dark:border-white/10">
      <h2 class="text-base/7 font-semibold text-gray-900 dark:text-white">Currencies</h2>
      <p class="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">Modify the amounts of various in-game currencies.</p>
      <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
        <InputNumber bind:value={editorData.data.BaseContext.PlayerStateData.Units} label="Units" min={-1} />
        <InputNumber bind:value={editorData.data.BaseContext.PlayerStateData.Nanites} label="Nanites" min={0} />
        <InputNumber bind:value={editorData.data.BaseContext.PlayerStateData.Specials} label="Quicksilver" min={0} />
      </div>
    </div>
    <div class="border-b border-gray-900/10 pb-12 dark:border-white/10">
      <h2 class="text-base/7 font-semibold text-gray-900 dark:text-white">Inventory</h2>
      <p class="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">Modify the exosuit's inventory items.</p>
      <div class="mt-10">
        <InputInventory bind:value={editorData.data.BaseContext.PlayerStateData.Inventory} type="cargo" />
      </div>
    </div>
    <div class="border-b border-gray-900/10 pb-12 dark:border-white/10">
      <h2 class="text-base/7 font-semibold text-gray-900 dark:text-white">Inventory_TechOnly</h2>
      <p class="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">Modify the exosuit's inventory items.</p>
      <div class="mt-10">
        <InputInventory bind:value={editorData.data.BaseContext.PlayerStateData.Inventory_TechOnly} type="tech" />
      </div>
    </div>
  </div>
</div>

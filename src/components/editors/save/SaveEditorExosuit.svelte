<script lang="ts">
  import InputNumber from '../InputNumber.svelte';

  let { saveData = $bindable() }: { saveData: any } = $props();
</script>

<div class="space-y-12">
  <div class="border-b border-gray-900/10 pb-12 dark:border-white/10">
    <h2 class="text-base/7 font-semibold text-gray-900 dark:text-white">Currencies</h2>
    <p class="mt-1 text-sm/6 text-gray-600 dark:text-gray-400">Modify the amounts of various in-game currencies.</p>

    <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
      <InputNumber bind:value={saveData.BaseContext.PlayerStateData.Units} label="Units" min={-1} />
      <InputNumber bind:value={saveData.BaseContext.PlayerStateData.Nanites} label="Nanites" min={0} />
      <InputNumber bind:value={saveData.BaseContext.PlayerStateData.Specials} label="Quicksilver" min={0} />
    </div>
  </div>
</div>

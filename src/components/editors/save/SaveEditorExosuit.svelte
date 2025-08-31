<script lang="ts">
  import InputNumber from '../InputNumber.svelte';

  let { accountData = $bindable() }: { accountData: any } = $props();
</script>

<div class="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
  <InputNumber bind:value={accountData.BaseContext.PlayerStateData.Health} label="Health" min={0} max={100} />
  <InputNumber bind:value={accountData.BaseContext.PlayerStateData.Shield} label="Shield" min={0} max={100} />
  <InputNumber bind:value={accountData.BaseContext.PlayerStateData.Units} label="Units" min={-1} />
  <InputNumber bind:value={accountData.BaseContext.PlayerStateData.Nanites} label="Nanites" min={0} />
  <InputNumber bind:value={accountData.BaseContext.PlayerStateData.Specials} label="Quicksilver" min={0} />
</div>

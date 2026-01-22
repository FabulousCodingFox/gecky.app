<script lang="ts">
  import dataRewardsPlatform from '$lib/../data/rewards/platform.json';
  import { initContext, type RewardItem, type TableGroup } from '../shared.svelte';
  import AccountEditorTable from '../../../components/editors/account/AccountEditorTable.svelte';
  import { m } from '$lib/paraglide/messages';
  import AccountEditorTableHeader from '../../../components/editors/account/AccountEditorTableHeader.svelte';

  let editorData = initContext();

  const platformData = dataRewardsPlatform as RewardItem[];

  // Initialize from editor data
  let platformRewards = $state<string[]>(editorData.data.UserSettingsData.UnlockedPlatformRewards || []);

  const platformGroups = $derived<TableGroup[]>(
    Array.from(new Set(platformData.map((reward) => reward.platform)))
      .filter(Boolean)
      .map((platform) => ({
        label: platform!,
        items: platformData
          .filter((reward) => reward.platform === platform)
          .map((reward) => ({
            value: reward.id,
            values: [reward.name, reward.id, reward.platform || '']
          }))
      }))
  );

  // Sync changes back to editor data
  $effect(() => {
    editorData.data.UserSettingsData.UnlockedPlatformRewards = platformRewards;
  });
</script>

<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
  <AccountEditorTableHeader name={m.page_account_tab_platform().toString()} selected={platformRewards.length} total={platformData.length} />
  <AccountEditorTable header={[m.table_name(), m.table_id(), m.table_expedition()]} groups={platformGroups} bind:values={platformRewards} />
</div>

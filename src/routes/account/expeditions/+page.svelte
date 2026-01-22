<script lang="ts">
  import { initContext, type RewardItem, type TableGroup } from '../shared.svelte';
  import dataExpeditions from '$lib/../data/expeditions.json';
  import dataRewardsSeason from '$lib/../data/rewards/season.json';
  import AccountEditorTable from '../../../components/editors/account/AccountEditorTable.svelte';
  import { m } from '$lib/paraglide/messages';
  import AccountEditorTableHeader from '../../../components/editors/account/AccountEditorTableHeader.svelte';

  let editorData = initContext();

  const typedExpeditions = dataExpeditions as Record<string, string>;
  const seasonData = dataRewardsSeason as RewardItem[];

  const seasonGroups = $derived<TableGroup[]>(
    Object.keys(typedExpeditions)
      .reverse()
      .map((expeditionID) => ({
        label: `${expeditionID}: ${typedExpeditions[expeditionID]}`,
        items: seasonData
          .filter((reward) => reward.expedition === parseInt(expeditionID))
          .map((reward) => ({
            value: reward.id,
            values: [reward.name, reward.id, reward.expedition?.toString() || '']
          }))
      }))
      .filter((group) => group.items.length > 0)
  );

  // Initialize from editor data
  let seasonRewards = $state<string[]>(editorData.data.UserSettingsData.UnlockedSeasonRewards || []);

  // Sync changes back to editor data
  $effect(() => {
    editorData.data.UserSettingsData.UnlockedSeasonRewards = seasonRewards;
  });
</script>

<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
  <AccountEditorTableHeader name={m.page_account_tab_expeditions().toString()} selected={seasonRewards.length} total={seasonData.length} />
  <AccountEditorTable header={[m.table_name(), m.table_id(), m.table_expedition()]} groups={seasonGroups} bind:values={seasonRewards} />
</div>

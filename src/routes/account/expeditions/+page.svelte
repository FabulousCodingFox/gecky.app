<script lang="ts">
  import { initContext, type RewardItem, type TableGroup } from '../shared.svelte';
  import dataExpeditions from '$lib/../data/expeditions.json';
  import dataRewardsSeason from '$lib/../data/rewards/season.json';
  import TableEditor from '../../../components/editors/table/TableEditor.svelte';
  import { m } from '$lib/paraglide/messages';
  import TableEditorHeader from '../../../components/editors/table/TableEditorHeader.svelte';
  import PageLayout from '../../../components/ui/layout/PageLayout.svelte';

  let editorData = initContext();

  const typedExpeditions = dataExpeditions as Record<string, string>;
  const seasonData = dataRewardsSeason as RewardItem[];

  let seasonRewards = $state<string[]>([]);

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

  $effect(() => {
    seasonRewards = editorData.data.UserSettingsData.UnlockedSeasonRewards || [];
  });

  $effect(() => {
    editorData.data.UserSettingsData.UnlockedSeasonRewards = seasonRewards;
  });
</script>

<PageLayout>
  <TableEditorHeader name={m.page_account_tab_expeditions().toString()} selected={seasonRewards.length} total={seasonData.length} />
  <TableEditor header={[m.table_name(), m.table_id(), m.table_expedition()]} groups={seasonGroups} bind:values={seasonRewards} />
</PageLayout>

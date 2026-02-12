<script lang="ts">
  import dataRewardsTwitch from '$lib/../data/rewards/twitch.json';
  import { initContext, type RewardItem, type TableGroup } from '../shared.svelte';
  import TableEditor from '../../../components/editors/table/TableEditor.svelte';
  import { m } from '$lib/paraglide/messages';
  import TableEditorHeader from '../../../components/editors/table/TableEditorHeader.svelte';
  import PageLayout from '../../../components/ui/layout/PageLayout.svelte';

  let editorData = initContext();

  const twitchData = dataRewardsTwitch as RewardItem[];

  let twitchRewards = $state<string[]>([]);

  const twitchGroups = $derived<TableGroup[]>([
    {
      label: null,
      items: twitchData.map((reward) => ({
        value: reward.id,
        values: [reward.name, reward.id]
      }))
    }
  ]);

  $effect(() => {
    twitchRewards = editorData.data.UserSettingsData.UnlockedTwitchRewards || [];
  });

  $effect(() => {
    editorData.data.UserSettingsData.UnlockedTwitchRewards = twitchRewards;
  });
</script>

<PageLayout>
  <TableEditorHeader name={m.page_account_tab_twitch().toString()} selected={twitchRewards.length} total={twitchData.length} />
  <TableEditor header={[m.table_name(), m.table_id(), m.table_expedition()]} groups={twitchGroups} bind:values={twitchRewards} />
</PageLayout>

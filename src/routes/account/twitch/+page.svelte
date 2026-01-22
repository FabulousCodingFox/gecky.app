<script lang="ts">
  import dataRewardsTwitch from '$lib/../data/rewards/twitch.json';
  import { initContext, type RewardItem, type TableGroup } from '../shared.svelte';
  import AccountEditorTable from '../../../components/editors/account/AccountEditorTable.svelte';
  import { m } from '$lib/paraglide/messages';
  import AccountEditorTableHeader from '../../../components/editors/account/AccountEditorTableHeader.svelte';

  let editorData = initContext();

  const twitchData = dataRewardsTwitch as RewardItem[];

  // Initialize from editor data
  let twitchRewards = $state<string[]>(editorData.data.UserSettingsData.UnlockedTwitchRewards || []);

  const twitchGroups = $derived<TableGroup[]>([
    {
      label: null,
      items: twitchData.map((reward) => ({
        value: reward.id,
        values: [reward.name, reward.id]
      }))
    }
  ]);

  // Sync changes back to editor data
  $effect(() => {
    editorData.data.UserSettingsData.UnlockedTwitchRewards = twitchRewards;
  });
</script>

<div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
  <AccountEditorTableHeader name={m.page_account_tab_twitch().toString()} selected={twitchRewards.length} total={twitchData.length} />
  <AccountEditorTable header={[m.table_name(), m.table_id(), m.table_expedition()]} groups={twitchGroups} bind:values={twitchRewards} />
</div>

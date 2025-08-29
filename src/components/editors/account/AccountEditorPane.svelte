<script lang="ts">
  import { Tabs } from 'bits-ui';
  import AccountEditorPaneTable from './AccountEditorPaneTable.svelte';
  import dataRewardsSeason from '../../../data/rewards/season.json5';
  import dataRewardsTwitch from '../../../data/rewards/twitch.json5';
  import dataRewardsPlatform from '../../../data/rewards/platform.json5';
  import dataExpeditions from '$lib/../data/expeditions.json';
  import { m } from '$lib/paraglide/messages';

  let { accountData = $bindable() }: { accountData: any } = $props();

  let seasonRewards = $state([]);
  let twitchRewards = $state([]);
  let platformRewards = $state([]);

  // Initialize reward arrays when accountData is loaded
  $effect(() => {
    if (accountData && accountData.UserSettingsData) {
      seasonRewards = accountData.UserSettingsData.UnlockedSeasonRewards || [];
      twitchRewards = accountData.UserSettingsData.UnlockedTwitchRewards || [];
      platformRewards = accountData.UserSettingsData.UnlockedPlatformRewards || [];
    }
  });

  // Update accountData when reward arrays change
  $effect(() => {
    if (accountData && accountData.UserSettingsData) {
      accountData.UserSettingsData.UnlockedSeasonRewards = seasonRewards;
      accountData.UserSettingsData.UnlockedTwitchRewards = twitchRewards;
      accountData.UserSettingsData.UnlockedPlatformRewards = platformRewards;
    }
  });
</script>

<Tabs.Root value="season_rewards">
  <div class="mt-12 border-b border-white/10">
    <Tabs.List aria-label="Tabs" class="-mb-px flex">
      <!-- Current: "border-indigo-400 text-indigo-400", Default: "border-transparent text-gray-400 hover:border-white/20 hover:text-gray-300" -->
      <Tabs.Trigger
        value="season_rewards"
        class="w-1/3 border-b-2 border-transparent px-1 py-4 text-center text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-gray-300 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400"
        >{m.page_account_tab_season_rewards()}</Tabs.Trigger
      >
      <Tabs.Trigger
        value="twitch_rewards"
        class="w-1/3 border-b-2 border-transparent px-1 py-4 text-center text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-gray-300 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400"
        >{m.page_account_tab_twitch_rewards()}</Tabs.Trigger
      >
      <Tabs.Trigger
        value="platform_rewards"
        class="w-1/3 border-b-2 border-transparent px-1 py-4 text-center text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-gray-300 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400"
        >{m.page_account_tab_platform_rewards()}</Tabs.Trigger
      >
    </Tabs.List>
  </div>
  <Tabs.Content value="season_rewards">
    <AccountEditorPaneTable
      header={[m.page_account_table_name(), m.page_account_table_id(), m.page_account_table_expedition()]}
      groups={Object.keys(dataExpeditions)
        .reverse()
        .map((expeditionID) => ({
          label: expeditionID + ': ' + dataExpeditions[expeditionID],
          items: dataRewardsSeason.filter((reward) => reward.expedition === parseInt(expeditionID)).map((reward) => ({ value: reward.id, values: [reward.name, reward.id, reward.expedition] }))
        }))}
      bind:values={seasonRewards}
    />
  </Tabs.Content>
  <Tabs.Content value="twitch_rewards">
    <AccountEditorPaneTable
      header={[m.page_account_table_name(), m.page_account_table_id()]}
      groups={[
        ...Array.from(new Set(dataRewardsTwitch.map((reward) => reward.drop)))
          .sort((a, b) => b - a)
          .map((drop) => ({
            label: m.page_account_table_drop() + ` ${drop}`,
            items: dataRewardsTwitch.filter((reward) => reward.drop === drop).map((reward) => ({ value: reward.id, values: [reward.name, reward.id] }))
          }))
      ]}
      bind:values={twitchRewards}
    />
  </Tabs.Content>
  <Tabs.Content value="platform_rewards">
    <AccountEditorPaneTable
      header={[m.page_account_table_name(), m.page_account_table_id(), m.page_account_table_platform()]}
      groups={[
        ...Array.from(new Set(dataRewardsPlatform.map((reward) => reward.platform))).map((platform) => ({
          label: platform,
          items: dataRewardsPlatform.filter((reward) => reward.platform === platform).map((reward) => ({ value: reward.id, values: [reward.name, reward.id, reward.platform] }))
        }))
      ]}
      bind:values={platformRewards}
    />
  </Tabs.Content>
</Tabs.Root>

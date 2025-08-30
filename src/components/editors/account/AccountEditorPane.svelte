<script lang="ts">
  import { Tabs } from 'bits-ui';
  import AccountEditorPaneTable from './AccountEditorPaneTable.svelte';
  import dataRewardsSeason from '../../../data/rewards/season.json';
  import dataRewardsTwitch from '../../../data/rewards/twitch.json';
  import dataRewardsPlatform from '../../../data/rewards/platform.json';
  import dataExpeditions from '$lib/../data/expeditions.json';
  import { m } from '$lib/paraglide/messages';
  import AccountEditorJsonEditor from './AccountEditorJsonEditor.svelte';

  interface AccountData {
    UserSettingsData?: {
      UnlockedSeasonRewards?: string[];
      UnlockedTwitchRewards?: string[];
      UnlockedPlatformRewards?: string[];
    };
  }

  interface RewardItem {
    name: string;
    id: string;
    expedition?: number;
    drop?: number;
    platform?: string;
  }

  interface TableGroup {
    label: string;
    items: Array<{
      value: string;
      values: string[];
    }>;
  }

  let { accountData = $bindable() }: { accountData: AccountData } = $props();

  let seasonRewards = $state<string[]>([]);
  let twitchRewards = $state<string[]>([]);
  let platformRewards = $state<string[]>([]);
  let activeTab = $state('season_rewards');

  const typedExpeditions = dataExpeditions as Record<string, string>;
  const seasonData = dataRewardsSeason as RewardItem[];
  const twitchData = dataRewardsTwitch as RewardItem[];
  const platformData = dataRewardsPlatform as RewardItem[];

  // Computed values for better performance
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

  const twitchGroups = $derived<TableGroup[]>([
    {
      label: m.page_account_table_drop(),
      items: twitchData.map((reward) => ({
        value: reward.id,
        values: [reward.name, reward.id]
      }))
    }
  ]);

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

  // Initialize reward arrays when accountData is loaded
  $effect(() => {
    if (accountData?.UserSettingsData) {
      seasonRewards = accountData.UserSettingsData.UnlockedSeasonRewards || [];
      twitchRewards = accountData.UserSettingsData.UnlockedTwitchRewards || [];
      platformRewards = accountData.UserSettingsData.UnlockedPlatformRewards || [];
    }
  });

  // Update accountData when reward arrays change
  $effect(() => {
    if (accountData?.UserSettingsData) {
      accountData.UserSettingsData.UnlockedSeasonRewards = seasonRewards;
      accountData.UserSettingsData.UnlockedTwitchRewards = twitchRewards;
      accountData.UserSettingsData.UnlockedPlatformRewards = platformRewards;
    }
  });
</script>

{#snippet statusBar(name: string, selected: number, total: number)}
  <div class="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-800/50">
    <div class="flex items-center space-x-4">
      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
        {name}
      </span>
      <span class="text-xs text-gray-500 dark:text-gray-400">
        {selected} / {total}
      </span>
    </div>
    <div class="flex items-center space-x-2">
      <div class="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
        <div class="h-2 rounded-full bg-indigo-600 transition-all duration-300 ease-in-out" style="width: {total > 0 ? (selected / total) * 100 : 0}%" aria-hidden="true"></div>
      </div>
      <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
        {total > 0 ? Math.round((selected / total) * 100) : 0}%
      </span>
    </div>
  </div>
{/snippet}

<Tabs.Root bind:value={activeTab}>
  <div class="mt-12 border-b border-white/10">
    <Tabs.List class="-mb-px flex">
      <Tabs.Trigger
        value="season_rewards"
        class="w-1/4 border-b-2 border-transparent px-1 py-4 text-center text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-gray-300 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400"
        >{m.page_account_tab_season_rewards()}</Tabs.Trigger
      >
      <Tabs.Trigger
        value="twitch_rewards"
        class="w-1/4 border-b-2 border-transparent px-1 py-4 text-center text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-gray-300 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400"
        >{m.page_account_tab_twitch_rewards()}</Tabs.Trigger
      >
      <Tabs.Trigger
        value="platform_rewards"
        class="w-1/4 border-b-2 border-transparent px-1 py-4 text-center text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-gray-300 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400"
        >{m.page_account_tab_platform_rewards()}</Tabs.Trigger
      >
      <Tabs.Trigger
        value="json_editor"
        class="w-1/4 border-b-2 border-transparent px-1 py-4 text-center text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-gray-300 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400"
        >{m.page_account_tab_json_editor()}</Tabs.Trigger
      >
    </Tabs.List>
  </div>

  <Tabs.Content value="season_rewards" class="mt-6 space-y-6">
    {@render statusBar(m.page_account_tab_season_rewards().toString(), seasonRewards.length, seasonData.length)}
    <AccountEditorPaneTable header={[m.page_account_table_name(), m.page_account_table_id(), m.page_account_table_expedition()]} groups={seasonGroups} bind:values={seasonRewards} />
  </Tabs.Content>

  <Tabs.Content value="twitch_rewards" class="mt-6 space-y-6">
    {@render statusBar(m.page_account_tab_twitch_rewards().toString(), twitchRewards.length, twitchData.length)}
    <AccountEditorPaneTable header={[m.page_account_table_name(), m.page_account_table_id()]} groups={twitchGroups} bind:values={twitchRewards} />
  </Tabs.Content>

  <Tabs.Content value="platform_rewards" class="mt-6 space-y-6">
    {@render statusBar(m.page_account_tab_platform_rewards().toString(), platformRewards.length, platformData.length)}
    <AccountEditorPaneTable header={[m.page_account_table_name(), m.page_account_table_id(), m.page_account_table_platform()]} groups={platformGroups} bind:values={platformRewards} />
  </Tabs.Content>

  <Tabs.Content value="json_editor" class="mt-6 space-y-6">
    <AccountEditorJsonEditor bind:accountData />
  </Tabs.Content>
</Tabs.Root>

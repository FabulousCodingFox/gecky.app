<script lang="ts">
  import { Tabs } from 'bits-ui';
  import AccountEditorPaneTable from './AccountEditorPaneTable.svelte';
  import dataRewardsSeason from '$lib/../data/rewards/season.json';

  let { accountData }: { accountData: any } = $props();
</script>

<Tabs.Root value="season_rewards">
  <div class="border-b border-white/10">
    <Tabs.List aria-label="Tabs" class="-mb-px flex">
      <!-- Current: "border-indigo-400 text-indigo-400", Default: "border-transparent text-gray-400 hover:border-white/20 hover:text-gray-300" -->
      <Tabs.Trigger
        value="season_rewards"
        class="w-1/3 border-b-2 border-transparent px-1 py-4 text-center text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-gray-300 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400"
        >Season Rewards</Tabs.Trigger
      >
      <Tabs.Trigger
        value="twitch_rewards"
        class="w-1/3 border-b-2 border-transparent px-1 py-4 text-center text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-gray-300 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400"
        >Twitch Rewards</Tabs.Trigger
      >
      <Tabs.Trigger
        value="platform_rewards"
        class="w-1/3 border-b-2 border-transparent px-1 py-4 text-center text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700 data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-600 dark:text-gray-400 dark:hover:border-white/20 dark:hover:text-gray-300 dark:data-[state=active]:border-indigo-400 dark:data-[state=active]:text-indigo-400"
        >Platform Rewards</Tabs.Trigger
      >
    </Tabs.List>
  </div>
  <Tabs.Content value="season_rewards">
    <AccountEditorPaneTable header={['Name', 'ID', 'Expedition']} items={dataRewardsSeason.map((reward) => ({ value: reward.id, values: [reward.name, reward.id, reward.expedition] }))} />
  </Tabs.Content>
  <Tabs.Content value="twitch_rewards">
    <AccountEditorPaneTable header={['Name', 'ID']} items={[]} />
  </Tabs.Content>
  <Tabs.Content value="platform_rewards">
    <AccountEditorPaneTable header={['Name', 'ID']} items={[]} />
  </Tabs.Content>
</Tabs.Root>

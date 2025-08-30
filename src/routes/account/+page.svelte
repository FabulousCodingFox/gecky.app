<script lang="ts">
  import Nav from '../../components/Nav.svelte';
  import { m } from '$lib/paraglide/messages';
  import Sidebar from '../../components/Sidebar.svelte';
  import { CodeBracket, Gift, Home } from '@steeze-ui/heroicons';
  import UploadForm from '../../components/UploadForm.svelte';
  import { createMfAccountFile, decryptAccountFile, encryptAccountFile, validateAccountData } from '$lib/hellosave/account';
  import FileInfo from '../../components/FileInfo.svelte';
  import ExportButton from '../../components/ExportButton.svelte';
  import dataRewardsSeason from '$lib/../data/rewards/season.json';
  import dataRewardsTwitch from '$lib/../data/rewards/twitch.json';
  import dataRewardsPlatform from '$lib/../data/rewards/platform.json';
  import dataExpeditions from '$lib/../data/expeditions.json';
  import AccountEditorTable from '../../components/editors/account/AccountEditorTable.svelte';
  import AccountEditorJsonEditor from '../../components/editors/account/AccountEditorJsonEditor.svelte';
  import { zipSync } from 'fflate';

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

  type Tab = 'start';

  let tab: Tab = $state('start');

  let accountData: AccountData = $state(null!);
  let fileName: string = $state('');

  let sidebar: { name: string; tab: Tab; icon: any | null }[] = $derived(
    accountData
      ? [
          { name: m.page_account_tab_start(), tab: 'start', icon: Home },
          { name: m.page_account_tab_season_rewards(), tab: 'season_rewards', icon: Gift },
          { name: m.page_account_tab_twitch_rewards(), tab: 'twitch_rewards', icon: Gift },
          { name: m.page_account_tab_platform_rewards(), tab: 'platform_rewards', icon: Gift },
          { name: m.page_account_tab_json_editor(), tab: 'json_editor', icon: CodeBracket }
        ]
      : [{ name: m.page_account_tab_start(), tab: 'start', icon: Home }]
  );

  const typedExpeditions = dataExpeditions as Record<string, string>;
  const seasonData = dataRewardsSeason as RewardItem[];
  const twitchData = dataRewardsTwitch as RewardItem[];
  const platformData = dataRewardsPlatform as RewardItem[];

  let seasonRewards = $state<string[]>([]);
  let twitchRewards = $state<string[]>([]);
  let platformRewards = $state<string[]>([]);

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

  async function onUpload(file: ArrayBuffer, name: string): Promise<{ isValid: boolean; errorTitle?: string; errorMessage?: string }> {
    const decryptedData = decryptAccountFile(file);

    if (!validateAccountData(decryptedData)) {
      return { isValid: false };
    }

    fileName = name;
    accountData = decryptedData;

    return { isValid: true };
  }

  async function onExport(): Promise<void> {
    if (!accountData) return;

    const encryptedData = new Uint8Array(encryptAccountFile(accountData));
    const compressedData = await createMfAccountFile(encryptedData);

    const files: Record<string, Uint8Array> = {
      'accountdata.hg': encryptedData,
      'mf_accountdata.hg': compressedData
    };

    const zipped = zipSync(files, { level: 9 });

    const blob = new Blob([zipped as never], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `accountdata_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.zip`;
    downloadLink.style.display = 'none';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(url);
  }

  async function onReset(): Promise<void> {
    accountData = null!;
  }
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

<Nav activeTab="account" />

<Sidebar data={sidebar} bind:value={tab} />

{#if tab === 'start'}
  <header class="pl-72">
    <div aria-hidden="true" class="relative">
      <enhanced:img src="$lib/assets/wallpaper/nms_contemporary_10.jpg?enhanced" alt="" class="h-64 w-full object-cover" sizes="min(3840px, 100vw)" fetchpriority="high" />
      <div class="absolute inset-0 bg-linear-to-t from-gray-50 dark:from-gray-950"></div>
    </div>

    <div class="relative mx-auto -mt-12 max-w-7xl px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8">
      <div class="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">{m.page_account_title()}</h2>
        <p class="mt-4 text-gray-500 dark:text-gray-400">{m.page_account_description()}</p>
      </div>
    </div>
  </header>
{/if}

<main class="py-10 pl-72">
  <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    {#if tab === 'start'}
      {#if !accountData}
        <UploadForm mode="account" callback={onUpload} />
      {:else}
        <div class="space-y-6">
          <FileInfo {fileName} callback={onReset} />
          <ExportButton callback={onExport} />
        </div>
      {/if}
    {:else if tab === 'season_rewards'}
      {@render statusBar(m.page_account_tab_season_rewards().toString(), seasonRewards.length, seasonData.length)}
      <AccountEditorTable header={[m.page_account_table_name(), m.page_account_table_id(), m.page_account_table_expedition()]} groups={seasonGroups} bind:values={seasonRewards} />
    {:else if tab === 'twitch_rewards'}
      {@render statusBar(m.page_account_tab_twitch_rewards().toString(), twitchRewards.length, twitchData.length)}
      <AccountEditorTable header={[m.page_account_table_name(), m.page_account_table_id()]} groups={twitchGroups} bind:values={twitchRewards} />
    {:else if tab === 'platform_rewards'}
      {@render statusBar(m.page_account_tab_platform_rewards().toString(), platformRewards.length, platformData.length)}
      <AccountEditorTable header={[m.page_account_table_name(), m.page_account_table_id(), m.page_account_table_platform()]} groups={platformGroups} bind:values={platformRewards} />
    {:else if tab === 'json_editor'}
      <AccountEditorJsonEditor bind:accountData />
    {/if}
  </div>
</main>

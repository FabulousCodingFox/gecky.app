<script lang="ts">
  import { m } from '$lib/paraglide/messages';
  import Sidebar from '../../components/Sidebar.svelte';
  import HomeIcon from '@iconify-svelte/heroicons/home';
  import CodeBracketIcon from '@iconify-svelte/heroicons/code-bracket';
  import GiftIcon from '@iconify-svelte/heroicons/gift';
  import UploadForm from '../../components/UploadForm.svelte';
  import { decryptAccountFile, encryptAccountFile, validateAccountData } from '$lib/hellosave/account';
  import SaveButton from '../../components/SaveButton.svelte';
  import dataRewardsSeason from '$lib/../data/rewards/season.json';
  import dataRewardsTwitch from '$lib/../data/rewards/twitch.json';
  import dataRewardsPlatform from '$lib/../data/rewards/platform.json';
  import dataExpeditions from '$lib/../data/expeditions.json';
  import AccountEditorTable from '../../components/editors/account/AccountEditorTable.svelte';
  import AccountEditorJsonEditor from '../../components/editors/account/AccountEditorJsonEditor.svelte';
  import { zipSync } from 'fflate';
  import ResetButton from '../../components/ResetButton.svelte';
  import FileInfo from '../../components/FileInfo.svelte';

  interface AccountData {
    UserSettingsData?: {
      UnlockedSeasonRewards?: string[];
      UnlockedTwitchRewards?: string[];
      UnlockedPlatformRewards?: string[];
    };
  }

  type Tab = 'start' | 'season_rewards' | 'twitch_rewards' | 'platform_rewards' | 'json_editor';

  let tab: Tab = $state('start');

  let accountData: AccountData = $state(null!);
  let fileName: string = $state('');

  let sidebar: { name: string; tab: Tab; icon: any | null }[] = $derived(
    accountData
      ? [
          { name: m.page_account_tab_overview(), tab: 'start', icon: HomeIcon },
          { name: m.page_account_tab_expeditions(), tab: 'season_rewards', icon: GiftIcon },
          { name: m.page_account_tab_twitch(), tab: 'twitch_rewards', icon: GiftIcon },
          { name: m.page_account_tab_platform(), tab: 'platform_rewards', icon: GiftIcon },
          { name: m.page_account_tab_json(), tab: 'json_editor', icon: CodeBracketIcon }
        ]
      : [{ name: m.page_account_tab_overview(), tab: 'start', icon: HomeIcon }]
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
      label: null,
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

    const encryptedData = encryptAccountFile(accountData);

    const files: Record<string, Uint8Array> = {
      [fileName]: encryptedData.buffer
    };

    const zipped = zipSync(files, { level: 0 });

    const blob = new Blob([zipped as never], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${fileName}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.zip`;
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
        <div class="h-2 rounded-full bg-primary-600 transition-all duration-300 ease-in-out" style="width: {total > 0 ? (selected / total) * 100 : 0}%" aria-hidden="true"></div>
      </div>
      <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
        {total > 0 ? Math.round((selected / total) * 100) : 0}%
      </span>
    </div>
  </div>
{/snippet}

<Sidebar data={sidebar} bind:value={tab} />

<main class="size-full lg:pl-72">
  {#if tab === 'start'}
    <header>
      <div aria-hidden="true" class="relative">
        <enhanced:img src="$lib/assets/wallpaper/NMS_Contemporary_05.png?enhanced" alt="" class="h-64 w-full object-cover" sizes="min(3840px, 100vw)" fetchpriority="high" />
        <div class="absolute inset-0 bg-linear-to-t from-gray-50 dark:from-gray-950"></div>
      </div>

      <div class="relative mx-auto -mt-12 max-w-7xl px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8">
        <div class="mx-auto max-w-2xl text-center lg:max-w-4xl">
          <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">{m.page_account_title()}</h2>
          <p class="mt-4 text-gray-500 dark:text-gray-400">{m.page_account_description()}</p>
        </div>
      </div>
    </header>
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {#if !accountData}
        <UploadForm mode="account" callback={onUpload} />
      {:else}
        <div class="flex flex-col items-center space-y-6">
          <FileInfo {fileName} mode="account" bind:saveData={accountData} />
          <div class="inline-flex flex-row space-x-6">
            <SaveButton callback={onExport} />
            <ResetButton callback={onReset} />
          </div>
        </div>
      {/if}
    </div>
  {:else if tab === 'season_rewards'}
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {@render statusBar(m.page_account_tab_expeditions().toString(), seasonRewards.length, seasonData.length)}
      <AccountEditorTable header={[m.table_name(), m.table_id(), m.table_expedition()]} groups={seasonGroups} bind:values={seasonRewards} />
    </div>
  {:else if tab === 'twitch_rewards'}
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {@render statusBar(m.page_account_tab_twitch().toString(), twitchRewards.length, twitchData.length)}
      <AccountEditorTable header={[m.table_name(), m.table_id()]} groups={twitchGroups} bind:values={twitchRewards} />
    </div>
  {:else if tab === 'platform_rewards'}
    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {@render statusBar(m.page_account_tab_platform().toString(), platformRewards.length, platformData.length)}
      <AccountEditorTable header={[m.table_name(), m.table_id(), m.table_platform()]} groups={platformGroups} bind:values={platformRewards} />
    </div>
  {:else if tab === 'json_editor'}
    <AccountEditorJsonEditor bind:accountData />
  {/if}
</main>

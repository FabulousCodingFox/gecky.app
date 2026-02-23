<script lang="ts">
  import dataRewardsPlatform from '$lib/../data/rewards/platform.json';
  import { initContext, type RewardItem, type TableGroup } from '../shared.svelte';
  import TableEditor from '../../../components/editors/table/TableEditor.svelte';
  import { m } from '$lib/paraglide/messages';
  import TableEditorHeader from '../../../components/editors/table/TableEditorHeader.svelte';
  import PageLayout from '../../../components/ui/layout/PageLayout.svelte';

  let editorData = initContext();

  const platformData = dataRewardsPlatform as RewardItem[];

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

  if (!editorData.data.UserSettingsData.UnlockedPlatformRewards) editorData.data.UserSettingsData.UnlockedPlatformRewards = [];
</script>

<PageLayout>
  <TableEditorHeader name={m.page_account_tab_platform().toString()} selected={editorData.data.UserSettingsData.UnlockedPlatformRewards.length} total={platformData.length} />
  <TableEditor header={[m.table_name(), m.table_id(), m.table_expedition()]} groups={platformGroups} bind:values={editorData.data.UserSettingsData.UnlockedPlatformRewards} />
</PageLayout>

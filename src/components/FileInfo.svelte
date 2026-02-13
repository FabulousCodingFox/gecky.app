<script lang="ts">
  import { languages, type LocalSettingsStore } from '$lib';
  import type { JSONSaveData } from '$lib/json';
  import { m } from '$lib/paraglide/messages';
  import { getContext } from 'svelte';
  import DescriptionList from './ui/description-list/DescriptionList.svelte';
  import DescriptionDetails from './ui/description-list/DescriptionDetails.svelte';
  import DescriptionTerm from './ui/description-list/DescriptionTerm.svelte';

  let { fileName, mode, saveData = $bindable() }: { fileName: string; saveData: JSONSaveData; mode: 'save' | 'account' } = $props();

  function secondsToHHMM(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    return `${hh}:${mm}`;
  }

  let browserLocale = $derived(languages[(getContext('localSettings') as LocalSettingsStore).language].browser_locale);

  let data: { key: string; value: string }[] = $derived(
    mode === 'save'
      ? [
          {
            key: m.component_fileinfo_label_filename(),
            value: fileName
          },
          {
            key: m.component_fileinfo_label_savename(),
            value: saveData.CommonStateData.SaveName
          },
          {
            key: m.component_fileinfo_label_summary(),
            value: saveData.BaseContext.PlayerStateData.SaveSummary
          },
          {
            key: m.component_fileinfo_label_playtime(),
            value: secondsToHHMM(saveData.CommonStateData.TotalPlayTime)
          },
          {
            key: m.component_fileinfo_label_lastsaved(),
            value: new Date(saveData.BaseContext.PlayerStateData.TimeStamp * 1000).toLocaleString(browserLocale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
          },
          {
            key: m.component_fileinfo_label_difficulty(),
            value: saveData.BaseContext.PlayerStateData.DifficultyState.Preset.DifficultyPresetType
          }
        ]
      : [
          {
            key: m.component_fileinfo_label_filename(),
            value: fileName
          }
        ]
  );
</script>

<DescriptionList>
  {#each data as d (d.key)}
    <DescriptionTerm>{d.key}</DescriptionTerm>
    <DescriptionDetails class="text-ellipsis">{d.value}</DescriptionDetails>
  {/each}
</DescriptionList>

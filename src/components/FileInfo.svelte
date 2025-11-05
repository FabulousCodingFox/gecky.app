<script lang="ts">
  import { languages, type LocalSettingsStore } from '$lib';
  import { m } from '$lib/paraglide/messages';
  import { getContext } from 'svelte';

  let { fileName, mode, saveData = $bindable() }: { fileName: string; saveData: any; mode: 'save' | 'account' } = $props();

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

<div class="overflow-hidden rounded-lg bg-gray-800/50 inset-ring inset-ring-white/10">
  <div class="border-t border-white/5">
    <dl class="divide-y divide-white/5">
      {#each data as d}
        <div class="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
          <dt class="text-sm font-medium text-gray-100">{d.key}</dt>
          <dd class="mt-1 text-sm/6 text-gray-300 sm:col-span-2 sm:mt-0">{d.value}</dd>
        </div>
      {/each}
    </dl>
  </div>
</div>

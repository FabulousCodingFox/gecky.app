<script lang="ts">
  import { getContext } from 'svelte';
  import type { LocalSettingsStore } from '$lib';
  import type { JSONSaveData } from '$lib/json';
  import { JSONEditor, type Content, type OnChangeStatus } from 'svelte-jsoneditor';

  let { data = $bindable() }: { data: JSONSaveData } = $props();

  const localSettings = getContext('localSettings') as LocalSettingsStore;

  let content = $derived({
    text: undefined,
    json: data
  });

  function handleChange(updatedContent: Content, previousContent: Content, { contentErrors, patchResult }: OnChangeStatus) {
    console.log('onChange: ', { updatedContent, previousContent, contentErrors, patchResult });
    if (!updatedContent.json) return;
    data = updatedContent.json as JSONSaveData;
  }
</script>

<JSONEditor bind:content onChange={handleChange} />

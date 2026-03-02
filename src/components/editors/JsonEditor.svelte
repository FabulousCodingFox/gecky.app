<script lang="ts">
  import type { JSONSaveData } from '$lib/json';
  import { m } from '$lib/paraglide/messages';
  import Button from '../ui/button/Button.svelte';
  import ArrowDownCircleIcon from '@iconify-svelte/heroicons/arrow-down-circle-16-solid';
  import ArrowUpCircleIcon from '@iconify-svelte/heroicons/arrow-up-circle-16-solid';

  let { data = $bindable() }: { data: JSONSaveData } = $props();
</script>

<Button
  onclick={() => {
    const blob = new Blob([JSON.stringify(data) as never], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `data.json`;
    downloadLink.style.display = 'none';

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(url);
  }}
>
  <ArrowDownCircleIcon aria-hidden="true" data-slot="icon" width="16" height="16" />
  {m.component_jsoneditor_download()}
</Button>

<Button
  onclick={() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const text = await file.text();
      const parsed = JSON.parse(text);
      data = parsed;
    };
    input.click();
  }}
>
  <ArrowUpCircleIcon aria-hidden="true" data-slot="icon" width="16" height="16" />
  {m.component_jsoneditor_upload()}
</Button>

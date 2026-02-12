<script lang="ts">
  import { m } from '$lib/paraglide/messages';
  import FileChooser from '../../components/FileChooser.svelte';
  import SaveButton from '../../components/SaveButton.svelte';
  import { decryptSaveFile, encryptSaveFile, validateSaveData } from '$lib/hellosave/save';
  import { zipSync } from 'fflate';
  import ResetButton from '../../components/ResetButton.svelte';
  import FileInfo from '../../components/FileInfo.svelte';
  import { initContext } from './shared.svelte';
  import HeaderLayout from '../../components/ui/layout/HeaderLayout.svelte';

  let editorData = initContext();

  async function onUpload(file: ArrayBuffer, name: string): Promise<{ isValid: boolean; errorTitle?: string; errorMessage?: string }> {
    const decryptedData = decryptSaveFile(file);

    if (!validateSaveData(decryptedData)) {
      return { isValid: false };
    }

    editorData.fileName = name;
    editorData.data = decryptedData;

    return { isValid: true };
  }

  async function onExport(): Promise<void> {
    if (!editorData.data) return;

    const encryptedSaveFile = encryptSaveFile(editorData.data);

    const fileName = editorData.fileName || 'save.hg';

    const files: Record<string, Uint8Array> = {
      [fileName]: encryptedSaveFile.buffer
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
    editorData.data = null;
    editorData.fileName = null;
  }
</script>

<HeaderLayout description={m.page_save_description()} title={m.page_save_title()}>
  {#if !editorData.data || !editorData.fileName}
    <FileChooser mode="save" callback={onUpload} />
  {:else}
    <div class="flex flex-col items-center space-y-6">
      <FileInfo fileName={editorData.fileName} mode="save" bind:saveData={editorData.data} />
      <div class="inline-flex flex-row space-x-6">
        <SaveButton callback={onExport} />
        <ResetButton callback={onReset} />
      </div>
    </div>
  {/if}
</HeaderLayout>

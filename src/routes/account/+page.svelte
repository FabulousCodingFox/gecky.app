<script lang="ts">
  import { m } from '$lib/paraglide/messages';
  import FileChooser from '../../components/filechooser/FileChooser.svelte';
  import { decryptAccountFile, encryptAccountFile, validateAccountData } from '$lib/hellosave/account';
  import ExportButton from '../../components/ExportButton.svelte';
  import ResetButton from '../../components/ResetButton.svelte';
  import FileInfo from '../../components/FileInfo.svelte';
  import { initContext } from './shared.svelte';
  import HeaderLayout from '../../components/ui/layout/HeaderLayout.svelte';
  import SaveButton from '../../components/SaveButton.svelte';

  let editorData = initContext();

  async function onUpload(file: ArrayBuffer, name: string): Promise<{ isValid: boolean; errorTitle?: string; errorMessage?: string }> {
    const decryptedData = decryptAccountFile(file);

    if (!validateAccountData(decryptedData)) {
      return { isValid: false };
    }

    editorData.fileName = name;
    editorData.data = decryptedData;

    return { isValid: true };
  }

  async function onExport(): Promise<void> {
    if (!editorData.data) return;

    const encryptedData = encryptAccountFile(editorData.data);

    const fileName = editorData.fileName || 'accountdata.hg';

    const blob = new Blob([encryptedData.buffer as never], { type: 'application/txt' });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `${fileName}_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.hg`;
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

  async function onSave(): Promise<void> {
    if (!editorData.data) return;

    const encryptedData = encryptAccountFile(editorData.data);

    const writable = await editorData.fileHandle.createWritable();
    await writable.write(encryptedData.buffer as never);
    await writable.close();
  }
</script>

<HeaderLayout description={m.page_account_description()} title={m.page_account_title()} background="b">
  {#if !editorData.data}
    <FileChooser mode="account" callback={onUpload} />
  {:else}
    <div class="flex flex-col items-center space-y-6">
      <FileInfo fileName={editorData.fileName!} mode="account" bind:saveData={editorData.data} />
      <div class="inline-flex flex-row space-x-6">
        {#if editorData.fileHandle}
          <SaveButton callback={onSave} />
        {/if}
        <ExportButton callback={onExport} />
        <ResetButton callback={onReset} />
      </div>
    </div>
  {/if}
</HeaderLayout>

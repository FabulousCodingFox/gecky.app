<script lang="ts">
  import { m } from '$lib/paraglide/messages';
  import UploadForm from '../../components/UploadForm.svelte';
  import { decryptAccountFile, encryptAccountFile, validateAccountData } from '$lib/hellosave/account';
  import SaveButton from '../../components/SaveButton.svelte';
  import { zipSync } from 'fflate';
  import ResetButton from '../../components/ResetButton.svelte';
  import FileInfo from '../../components/FileInfo.svelte';
  import { initContext } from './shared.svelte';

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

    const fileName = editorData.fileName || 'account.hg';

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
    editorData.data = null;
    editorData.fileName = null;
  }
</script>

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
  {#if !editorData.data}
    <UploadForm mode="account" callback={onUpload} />
  {:else}
    <div class="flex flex-col items-center space-y-6">
      <FileInfo fileName={editorData.fileName!} mode="account" bind:saveData={editorData.data} />
      <div class="inline-flex flex-row space-x-6">
        <SaveButton callback={onExport} />
        <ResetButton callback={onReset} />
      </div>
    </div>
  {/if}
</div>

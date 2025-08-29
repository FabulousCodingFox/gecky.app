<script lang="ts">
  import { decryptAccountFile, encryptAccountFile } from '$lib/hellosave';
  import { m } from '$lib/paraglide/messages';
  import toast from '$lib/toast/index.svelte';
  import { DocumentArrowDown, DocumentArrowUp } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { onMount } from 'svelte';
  import AccountEditorPane from './AccountEditorPane.svelte';

  let buttonElement: HTMLButtonElement = $state(null!);
  let inputElement: HTMLInputElement = $state(null!);

  let draggedOver = $state(false);

  let state = $state(0);

  let accountData = $state({});

  function dropHandler(event: DragEvent & { dataTransfer: DataTransfer }) {
    draggedOver = false;
    event.preventDefault();

    if (event.dataTransfer.items.length > 1) {
      toast.error(m.page_account_error_uploadmultiplefiles_title(), m.page_account_error_uploadmultiplefiles_description());
      return;
    }

    onUpload(event.dataTransfer.items[0]?.getAsFile());
  }

  function clickHandler(
    event: Event & {
      currentTarget: EventTarget & HTMLInputElement;
    }
  ) {
    onUpload(event.currentTarget.files?.[0] || null);
    event.currentTarget.value = '';
  }

  async function onUpload(file: File | null) {
    if (!file || !file.name.endsWith('.hg')) {
      toast.error(m.page_account_error_invalidfile_title(), m.page_account_error_invalidfile_description());
      return;
    }

    toast.info(m.page_account_toast_loading_title(), m.page_account_toast_loading_description());

    try {
      const data = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = () => reject(reader.error);
        reader.readAsArrayBuffer(file);
      });

      accountData = decryptAccountFile(data as never);
    } catch (error) {
      toast.error(m.page_account_error_invalidfile_title(), m.page_account_error_invalidfile_description());
      console.error(error);
      return;
    }

    toast.success(m.page_account_toast_uploadsuccess_title(), m.page_account_toast_uploadsuccess_description());
    state = 1;
  }

  async function download() {
    let data = encryptAccountFile(accountData);
    let blob = new Blob([data], { type: 'application/octet-stream' });
    let url = URL.createObjectURL(blob);

    let a = document.createElement('a');
    a.href = url;
    a.download = 'accountdata.hg';
    a.click();
  }

  onMount(() => {
    buttonElement.addEventListener('drop', dropHandler as never);
    buttonElement.addEventListener('dragover', (e) => e.preventDefault());
    buttonElement.addEventListener('dragenter', () => (draggedOver = true));
    buttonElement.addEventListener('dragleave', () => (draggedOver = false));
  });
</script>

{#if state === 0}
  <div class="bg-white outline -outline-offset-1 outline-gray-200 sm:rounded-lg dark:bg-gray-800/50 dark:outline-white/10">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white">Account Data Location</h3>
      <div class="mt-2 max-w-xl text-sm text-gray-700 dark:text-gray-400">
        <p>The save files for <strong>No Man's Sky</strong> are stored in the following locations depending on your operating system:</p>
        <div class="mt-4 space-y-3 font-mono text-sm">
          <div>
            <span class="font-semibold text-gray-900 dark:text-white">Linux (Proton):</span>
            <pre class="break-words whitespace-pre-wrap text-gray-700 dark:text-gray-300">/home/&lt;username&gt;/.steam/steam/steamapps/compatdata/275850/pfx/drive_c/users/steamuser/AppData/Roaming/HelloGames/NMS/</pre>
          </div>
          <div>
            <span class="font-semibold text-gray-900 dark:text-white">Windows:</span>
            <pre class="break-words whitespace-pre-wrap text-gray-700 dark:text-gray-300">C:/users/&lt;username&gt;/AppData/Roaming/HelloGames/NMS/</pre>
          </div>
        </div>
        <div class="mt-4 text-sm text-gray-700 dark:text-gray-400">
          <p>
            Inside these folders, the actual save files are located within a subfolder. Look for the file named <code class="font-mono text-gray-900 dark:text-white">accountdata.hg</code>. This contains your account data.
          </p>
        </div>
      </div>
    </div>
  </div>

  <form>
    <button
      type="button"
      aria-label={m.page_account_draganddrop_title()}
      onclick={() => inputElement.click()}
      bind:this={buttonElement}
      class={'relative mt-16 block w-full cursor-pointer rounded-lg border-2 p-12 text-center hover:border-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 dark:hover:border-white/25 ' +
        (draggedOver ? 'border-solid border-blue-600 bg-blue-400/30' : 'border-dashed border-gray-300 dark:border-white/15')}
    >
      <Icon src={DocumentArrowUp} theme="outline" size="24px" class="mx-auto size-12 text-gray-500" />
      <span class="mt-2 block text-sm font-semibold text-gray-700 dark:text-white">{m.page_account_draganddrop_title()}</span>
    </button>

    <input id="file-upload" type="file" accept=".hg" class="hidden" bind:this={inputElement} onchange={clickHandler} />
  </form>
{:else}
  <button
    onclick={download}
    type="button"
    class="mx-auto flex items-center gap-x-2 rounded-md bg-indigo-500 px-3.5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
  >
    <Icon src={DocumentArrowDown} aria-hidden="true" class="-ml-0.5 size-5" />
    {m.page_account_export()}
  </button>

  <AccountEditorPane bind:accountData />
{/if}

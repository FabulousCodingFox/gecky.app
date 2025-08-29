<script lang="ts">
  import { decryptAccountFile, encryptAccountFile } from '$lib/hellosave';
  import { m } from '$lib/paraglide/messages';
  import toast from '$lib/toast/index.svelte';
  import { DocumentArrowDown, DocumentArrowUp, ArrowPath } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';
  import { onMount, onDestroy } from 'svelte';
  import AccountEditorPane from './AccountEditorPane.svelte';

  // UI state management
  type EditorState = 'initial' | 'loaded' | 'loading' | 'error';

  let buttonElement: HTMLButtonElement = $state(null!);
  let inputElement: HTMLInputElement = $state(null!);

  let draggedOver = $state(false);
  let editorState: EditorState = $state('initial');
  let isProcessing = $state(false);
  let loadedFileName = $state('');

  let accountData = $state(null!);

  // Constants
  const ACCEPTED_FILE_EXTENSION = '.hg';
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

  // Event listener cleanup functions
  let cleanupFunctions: (() => void)[] = [];

  function dropHandler(event: DragEvent & { dataTransfer: DataTransfer }) {
    draggedOver = false;
    event.preventDefault();

    if (event.dataTransfer.items.length > 1) {
      toast.error(m.page_account_error_uploadmultiplefiles_title(), m.page_account_error_uploadmultiplefiles_description());
      return;
    }

    const file = event.dataTransfer.items[0]?.getAsFile();
    handleFileUpload(file);
  }

  function clickHandler(event: Event & { currentTarget: EventTarget & HTMLInputElement }) {
    const file = event.currentTarget.files?.[0] || null;
    handleFileUpload(file);
    event.currentTarget.value = ''; // Reset input for consecutive uploads
  }

  function validateFile(file: File | null): { isValid: boolean; errorTitle?: string; errorDescription?: string } {
    if (!file) {
      return {
        isValid: false,
        errorTitle: m.page_account_error_nofile_title(),
        errorDescription: m.page_account_error_nofile_description()
      };
    }

    if (!file.name.endsWith(ACCEPTED_FILE_EXTENSION)) {
      return {
        isValid: false,
        errorTitle: m.page_account_error_filetype_title(),
        errorDescription: m.page_account_error_filetype_description()
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        errorTitle: m.page_account_error_filesize_title(),
        errorDescription: m.page_account_error_filesize_description({ maxSize: (MAX_FILE_SIZE / (1024 * 1024)).toString() })
      };
    }

    return { isValid: true };
  }

  async function handleFileUpload(file: File | null) {
    if (isProcessing) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      toast.error(validation.errorTitle!, validation.errorDescription!);
      return;
    }

    isProcessing = true;
    editorState = 'loading';
    loadedFileName = file!.name;

    toast.info(m.page_account_toast_loading_title(), m.page_account_toast_loading_description());

    try {
      const arrayBuffer = await readFileAsArrayBuffer(file!);
      const decryptedData = decryptAccountFile(arrayBuffer);

      // Validate the decrypted data structure
      if (!validateAccountData(decryptedData)) {
        throw new Error('Invalid account data structure');
      }

      accountData = decryptedData;
      editorState = 'loaded';

      toast.success(m.page_account_toast_uploadsuccess_title(), m.page_account_toast_uploadsuccess_description());
    } catch (error) {
      console.error('File processing error:', error);
      editorState = 'error';
      toast.error(m.page_account_error_corrupted_title(), m.page_account_error_corrupted_description());
    } finally {
      isProcessing = false;
    }
  }

  function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error(`Failed to read file: ${reader.error?.message}`));
      reader.readAsArrayBuffer(file);
    });
  }

  function validateAccountData(data: any): boolean {
    // Basic validation - extend as needed
    return data && typeof data === 'object' && data.UserSettingsData && typeof data.UserSettingsData === 'object';
  }

  async function downloadAccountData() {
    if (isProcessing || editorState !== 'loaded') return;

    try {
      isProcessing = true;

      const encryptedData = encryptAccountFile(accountData);
      const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
      const url = URL.createObjectURL(blob);

      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = generateDownloadFilename();
      downloadLink.style.display = 'none';

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Clean up the object URL
      URL.revokeObjectURL(url);

      toast.success(m.page_account_success_download_title(), m.page_account_success_download_description());
    } catch (error) {
      console.error('Download error:', error);
      toast.error(m.page_account_error_download_title(), m.page_account_error_download_description());
    } finally {
      isProcessing = false;
    }
  }

  function generateDownloadFilename(): string {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    return `accountdata_${timestamp}.hg`;
  }

  function resetEditor() {
    if (isProcessing) return;

    accountData = null!;
    editorState = 'initial';
    loadedFileName = '';

    if (inputElement) {
      inputElement.value = '';
    }

    toast.info(m.page_account_reset_title(), m.page_account_reset_description());
  }

  function setupDragAndDropListeners() {
    if (!buttonElement) return;

    const handleDrop = dropHandler as never;
    const handleDragOver = (e: Event) => e.preventDefault();
    const handleDragEnter = () => (draggedOver = true);
    const handleDragLeave = (e: DragEvent) => {
      // Only hide drag overlay if we're leaving the button element itself
      if (!buttonElement.contains(e.relatedTarget as Node)) {
        draggedOver = false;
      }
    };

    buttonElement.addEventListener('drop', handleDrop);
    buttonElement.addEventListener('dragover', handleDragOver);
    buttonElement.addEventListener('dragenter', handleDragEnter);
    buttonElement.addEventListener('dragleave', handleDragLeave);

    // Store cleanup functions
    cleanupFunctions.push(
      () => buttonElement?.removeEventListener('drop', handleDrop),
      () => buttonElement?.removeEventListener('dragover', handleDragOver),
      () => buttonElement?.removeEventListener('dragenter', handleDragEnter),
      () => buttonElement?.removeEventListener('dragleave', handleDragLeave)
    );
  }

  onMount(() => {
    setupDragAndDropListeners();
  });

  onDestroy(() => {
    // Clean up event listeners
    cleanupFunctions.forEach((cleanup) => cleanup());
    cleanupFunctions = [];
  });
</script>

{#if editorState === 'initial' || editorState === 'error'}
  <div class="bg-white outline -outline-offset-1 outline-gray-200 sm:rounded-lg dark:bg-gray-800/50 dark:outline-white/10">
    <div class="px-4 py-5 sm:p-6">
      <h3 class="text-base font-semibold text-gray-900 dark:text-white">{m.page_account_location_title()}</h3>
      <div class="mt-2 max-w-xl text-sm text-gray-700 dark:text-gray-400">
        <p>{m.page_account_location_description({ gameName: "No Man's Sky" })}</p>
        <div class="mt-4 space-y-3 font-mono text-sm">
          <div>
            <span class="font-semibold text-gray-900 dark:text-white">{m.page_account_location_linux()}</span>
            <pre class="break-words whitespace-pre-wrap text-gray-700 dark:text-gray-300">{m.page_account_location_linux_path()}</pre>
          </div>
          <div>
            <span class="font-semibold text-gray-900 dark:text-white">{m.page_account_location_windows()}</span>
            <pre class="break-words whitespace-pre-wrap text-gray-700 dark:text-gray-300">{m.page_account_location_windows_path()}</pre>
          </div>
        </div>
        <div class="mt-4 text-sm text-gray-700 dark:text-gray-400">
          <p>
            {m.page_account_location_instructions({ filename: 'accountdata.hg' })}
          </p>
        </div>
      </div>
    </div>
  </div>

  <form>
    <button
      type="button"
      aria-label={m.page_account_draganddrop_title()}
      disabled={isProcessing}
      onclick={() => inputElement.click()}
      bind:this={buttonElement}
      class={'relative mt-16 block w-full cursor-pointer rounded-lg border-2 p-12 text-center transition-all duration-200 focus:outline-2 focus:outline-offset-2 focus:outline-indigo-500 ' +
        (isProcessing
          ? 'cursor-not-allowed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
          : draggedOver
            ? 'border-solid border-blue-600 bg-blue-400/30 dark:border-blue-400 dark:bg-blue-400/20'
            : editorState === 'error'
              ? 'border-dashed border-red-300 hover:border-red-400 dark:border-red-600 dark:hover:border-red-500'
              : 'border-dashed border-gray-300 hover:border-gray-400 dark:border-white/15 dark:hover:border-white/25')}
    >
      {#if isProcessing}
        <Icon src={ArrowPath} theme="outline" size="24px" class="mx-auto size-12 animate-spin text-gray-400" />
        <span class="mt-2 block text-sm font-semibold text-gray-500 dark:text-gray-400">{m.page_account_processing()}</span>
      {:else if editorState === 'error'}
        <Icon src={DocumentArrowUp} theme="outline" size="24px" class="mx-auto size-12 text-red-500" />
        <span class="mt-2 block text-sm font-semibold text-red-600 dark:text-red-400">{m.page_account_upload_failed()}</span>
      {:else}
        <Icon src={DocumentArrowUp} theme="outline" size="24px" class="mx-auto size-12 text-gray-500" />
        <span class="mt-2 block text-sm font-semibold text-gray-700 dark:text-white">{m.page_account_draganddrop_title()}</span>
      {/if}
    </button>

    <input id="file-upload" type="file" accept={ACCEPTED_FILE_EXTENSION} disabled={isProcessing} class="hidden" bind:this={inputElement} onchange={clickHandler} />
  </form>
{:else if accountData}
  <!-- File loaded successfully - show controls and editor -->
  <div class="space-y-6">
    <!-- File info and controls -->
    <div class="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="flex-shrink-0">
            <Icon src={DocumentArrowUp} class="size-5 text-green-600 dark:text-green-400" />
          </div>
          <div class="min-w-0 flex-1">
            <p class="text-sm font-medium text-green-800 dark:text-green-200">
              {m.page_account_file_loaded({ filename: loadedFileName })}
            </p>
            <p class="text-sm text-green-600 dark:text-green-300">
              {m.page_account_ready_edit()}
            </p>
          </div>
        </div>
        <button type="button" onclick={resetEditor} disabled={isProcessing} class="text-sm font-medium text-green-700 hover:text-green-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-green-300 dark:hover:text-green-100">
          {m.page_account_load_different()}
        </button>
      </div>
    </div>

    <!-- Action buttons -->
    <div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
      <button
        onclick={downloadAccountData}
        disabled={isProcessing}
        type="button"
        class="flex items-center justify-center gap-x-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {#if isProcessing}
          <Icon src={ArrowPath} aria-hidden="true" class="-ml-0.5 size-5 animate-spin" />
          {m.page_account_processing_button()}
        {:else}
          <Icon src={DocumentArrowDown} aria-hidden="true" class="-ml-0.5 size-5" />
          {m.page_account_export()}
        {/if}
      </button>
    </div>

    <!-- Account editor pane -->
    <AccountEditorPane bind:accountData />
  </div>
{/if}

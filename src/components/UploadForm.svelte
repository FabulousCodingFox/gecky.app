<script lang="ts">
  import { m } from '$lib/paraglide/messages';
  import toast from '$lib/toast/index.svelte';
  import ArrowPathIcon from '@iconify-svelte/heroicons/arrow-path';
  import DocumentArrowUpIcon from '@iconify-svelte/heroicons/document-arrow-up';

  import { onDestroy, onMount } from 'svelte';

  let { mode, callback }: { mode: 'account' | 'save'; callback: (file: ArrayBuffer, name: string) => Promise<{ isValid: boolean; errorTitle?: string; errorDescription?: string }> } = $props();

  let draggedOver = $state(false);
  let isProcessing = $state(false);
  let loadedFileName = $state('');

  const ACCEPTED_FILE_EXTENSION = '.hg';
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100 MB

  let buttonElement: HTMLButtonElement = $state(null!);
  let inputElement: HTMLInputElement = $state(null!);

  let callbackState: 'initial' | 'error' = $state('initial');

  let cleanupFunctions: (() => void)[] = [];

  function dropHandler(event: DragEvent & { dataTransfer: DataTransfer }) {
    draggedOver = false;
    event.preventDefault();

    if (event.dataTransfer.items.length > 1) {
      toast.error(m.component_uploadform_toast_error_multiple_title(), m.component_uploadform_toast_error_multiple_desc());
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
        errorTitle: m.component_uploadform_toast_error_none_title(),
        errorDescription: m.component_uploadform_toast_error_none_desc()
      };
    }

    if (!file.name.endsWith(ACCEPTED_FILE_EXTENSION)) {
      return {
        isValid: false,
        errorTitle: m.component_uploadform_toast_error_invalidtype_title(),
        errorDescription: m.component_uploadform_toast_error_invalidtype_desc()
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      return {
        isValid: false,
        errorTitle: m.component_uploadform_toast_error_toolarge_title(),
        errorDescription: m.component_uploadform_toast_error_toolarge_desc({ maxSize: (MAX_FILE_SIZE / (1024 * 1024)).toString() })
      };
    }

    return { isValid: true };
  }

  function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(new Error(`Failed to read file: ${reader.error?.message}`));
      reader.readAsArrayBuffer(file);
    });
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

  async function handleFileUpload(file: File | null) {
    if (isProcessing) return;

    const validation = validateFile(file);
    if (!validation.isValid) {
      toast.error(validation.errorTitle!, validation.errorDescription!);
      return;
    }

    isProcessing = true;
    loadedFileName = file!.name;

    toast.info(m.component_uploadform_toast_info_processing_title(), m.component_uploadform_toast_info_processing_desc());

    try {
      const arrayBuffer = await readFileAsArrayBuffer(file!);

      if (!validation.isValid) {
        toast.error(validation.errorTitle!, validation.errorDescription!);
        return;
      }

      const result = await callback(arrayBuffer, file?.name || '');

      if (!result.isValid) {
        toast.error(result.errorTitle ?? m.component_uploadform_toast_error_corrupted_title(), result.errorDescription ?? m.component_uploadform_toast_error_corrupted_desc());
        callbackState = 'error';
        isProcessing = false;
        return;
      }

      toast.success(m.component_uploadform_toast_success_loaded_title(), m.component_uploadform_toast_success_loaded_desc());
    } catch (error) {
      console.error('File processing error:', error);
      callbackState = 'error';
      toast.error(m.component_uploadform_toast_error_corrupted_title(), m.component_uploadform_toast_error_corrupted_desc());
    } finally {
      isProcessing = false;
    }
  }
</script>

<div class="bg-white outline -outline-offset-1 outline-gray-200 sm:rounded-lg dark:bg-gray-800/50 dark:outline-white/10">
  <div class="px-4 py-5 sm:p-6">
    {#if mode === 'account'}
      <h3 class="text-base font-semibold text-gray-900 dark:text-white">{m.component_uploadform_location_account_title()}</h3>
      <div class="mt-2 max-w-xl text-sm text-gray-700 dark:text-gray-400">
        <p>{m.component_uploadform_location_account_desc()}</p>
        <div class="mt-4 space-y-3 font-mono text-sm">
          <div>
            <span class="font-semibold text-gray-900 dark:text-white">{m.component_uploadform_location_account_linux()}</span>
            <pre class="wrap-break-words whitespace-pre-wrap text-gray-700 dark:text-gray-300">{m.component_uploadform_location_account_path_linux()}</pre>
          </div>
          <div>
            <span class="font-semibold text-gray-900 dark:text-white">{m.component_uploadform_location_account_windows()}</span>
            <pre class="wrap-break-words whitespace-pre-wrap text-gray-700 dark:text-gray-300">{m.component_uploadform_location_account_path_windows()}</pre>
          </div>
        </div>
        <div class="mt-4 text-sm text-gray-700 dark:text-gray-400">
          <p>
            {m.component_uploadform_location_account_hint()}
          </p>
        </div>
      </div>
    {:else}
      <h3 class="text-base font-semibold text-gray-900 dark:text-white">{m.component_uploadform_location_save_title()}</h3>
      <div class="mt-2 max-w-xl text-sm text-gray-700 dark:text-gray-400">
        <p>{m.component_uploadform_location_save_desc()}</p>
        <div class="mt-4 space-y-3 font-mono text-sm">
          <div>
            <span class="font-semibold text-gray-900 dark:text-white">{m.component_uploadform_location_save_linux()}</span>
            <pre class="wrap-break-words whitespace-pre-wrap text-gray-700 dark:text-gray-300">{m.component_uploadform_location_save_path_linux()}</pre>
          </div>
          <div>
            <span class="font-semibold text-gray-900 dark:text-white">{m.component_uploadform_location_save_windows()}</span>
            <pre class="wrap-break-words whitespace-pre-wrap text-gray-700 dark:text-gray-300">{m.component_uploadform_location_save_path_windows()}</pre>
          </div>
        </div>
        <div class="mt-4 text-sm text-gray-700 dark:text-gray-400">
          <p>
            {m.component_uploadform_location_save_hint()}
          </p>
        </div>
      </div>
    {/if}
  </div>
</div>

<form>
  <button
    type="button"
    disabled={isProcessing}
    onclick={() => inputElement.click()}
    bind:this={buttonElement}
    class={'relative mt-16 block w-full cursor-pointer rounded-lg border-2 p-12 text-center transition-all duration-200 focus:outline-2 focus:outline-offset-2 focus:outline-primary-500 ' +
      (isProcessing
        ? 'cursor-not-allowed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
        : draggedOver
          ? 'border-solid border-blue-600 bg-blue-400/30 dark:border-blue-400 dark:bg-blue-400/20'
          : callbackState === 'error'
            ? 'border-dashed border-red-300 hover:border-red-400 dark:border-red-600 dark:hover:border-red-500'
            : 'border-dashed border-gray-300 hover:border-gray-400 dark:border-white/15 dark:hover:border-white/25')}
  >
    {#if isProcessing}
      <ArrowPathIcon width="20" height="20" class="mx-auto size-12 animate-spin text-gray-400" />
      <span class="mt-2 block text-sm font-semibold text-gray-500 dark:text-gray-400">{m.component_uploadform_form_loading_hint()}</span>
    {:else if callbackState === 'error'}
      <DocumentArrowUpIcon width="20" height="20" class="mx-auto size-12 text-red-500" />
      <span class="mt-2 block text-sm font-semibold text-red-600 dark:text-red-400">{m.component_uploadform_form_error_hint()}</span>
    {:else}
      <DocumentArrowUpIcon width="20" height="20" class="mx-auto size-12 text-gray-500" />
      <span class="mt-2 block text-sm font-semibold text-gray-700 dark:text-white">{m.component_uploadform_form_hint()}</span>
    {/if}
  </button>

  <input id="file-upload" type="file" accept={ACCEPTED_FILE_EXTENSION} disabled={isProcessing} class="hidden" bind:this={inputElement} onchange={clickHandler} />
</form>

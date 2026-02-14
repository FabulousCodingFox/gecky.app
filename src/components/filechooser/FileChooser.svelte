<script lang="ts">
  import { m } from '$lib/paraglide/messages';
  import toast from '$lib/toast/index.svelte';
  import ArrowPathIcon from '@iconify-svelte/heroicons/arrow-path';
  import DocumentArrowUpIcon from '@iconify-svelte/heroicons/document-arrow-up-20-solid';
  import FolderIcon from '@iconify-svelte/heroicons/folder-20-solid';

  import { getContext, onDestroy, onMount } from 'svelte';
  import Heading from '../ui/heading/Heading.svelte';
  import Text from '../ui/text/Text.svelte';
  import Code from '../ui/text/Code.svelte';
  import Strong from '../ui/text/Strong.svelte';
  import clsx from 'clsx';
  import { ACCEPTED_FILE_EXTENSION, createOrGetHandle, deleteHandle, loadHandle, readFileAsArrayBuffer, saveHandle, validateFile } from './common';
  import { decryptSaveFile } from '$lib/hellosave/save';
  import { languages, type LocalSettingsStore } from '$lib';
  import Button from '../ui/button/Button.svelte';
  import Subheading from '../ui/heading/Subheading.svelte';
  import { type SaveEditorContext } from '../../routes/account/shared.svelte';

  let { mode, callback }: { mode: 'account' | 'save'; callback: (file: ArrayBuffer, name: string) => Promise<{ isValid: boolean; errorTitle?: string; errorDescription?: string }> } = $props();

  let draggedOver = $state(false);
  let isProcessing = $state(false);

  let buttonElement: HTMLButtonElement = $state(null!);
  let inputElement: HTMLInputElement = $state(null!);

  let callbackState: 'initial' | 'error' = $state('initial');

  let cleanupFunctions: (() => void)[] = [];

  function dropHandler(event: DragEvent & { dataTransfer: DataTransfer }) {
    draggedOver = false;
    event.preventDefault();

    if (event.dataTransfer.items.length > 1) {
      toast.error(m.component_filechooser_toast_error_multiple_title(), m.component_filechooser_toast_error_multiple_desc());
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
    supportsFileSystemApi = window.showDirectoryPicker !== undefined;
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

    toast.info(m.component_filechooser_toast_info_processing_title(), m.component_filechooser_toast_info_processing_desc());

    try {
      const arrayBuffer = await readFileAsArrayBuffer(file!);

      if (!validation.isValid) {
        toast.error(validation.errorTitle!, validation.errorDescription!);
        return;
      }

      const result = await callback(arrayBuffer, file?.name || '');

      if (!result.isValid) {
        toast.error(result.errorTitle ?? m.component_filechooser_toast_error_corrupted_title(), result.errorDescription ?? m.component_filechooser_toast_error_corrupted_desc());
        callbackState = 'error';
        isProcessing = false;
        return;
      }

      toast.success(m.component_filechooser_toast_success_loaded_title(), m.component_filechooser_toast_success_loaded_desc());
    } catch (error) {
      console.error('File processing error:', error);
      callbackState = 'error';
      toast.error(m.component_filechooser_toast_error_corrupted_title(), m.component_filechooser_toast_error_corrupted_desc());
    } finally {
      isProcessing = false;
    }
  }

  let supportsFileSystemApi = $state(false);
  let saveFiles: { name: string; description: string; date: Date; file: File; handle: FileSystemFileHandle }[] | null = $state(null);
  let accountFiles: { name: string; description: string; date: Date; file: File; handle: FileSystemFileHandle }[] | null = $state(null);
  let isProcessingSelection = $state(false);

  async function selectFolder() {
    isProcessingSelection = true;

    let dirHandle = await createOrGetHandle();
    if (!dirHandle) {
      isProcessingSelection = false;
      return;
    }

    if (dirHandle.name === 'NMS') {
      // Move down one directory. Its named st_[0-9]
      const entries = dirHandle.entries();
      for await (const [name, handle] of entries) {
        if (handle.kind === 'directory' && (name as string).match(/^st_[0-9]+$/i)) {
          dirHandle = handle as FileSystemDirectoryHandle;
        }
      }
    }

    // Check if files exist. Only list files ending in .hg
    // Any save[0-9].hg file
    // any accountdata.hg file
    const extractedSaveFiles: Record<string, FileSystemFileHandle> = {};
    let accountDataFile: FileSystemFileHandle | null = null;

    for await (const [name, handle] of dirHandle.entries()) {
      if (handle.kind === 'file' && name.endsWith('.hg')) {
        if (name.match(/^save[0-9]+\.hg$/i)) {
          extractedSaveFiles[name] = handle;
        } else if (name === 'accountdata.hg') {
          accountDataFile = handle;
        }
      }
    }

    if (!accountDataFile || Object.entries(extractedSaveFiles).length === 0) {
      await deleteHandle();
      toast.error(m.component_filechooser_toast_error_invaliddir_title(), m.component_filechooser_toast_error_invaliddir_desc());
      isProcessingSelection = false;
      return;
    }

    // Save handle for later retrieval
    await saveHandle(dirHandle);

    if (mode === 'account') {
      if (accountDataFile) {
        const file = await accountDataFile.getFile();
        accountFiles = [
          {
            name: 'accountdata.hg',
            description: '',
            date: new Date(file.lastModified),
            file: file,
            handle: accountDataFile
          }
        ];
      }
    } else {
      saveFiles = [];
      for (const [saveName, fileHandle] of Object.entries(extractedSaveFiles)) {
        const file = await fileHandle.getFile();

        let name: string = saveName;
        let description: string = '';

        try {
          // Try to read save name & description
          const arrayBuffer = await readFileAsArrayBuffer(file);
          let data = decryptSaveFile(arrayBuffer);
          name = data.CommonStateData.SaveName;
          description = data.BaseContext.PlayerStateData.SaveSummary;
        } catch {
          continue;
        }

        saveFiles.push({
          name: name,
          description: description,
          date: new Date(file.lastModified),
          file: file,
          handle: fileHandle
        });
      }
    }

    isProcessingSelection = false;
  }

  let browserLocale = $derived(languages[(getContext('localSettings') as LocalSettingsStore).language].browser_locale);

  let saveEditorData = getContext<SaveEditorContext>('saveEditorData');
  let accountEditorData = getContext<SaveEditorContext>('accountEditorData');
</script>

<div class="rounded-lg border border-zinc-950/10 bg-transparent px-4 py-5 sm:p-6 dark:border-white/10 dark:bg-white/5">
  {#if mode === 'account'}
    <Heading level={3}>{m.component_filechooser_location_account_title()}</Heading>
    <Text>{m.component_filechooser_location_account_desc()}</Text>

    <Text class="mt-3"><Strong>{m.component_filechooser_location_account_linux()}</Strong></Text>
    <Text><Code>{m.component_filechooser_location_account_path_linux()}</Code></Text>

    <Text class="mt-3"><Strong>{m.component_filechooser_location_account_windows()}</Strong></Text>
    <Text><Code>{m.component_filechooser_location_account_path_windows()}</Code></Text>

    <Text class="mt-3">{m.component_filechooser_location_account_hint()}</Text>
  {:else}
    <Heading level={3}>{m.component_filechooser_location_save_title()}</Heading>
    <Text>{m.component_filechooser_location_save_desc()}</Text>

    <Text class="mt-3"><Strong>{m.component_filechooser_location_save_linux()}</Strong></Text>
    <Text><Code>{m.component_filechooser_location_save_path_linux()}</Code></Text>

    <Text class="mt-3"><Strong>{m.component_filechooser_location_save_windows()}</Strong></Text>
    <Text><Code>{m.component_filechooser_location_save_path_windows()}</Code></Text>

    <Text class="mt-3">{m.component_filechooser_location_save_hint()}</Text>
  {/if}
</div>

{#if supportsFileSystemApi}
  {#if isProcessingSelection || (saveFiles == null && accountFiles == null)}
    <form>
      <button
        type="button"
        onclick={selectFolder}
        class={clsx(
          'relative mt-16 block w-full cursor-pointer rounded-lg border-2 p-12 text-center transition-all duration-200 focus:outline-2 focus:outline-offset-2 focus:outline-primary-500',
          isProcessingSelection && 'cursor-not-allowed border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800',
          !isProcessingSelection && 'border-dashed border-gray-300 hover:border-gray-400 dark:border-white/15 dark:hover:border-white/25'
        )}
      >
        {#if isProcessingSelection}
          <ArrowPathIcon width="20" height="20" class="mx-auto size-12 animate-spin text-gray-400" />
          <span class="mt-2 block text-sm font-semibold text-gray-500 dark:text-zinc-400">{m.component_filechooser_selection_loading_hint()}</span>
        {:else}
          <FolderIcon width="20" height="20" class="mx-auto size-12 text-gray-500" />
          <span class="mt-2 block text-sm font-semibold text-zinc-500 dark:text-white">{m.component_filechooser_selection_hint()}</span>
        {/if}
      </button>
    </form>
  {:else}
    <div class="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
      {#each saveFiles as f}
        <Button
          outline
          class="flex-col"
          onclick={() => {
            saveEditorData.fileHandle = f.handle;
            handleFileUpload(f.file);
          }}
        >
          <Subheading>{f.name}</Subheading>
          <Text>{f.description}</Text>
          <Text>{f.date.toLocaleString(browserLocale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
        </Button>
      {/each}
      {#each accountFiles as f}
        <Button
          outline
          class="col-span-3 flex-col"
          s
          onclick={() => {
            accountEditorData.fileHandle = f.handle;
            handleFileUpload(f.file);
          }}
        >
          <Subheading>{f.name}</Subheading>
          <Text>{f.description}</Text>
          <Text>{f.date.toLocaleString(browserLocale, { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
        </Button>
      {/each}
    </div>
  {/if}
{/if}

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
      <span class="mt-2 block text-sm font-semibold text-gray-500 dark:text-zinc-400">{m.component_filechooser_form_loading_hint()}</span>
    {:else if callbackState === 'error'}
      <DocumentArrowUpIcon width="20" height="20" class="mx-auto size-12 text-red-500" />
      <span class="mt-2 block text-sm font-semibold text-red-600 dark:text-red-400">{m.component_filechooser_form_error_hint()}</span>
    {:else}
      <DocumentArrowUpIcon width="20" height="20" class="mx-auto size-12 text-gray-500" />
      <span class="mt-2 block text-sm font-semibold text-zinc-500 dark:text-white">{m.component_filechooser_form_hint()}</span>
    {/if}
  </button>

  <input id="file-upload" type="file" accept={ACCEPTED_FILE_EXTENSION} disabled={isProcessing} class="hidden" bind:this={inputElement} onchange={clickHandler} />
</form>

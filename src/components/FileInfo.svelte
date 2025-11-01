<script lang="ts">
  import { m } from '$lib/paraglide/messages';
  import toast from '$lib/toast/index.svelte';
  import DocumentArrowUpIcon from '@iconify-svelte/heroicons/document-arrow-up';

  let { fileName, callback = async () => {} }: { fileName: string; callback: () => Promise<void> } = $props();

  let blocked = $state(false);

  async function handleClick() {
    if (blocked) return;
    blocked = true;
    try {
      await callback();
      toast.info(m.fileinfo_load_different_success_title(), m.fileinfo_load_different_success_description());
    } catch (e) {
      toast.error(m.fileinfo_load_different_failed_title(), m.fileinfo_load_different_failed_description());
    }
    blocked = false;
  }
</script>

<div class="rounded-lg border border-primary-200 bg-primary-50 p-4 dark:border-primary-800 dark:bg-primary-900/20">
  <div class="flex items-center justify-between">
    <div class="flex items-center space-x-3">
      <div class="shrink-0">
        <DocumentArrowUpIcon class="size-5 text-primary-600 dark:text-primary-400" />
      </div>
      <div class="min-w-0 flex-1">
        <p class="text-sm font-medium text-primary-800 dark:text-primary-200">
          {m.fileinfo_loaded({ filename: fileName })}
        </p>
        <p class="text-sm text-primary-600 dark:text-primary-300">
          {m.fileinfo_ready_edit()}
        </p>
      </div>
    </div>
    <button type="button" onclick={handleClick} disabled={blocked} class="text-sm font-medium text-primary-700 hover:text-primary-900 disabled:cursor-not-allowed disabled:opacity-50 dark:text-primary-300 dark:hover:text-primary-100">
      {m.fileinfo_load_different()}
    </button>
  </div>
</div>

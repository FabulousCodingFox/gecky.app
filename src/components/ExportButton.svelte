<script lang="ts">
  import { m } from '$lib/paraglide/messages';
  import toast from '$lib/toast/index.svelte';
  import { ArrowPath, DocumentArrowDown, DocumentArrowUp } from '@steeze-ui/heroicons';
  import { Icon } from '@steeze-ui/svelte-icon';

  let { callback = async () => {} }: { callback: () => Promise<void> } = $props();

  let blocked = $state(false);

  async function handleClick() {
    if (blocked) return;
    blocked = true;
    try {
      toast.info(m.export_processing_title(), m.export_processing_description());
      await callback();
      toast.success(m.export_success_title(), m.export_success_description());
    } catch (e) {
      toast.error(m.export_failed_title(), m.export_failed_description());
    }
    blocked = false;
  }
</script>

<div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
  <button
    onclick={handleClick}
    disabled={blocked}
    type="button"
    class="flex items-center justify-center gap-x-2 rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {#if blocked}
      <Icon src={ArrowPath} aria-hidden="true" class="-ml-0.5 size-5 animate-spin" />
      {m.export_button_processing()}
    {:else}
      <Icon src={DocumentArrowDown} aria-hidden="true" class="-ml-0.5 size-5" />
      {m.export_button()}
    {/if}
  </button>
</div>

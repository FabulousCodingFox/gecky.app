<script lang="ts">
  import { m } from '$lib/paraglide/messages';
  import toast from '$lib/toast/index.svelte';
  import ArrowPathIcon from '@iconify-svelte/heroicons/arrow-path-16-solid';
  import DocumentArrowDownIcon from '@iconify-svelte/heroicons/document-arrow-down-16-solid';
  import Button from './ui/button/Button.svelte';

  let { callback = async () => {} }: { callback: () => Promise<void> } = $props();

  let blocked = $state(false);

  async function handleClick() {
    if (blocked) return;
    blocked = true;
    try {
      toast.info(m.component_exportbutton_toast_info_processing_title(), m.component_exportbutton_toast_info_processing_desc());
      await callback();
      toast.success(m.component_exportbutton_toast_success_saved_title(), m.component_exportbutton_toast_success_saved_desc());
    } catch {
      toast.error(m.component_exportbutton_toast_error_failed_title(), m.component_exportbutton_toast_error_failed_desc());
    }
    blocked = false;
  }
</script>

<Button disabled={blocked} onclick={handleClick} color="emerald">
  {#if blocked}
    <ArrowPathIcon aria-hidden="true" class="animate-spin" data-slot="icon" width="16" height="16" />
    {m.component_exportbutton_form_button_processing()}
  {:else}
    <DocumentArrowDownIcon aria-hidden="true" data-slot="icon" width="16" height="16" />
    {m.component_exportbutton_form_button_label()}
  {/if}
</Button>

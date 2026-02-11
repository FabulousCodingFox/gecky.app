<script lang="ts">
  import { m } from '$lib/paraglide/messages';
  import toast from '$lib/toast/index.svelte';
  import DocumentMinusIcon from '@iconify-svelte/heroicons/document-minus';

  let { callback = async () => {} }: { callback: () => Promise<void> } = $props();

  async function handleClick() {
    await callback();
    toast.success(m.component_resetbutton_toast_success_title(), m.component_resetbutton_toast_success_desc());
  }
</script>

<div class="flex flex-col gap-3 sm:flex-row sm:justify-center">
  <button
    onclick={handleClick}
    type="button"
    class="flex cursor-pointer items-center justify-center gap-x-2 rounded-md bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-primary-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600 disabled:cursor-wait disabled:opacity-50"
  >
    <DocumentMinusIcon aria-hidden="true" class="-ml-0.5 size-5" />
    {m.component_resetbutton_form_button_label()}
  </button>
</div>

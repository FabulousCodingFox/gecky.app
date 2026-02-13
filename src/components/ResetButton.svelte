<script lang="ts">
  import { m } from '$lib/paraglide/messages';
  import toast from '$lib/toast/index.svelte';
  import DocumentMinusIcon from '@iconify-svelte/heroicons/document-minus-16-solid';
  import Button from './ui/button/Button.svelte';

  let { callback = async () => {} }: { callback: () => Promise<void> } = $props();

  async function handleClick() {
    await callback();
    toast.success(m.component_resetbutton_toast_success_title(), m.component_resetbutton_toast_success_desc());
  }
</script>

<Button onclick={handleClick} color="emerald">
  <DocumentMinusIcon aria-hidden="true" data-slot="icon" width="16" height="16" />
  {m.component_resetbutton_form_button_label()}
</Button>

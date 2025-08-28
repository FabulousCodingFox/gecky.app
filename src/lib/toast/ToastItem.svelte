<script lang="ts">
  import { Icon } from '@steeze-ui/svelte-icon';
  import { CheckCircle, XMark, InformationCircle, ExclamationCircle } from '@steeze-ui/heroicons';
  import type { ToastInternal } from './index.svelte';
  import toast from './index.svelte';
  import { Tween } from 'svelte/motion';
  let { options }: { options: ToastInternal } = $props();

  const progress = new Tween(0, { duration: options.duration });
  progress.target = 1;

  function close() {
    toast.pop(options.id);
  }

  $effect(() => {
    if (progress.current === 1) close();
  });
</script>

<div class="p-4">
  <div class="flex items-start">
    <div class="shrink-0">
      {#if options.type === 'info'}
        <Icon src={InformationCircle} theme="outline" size="24px" aria-hidden="true" class="size-6 text-blue-400" />
      {:else if options.type === 'error'}
        <Icon src={ExclamationCircle} theme="outline" size="24px" aria-hidden="true" class="size-6 text-red-400" />
      {:else if options.type === 'success'}
        <Icon src={CheckCircle} theme="outline" size="24px" aria-hidden="true" class="size-6 text-green-400" />
      {/if}
    </div>
    <div class="ml-3 w-0 flex-1 pt-0.5">
      <p class="text-sm font-medium text-gray-900 dark:text-white">{options.text}</p>
      <p class="mt-1 text-sm text-gray-500 dark:text-zinc-400">{options.description}</p>
    </div>
    <div class="ml-4 flex shrink-0">
      <button onclick={close} type="button" class="focus:ring-primary-500 inline-flex rounded-md bg-white text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-offset-2 focus:outline-hidden dark:bg-zinc-900 dark:text-zinc-500 dark:hover:text-gray-400">
        <span class="sr-only">Close</span>
        <Icon src={XMark} theme="solid" size="20px" aria-hidden="true" class="size-5" />
      </button>
    </div>
  </div>
</div>

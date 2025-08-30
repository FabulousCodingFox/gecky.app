<script>
  import { m } from '$lib/paraglide/messages';
  import { Icon } from '@steeze-ui/svelte-icon';
  import Nav from '../../components/Nav.svelte';
  import { ExclamationTriangle } from '@steeze-ui/heroicons';
</script>

<Nav activeTab="save" />

<div class="pb-10">
  <header>
    <div aria-hidden="true" class="relative">
      <enhanced:img src="$lib/assets/wallpaper/nms_legacy_15.png?enhanced" alt="" class="h-64 w-full object-cover" sizes="min(3840px, 100vw)" fetchpriority="high" />
      <div class="absolute inset-0 bg-linear-to-t from-gray-50 dark:from-gray-950"></div>
    </div>

    <div class="relative mx-auto -mt-12 max-w-7xl px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8">
      <div class="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">{m.page_save_title()}</h2>
        <p class="mt-4 text-gray-500 dark:text-gray-400">{m.page_save_description()}</p>
      </div>
    </div>
  </header>
  <main>
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div class="rounded-md bg-yellow-50 p-4 dark:bg-yellow-500/10 dark:outline dark:outline-yellow-500/15">
        <div class="flex">
          <div class="shrink-0">
            <Icon src={ExclamationTriangle} class="size-5 text-yellow-400 dark:text-yellow-300" theme="solid" size="20px" />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800 dark:text-yellow-100">{m.page_save_warning_notimplemented_title()}</h3>
            <div class="mt-2 text-sm text-yellow-700 dark:text-yellow-100/80">
              <p>{m.page_save_warning_notimplemented_description()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</div>

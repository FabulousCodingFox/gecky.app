<script lang="ts">
  import Nav from '../../components/Nav.svelte';
  import headerBg from '$lib/assets/wallpaper/nms_contemporary_10.jpg';
  import { m } from '$lib/paraglide/messages';
  import AccountEditor from '../../components/editors/account/AccountEditor.svelte';
</script>

<Nav activeTab="account" />

<div class="pb-10">
  <header>
    <div aria-hidden="true" class="relative">
      <img src={headerBg} alt="" class="h-64 w-full object-cover" />
      <div class="absolute inset-0 bg-linear-to-t from-gray-50 dark:from-gray-950"></div>
    </div>

    <div class="relative mx-auto -mt-12 max-w-7xl px-4 pb-8 sm:px-6 sm:pb-12 lg:px-8">
      <div class="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">{m.page_account_title()}</h2>
        <p class="mt-4 text-gray-500 dark:text-gray-400">{m.page_account_description()}</p>
      </div>
    </div>
  </header>
  <main>
    <div class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <AccountEditor />
    </div>
  </main>
</div>

<script lang="ts">
  import Sidebar from '../../components/Sidebar.svelte';
  import HomeIcon from '@iconify-svelte/heroicons/home';
  import CodeBracketIcon from '@iconify-svelte/heroicons/code-bracket';
  import GiftIcon from '@iconify-svelte/heroicons/gift';
  import { initContext } from './shared.svelte';
  import { m } from '$lib/paraglide/messages';
  import type { Component } from 'svelte';

  let editorData = initContext();

  let { children } = $props();

  let sidebar: { name: string; href: string; icon: Component | null }[] = $derived(
    editorData.data
      ? [
          { name: m.page_account_tab_overview(), href: '/account/', icon: HomeIcon },
          { name: m.page_account_tab_expeditions(), href: '/account/expeditions/', icon: GiftIcon },
          { name: m.page_account_tab_twitch(), href: '/account/twitch/', icon: GiftIcon },
          { name: m.page_account_tab_platform(), href: '/account/platform/', icon: GiftIcon },
          { name: m.page_account_tab_json(), href: '/account/json/', icon: CodeBracketIcon }
        ]
      : [{ name: m.page_account_tab_overview(), href: '/account/', icon: HomeIcon }]
  );
</script>

<Sidebar data={sidebar} />

<main class="size-full lg:pl-72">
  {@render children?.()}
</main>

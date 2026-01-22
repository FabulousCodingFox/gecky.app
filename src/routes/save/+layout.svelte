<script lang="ts">
  import Sidebar from '../../components/Sidebar.svelte';
  import HomeIcon from '@iconify-svelte/heroicons/home';
  import CodeBracketIcon from '@iconify-svelte/heroicons/code-bracket';
  import UserIcon from '@iconify-svelte/heroicons/user';
  import { initContext } from './shared.svelte';
  import { m } from '$lib/paraglide/messages';
  import type { Component } from 'svelte';

  let editorData = initContext();

  let { children } = $props();

  let sidebar: { name: string; href: string; icon: Component | null }[] = $derived(
    editorData.data
      ? [
          { name: m.page_save_tab_overview(), href: '/save/', icon: HomeIcon },
          { name: m.page_save_tab_exosuit(), href: '/save/exosuit/', icon: UserIcon },
          { name: m.page_save_tab_json(), href: '/save/json/', icon: CodeBracketIcon }
        ]
      : [{ name: m.page_save_tab_overview(), href: '/save/', icon: HomeIcon }]
  );
</script>

<Sidebar data={sidebar} />

<main class="size-full lg:pl-72">
  {@render children?.()}
</main>

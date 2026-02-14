<script lang="ts">
  import { initContext } from './shared.svelte';
  import { m } from '$lib/paraglide/messages';
  import { setSidebar } from '$lib/sidebar.svelte';
  import SidebarSection from '../../components/ui/sidebar/SidebarSection.svelte';
  import SidebarItem from '../../components/ui/sidebar/SidebarItem.svelte';
  import SidebarLabel from '../../components/ui/sidebar/SidebarLabel.svelte';
  import { page } from '$app/state';
  import HomeIcon from '@iconify-svelte/heroicons/home-20-solid';
  import CodeBracketIcon from '@iconify-svelte/heroicons/code-bracket-20-solid';

  let editorData = initContext();

  let { children } = $props();

  setSidebar(sidebar);
</script>

{#snippet sidebar()}
  <SidebarSection>
    <SidebarItem href="/save/" current={page.url.pathname === '/save/'}>
      <HomeIcon width="20" height="20" aria-hidden="true" data-slot="icon" />
      <SidebarLabel>{m.page_save_tab_overview()}</SidebarLabel>
    </SidebarItem>
    {#if editorData.data}
      <SidebarItem href="/save/exosuit/" current={page.url.pathname.startsWith('/save/exosuit')}>
        <SidebarLabel>{m.page_save_tab_exosuit()}</SidebarLabel>
      </SidebarItem>
      <!--<SidebarItem href="/save/multitools/" current={page.url.pathname.startsWith('/save/multitools')}>
        <SidebarLabel>{m.page_save_tab_multitools()}</SidebarLabel>
      </SidebarItem>
      <SidebarItem href="/save/ships/" current={page.url.pathname.startsWith('/save/ships')}>
        <SidebarLabel>{m.page_save_tab_ships()}</SidebarLabel>
      </SidebarItem>
      <SidebarItem href="/save/squadron/" current={page.url.pathname.startsWith('/save/squadron')}>
        <SidebarLabel>{m.page_save_tab_squadron()}</SidebarLabel>
      </SidebarItem>-->
      <SidebarItem href="/save/freighter/" current={page.url.pathname.startsWith('/save/freighter')}>
        <SidebarLabel>{m.page_save_tab_freighter()}</SidebarLabel>
      </SidebarItem>
      <!--<SidebarItem href="/save/frigates/" current={page.url.pathname.startsWith('/save/frigates')}>
        <SidebarLabel>{m.page_save_tab_frigates()}</SidebarLabel>
      </SidebarItem>
      <SidebarItem href="/save/exocraft/" current={page.url.pathname.startsWith('/save/exocraft')}>
        <SidebarLabel>{m.page_save_tab_exocraft()}</SidebarLabel>
      </SidebarItem>
      <SidebarItem href="/save/companions/" current={page.url.pathname.startsWith('/save/companions')}>
        <SidebarLabel>{m.page_save_tab_companions()}</SidebarLabel>
      </SidebarItem>
      <SidebarItem href="/save/storage/" current={page.url.pathname.startsWith('/save/storage')}>
        <SidebarLabel>{m.page_save_tab_storage()}</SidebarLabel>
      </SidebarItem>
      <SidebarItem href="/save/settlements/" current={page.url.pathname.startsWith('/save/settlements')}>
        <SidebarLabel>{m.page_save_tab_settlements()}</SidebarLabel>
      </SidebarItem>
      <SidebarItem href="/save/discoveries/" current={page.url.pathname.startsWith('/save/discoveries')}>
        <SidebarLabel>{m.page_save_tab_discoveries()}</SidebarLabel>
      </SidebarItem>-->
      <SidebarItem href="/save/milestones/" current={page.url.pathname.startsWith('/save/milestones')}>
        <SidebarLabel>{m.page_save_tab_milestones()}</SidebarLabel>
      </SidebarItem>
      <SidebarItem href="/save/json/" current={page.url.pathname.startsWith('/save/json')}>
        <CodeBracketIcon width="20" height="20" aria-hidden="true" data-slot="icon" />
        <SidebarLabel>{m.page_save_tab_json()}</SidebarLabel>
      </SidebarItem>
    {/if}
  </SidebarSection>
{/snippet}

<main class="size-full">
  {@render children?.()}
</main>

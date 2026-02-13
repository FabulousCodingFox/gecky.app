<script lang="ts">
  import { initContext } from './shared.svelte';
  import { m } from '$lib/paraglide/messages';
  import SidebarSection from '../../components/ui/sidebar/SidebarSection.svelte';
  import SidebarItem from '../../components/ui/sidebar/SidebarItem.svelte';
  import SidebarLabel from '../../components/ui/sidebar/SidebarLabel.svelte';
  import { page } from '$app/state';
  import { setSidebar } from '$lib/sidebar.svelte';
  import HomeIcon from '@iconify-svelte/heroicons/home-20-solid';
  import GiftIcon from '@iconify-svelte/heroicons/gift-20-solid';
  import CodeBracketIcon from '@iconify-svelte/heroicons/code-bracket-20-solid';

  let editorData = initContext();

  let { children } = $props();

  setSidebar(sidebar);
</script>

{#snippet sidebar()}
  <SidebarSection>
    <SidebarItem href="/account/" current={page.url.pathname === '/account/'}>
      <HomeIcon width="20" height="20" aria-hidden="true" data-slot="icon" />
      <SidebarLabel>{m.page_account_tab_overview()}</SidebarLabel>
    </SidebarItem>
    {#if editorData.data}
      <SidebarItem href="/account/expeditions/" current={page.url.pathname.startsWith('/account/expeditions')}>
        <GiftIcon width="20" height="20" aria-hidden="true" data-slot="icon" />
        <SidebarLabel>{m.page_account_tab_expeditions()}</SidebarLabel>
      </SidebarItem>
      <SidebarItem href="/account/twitch/" current={page.url.pathname.startsWith('/account/twitch')}>
        <GiftIcon width="20" height="20" aria-hidden="true" data-slot="icon" />
        <SidebarLabel>{m.page_account_tab_twitch()}</SidebarLabel>
      </SidebarItem>
      <SidebarItem href="/account/platform/" current={page.url.pathname.startsWith('/account/platform')}>
        <GiftIcon width="20" height="20" aria-hidden="true" data-slot="icon" />
        <SidebarLabel>{m.page_account_tab_platform()}</SidebarLabel>
      </SidebarItem>
      <SidebarItem href="/account/json/" current={page.url.pathname.startsWith('/account/json')}>
        <CodeBracketIcon width="20" height="20" aria-hidden="true" data-slot="icon" />
        <SidebarLabel>{m.page_account_tab_json()}</SidebarLabel>
      </SidebarItem>
    {/if}
  </SidebarSection>
{/snippet}

<main class="size-full">
  {@render children?.()}
</main>

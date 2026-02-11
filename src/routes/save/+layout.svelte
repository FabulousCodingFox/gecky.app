<script lang="ts">
  import { initContext } from './shared.svelte';
  import { m } from '$lib/paraglide/messages';
  import { setSidebar } from '$lib/sidebar.svelte';
  import SidebarSection from '../../components/ui/sidebar/SidebarSection.svelte';
  import SidebarItem from '../../components/ui/sidebar/SidebarItem.svelte';
  import { Icon } from 'iconify-static';
  import SidebarLabel from '../../components/ui/sidebar/SidebarLabel.svelte';
  import { page } from '$app/state';

  let editorData = initContext();

  let { children } = $props();

  setSidebar(sidebar);
</script>

{#snippet sidebar()}
  <SidebarSection>
    <SidebarItem href="/save/" current={page.url.pathname === '/save/'}>
      <Icon icon="heroicons:home-20-solid" />
      <SidebarLabel>{m.page_save_tab_overview()}</SidebarLabel>
    </SidebarItem>
    {#if editorData.data}
      <SidebarItem href="/save/exosuit/" current={page.url.pathname.startsWith('/save/exosuit')}>
        <Icon icon="heroicons:user-20-solid" />
        <SidebarLabel>{m.page_save_tab_exosuit()}</SidebarLabel>
      </SidebarItem>
      <SidebarItem href="/save/json/" current={page.url.pathname.startsWith('/save/json')}>
        <Icon icon="heroicons:code-bracket-20-solid" />
        <SidebarLabel>{m.page_save_tab_json()}</SidebarLabel>
      </SidebarItem>
    {/if}
  </SidebarSection>
{/snippet}

<main class="size-full">
  {@render children?.()}
</main>

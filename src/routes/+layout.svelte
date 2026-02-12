<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import { apply, createLocalSettingsStore } from '$lib/localSettings.svelte';
  import { getContext, onMount } from 'svelte';
  import { m } from '$lib/paraglide/messages';
  import ToastContainer from '$lib/toast/ToastContainer.svelte';
  import StackedLayout from '../components/ui/layout/RootLayout.svelte';
  import { page } from '$app/state';
  import Listbox from '../components/ui/listbox/Listbox.svelte';
  import { languages, themes, type LocalSettingsStore } from '$lib';
  import SidebarHeader from '../components/ui/sidebar/SidebarHeader.svelte';
  import SidebarSection from '../components/ui/sidebar/SidebarSection.svelte';
  import SidebarItem from '../components/ui/sidebar/SidebarItem.svelte';
  import SidebarLabel from '../components/ui/sidebar/SidebarLabel.svelte';
  import SidebarBody from '../components/ui/sidebar/SidebarBody.svelte';
  import { sidebar as sidebarData } from '$lib/sidebar.svelte';
  import SidebarSpacer from '../components/ui/sidebar/SidebarSpacer.svelte';
  import SidebarFooter from '../components/ui/sidebar/SidebarFooter.svelte';

  let { children } = $props();

  createLocalSettingsStore();

  onMount(apply);

  const localSettings = getContext('localSettings') as LocalSettingsStore;
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>{m.title()}</title>
</svelte:head>

<StackedLayout>
  {#snippet sidebar()}
    <SidebarHeader>
      <SidebarSection class="max-lg:hidden">
        <SidebarItem href="/" current={page.url.pathname === '/'}>
          <SidebarLabel>{m.page_home_title()}</SidebarLabel>
        </SidebarItem>
        <SidebarItem href="/save/" current={page.url.pathname.startsWith('/save')}>
          <SidebarLabel>{m.page_save_title()}</SidebarLabel>
        </SidebarItem>
        <SidebarItem href="/account/" current={page.url.pathname.startsWith('/account')}>
          <SidebarLabel>{m.page_account_title()}</SidebarLabel>
        </SidebarItem>
      </SidebarSection>
    </SidebarHeader>
    <SidebarBody>
      {#if sidebarData.snippet}
        {@render sidebarData.snippet()}
      {/if}
      <SidebarSpacer />
    </SidebarBody>
    <SidebarFooter class="space-y-3 max-lg:hidden">
      <Listbox type="single" allowDeselect={false} bind:value={localSettings.theme} items={Object.values(themes).map((o) => ({ value: o.id, label: o.name, icon: o.icon }))} />
      <Listbox type="single" allowDeselect={false} bind:value={localSettings.language} items={Object.values(languages).map((o) => ({ value: o.id, label: o.name, icon: o.icon }))} />
    </SidebarFooter>
  {/snippet}
  {@render children?.()}
</StackedLayout>

<ToastContainer />

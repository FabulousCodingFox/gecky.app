<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import { apply, createLocalSettingsStore } from '$lib/localSettings.svelte';
  import { getContext, onMount } from 'svelte';
  import { m } from '$lib/paraglide/messages';
  import ToastContainer from '$lib/toast/ToastContainer.svelte';
  import StackedLayout from '../components/ui/layout/RootLayout.svelte';
  import Navbar from '../components/ui/navbar/Navbar.svelte';
  import NavbarSection from '../components/ui/navbar/NavbarSection.svelte';
  import NavbarItem from '../components/ui/navbar/NavbarItem.svelte';
  import { page } from '$app/state';
  import NavbarSpacer from '../components/ui/navbar/NavbarSpacer.svelte';
  import Listbox from '../components/ui/listbox/Listbox.svelte';
  import ListboxLabel from '../components/ui/listbox/ListboxLabel.svelte';
  import ListboxOption from '../components/ui/listbox/ListboxOption.svelte';
  import { languages, themes, type LocalSettingsStore } from '$lib';
  import { Icon } from 'iconify-static';

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
  {#snippet navbar()}
    <Navbar>
      <NavbarSection class="max-lg:hidden">
        <NavbarItem href="/" current={page.url.pathname === '/'}>{m.page_home_title()}</NavbarItem>
        <NavbarItem href="/save/" current={page.url.pathname.startsWith('/save')}>{m.page_save_title()}</NavbarItem>
        <NavbarItem href="/account/" current={page.url.pathname.startsWith('/account')}>{m.page_account_title()}</NavbarItem>
      </NavbarSection>
      <NavbarSpacer />
      <NavbarSection>
        <Listbox type="single" allowDeselect={false} bind:value={localSettings.theme} items={Object.values(themes).map((o) => ({ value: o.id, label: o.name }))} />
        <Listbox type="single" allowDeselect={false} bind:value={localSettings.language} items={Object.values(languages).map((o) => ({ value: o.id, label: o.name }))} />
      </NavbarSection>
    </Navbar>
  {/snippet}
  {@render children?.()}
</StackedLayout>

<ToastContainer />

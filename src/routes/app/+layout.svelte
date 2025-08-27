<script lang="ts">
  import '../../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import { apply, createLocalSettingsStore } from '$lib/localSettings.svelte';
  import { createLocalStateStore } from '$lib/localState.svelte';
  import { onMount } from 'svelte';
  import { m } from '$lib/paraglide/messages';
  import Navbar from '../../components/Navbar.svelte';

  let { children } = $props();

  createLocalSettingsStore();
  createLocalStateStore();

  onMount(() => {
    apply();
  });
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>{m.title()}</title>
</svelte:head>

<Navbar>
  {@render children?.()}
</Navbar>

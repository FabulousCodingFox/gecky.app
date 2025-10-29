<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import { apply, createLocalSettingsStore } from '$lib/localSettings.svelte';
  import { createLocalStateStore } from '$lib/localState.svelte';
  import { onMount } from 'svelte';
  import { m } from '$lib/paraglide/messages';
  import ToastContainer from '$lib/toast/ToastContainer.svelte';
  import Nav from '../components/Nav.svelte';

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
  {#if import.meta.env.PROD}
    <script defer src="https://metrics.gecky.app/script.js" data-website-id="fe91756e-bdc6-4d5f-bf3d-ee5769b87bb8"></script>
  {/if}
</svelte:head>

<Nav />

{@render children?.()}

<ToastContainer />

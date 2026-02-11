<script lang="ts">
  import '../app.css';
  import favicon from '$lib/assets/favicon.svg';
  import { apply, createLocalSettingsStore } from '$lib/localSettings.svelte';
  import { onMount } from 'svelte';
  import { m } from '$lib/paraglide/messages';
  import ToastContainer from '$lib/toast/ToastContainer.svelte';
  import Nav from '../components/Nav.svelte';

  let { children } = $props();

  createLocalSettingsStore();

  onMount(apply);
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
  <title>{m.title()}</title>
</svelte:head>

<Nav />

{@render children?.()}

<ToastContainer />

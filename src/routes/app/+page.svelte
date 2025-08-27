<script lang="ts">
  import { LocalStateAppPage, type LocalState, type LocalStateAppState } from '$lib/localState.svelte';
  import { getContext } from 'svelte';
  import Account from '../../components/pages/Account.svelte';

  let localState = getContext<LocalState>('localState');
</script>

{#if localState.page === LocalStateAppPage.ACCOUNT}
  <Account />
{/if}

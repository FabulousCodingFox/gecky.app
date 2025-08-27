import { setContext } from 'svelte';

export enum LocalStateAppState {
  INITIAL = 0,
  LOADING = 1,
  READY = 2
}

export enum LocalStateAppPage {
  DASHBOARD = 0
}

export type LocalState = {
  state: LocalStateAppState;
  page: LocalStateAppPage;
};

export function createLocalStateStore() {
  const localState = $state<LocalState>({
    state: LocalStateAppState.INITIAL,
    page: LocalStateAppPage.DASHBOARD
  });

  setContext('localState', localState);
}

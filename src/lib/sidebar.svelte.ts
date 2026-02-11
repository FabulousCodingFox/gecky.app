import type { Snippet } from 'svelte';

export type SidebarItem = {
  name: string;
  href: string;
  icon?: Snippet | null;
};

const state = $state<{ snippet: Snippet | null }>({ snippet: null });

export const sidebar = state;

export function setSidebar(item: Snippet) {
  state.snippet = item;
}

export function clearSidebar() {
  state.snippet = null;
}

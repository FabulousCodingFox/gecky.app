import { page } from '$app/state';
import type { JSONSaveData } from '$lib/json';
import { getContext, hasContext, setContext } from 'svelte';

export type SaveEditorContext = {
  data: JSONSaveData | null;
  fileName: string | null;
  fileHandle?: FileSystemFileHandle | null;
};

export function initContext(): SaveEditorContext {
  if (page.url.pathname !== '/account/') {
    if (!hasContext('accountEditorData') || getContext<SaveEditorContext>('accountEditorData').data === null) {
      location.href = '/account/';
    }
  }

  if (hasContext('accountEditorData')) {
    return getContext<SaveEditorContext>('accountEditorData');
  }

  const editorData = $state<SaveEditorContext>({
    data: null,
    fileName: null
  });

  setContext('accountEditorData', editorData);

  return editorData;
}

export interface RewardItem {
  name: string;
  id: string;
  expedition?: number;
  platform?: string;
}

export interface TableGroup {
  label: string | null;
  items: Array<{
    value: string;
    values: string[];
  }>;
}

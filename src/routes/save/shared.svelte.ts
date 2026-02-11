import { page } from '$app/state';
import type { JSONSaveData } from '$lib/json';
import { getContext, hasContext, setContext } from 'svelte';

export type SaveEditorContext = {
  data: JSONSaveData | null;
  fileName: string | null;
};

export function initContext(): SaveEditorContext {
  if (page.url.pathname !== '/save/') {
    if (!hasContext('saveEditorData') || getContext<SaveEditorContext>('saveEditorData').data === null) {
      location.href = '/save/';
    }
  }

  if (hasContext('saveEditorData')) {
    return getContext<SaveEditorContext>('saveEditorData');
  }

  const editorData = $state<SaveEditorContext>({
    data: null,
    fileName: null
  });

  setContext('saveEditorData', editorData);

  return editorData;
}

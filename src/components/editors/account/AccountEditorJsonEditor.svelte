<script lang="ts">
  import type monaco from 'monaco-editor';
  import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
  import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
  import { getContext, onMount } from 'svelte';
  import monacoThemeGithubLight from '../../../../node_modules/monaco-themes/themes/GitHub Light.json';
  import monacoThemeGithubDark from '../../../../node_modules/monaco-themes/themes/GitHub Dark.json';
  import type { LocalSettingsStore } from '$lib';
  import type { JSONSaveData } from '$lib/json';

  let { data = $bindable() }: { data: JSONSaveData } = $props();

  let parent: HTMLElement;
  let editor: monaco.editor.IStandaloneCodeEditor;

  let Monaco: any;

  const localSettings = getContext('localSettings') as LocalSettingsStore;

  $effect(() => {
    if (editor && data) {
      const currentValue = editor.getValue();
      const newValue = JSON.stringify(data, null, 2);
      if (currentValue !== newValue) {
        editor.setValue(newValue);
      }
    }
  });

  $effect(() => {
    localSettings.theme;
    if (editor) {
      Monaco.editor.setTheme(localSettings.theme === 'dark' ? 'github-dark' : 'github-light');
    }
  });

  onMount(async () => {
    self.MonacoEnvironment = {
      getWorker: function (workerId, label) {
        switch (label) {
          case 'json':
            return new jsonWorker();
          default:
            return new editorWorker();
        }
      }
    };

    Monaco = await import('monaco-editor');

    Monaco.editor.defineTheme('github-light', monacoThemeGithubLight as any);
    Monaco.editor.defineTheme('github-dark', monacoThemeGithubDark as any);

    function waitMonacoReady() {
      const ready = typeof Monaco !== 'undefined' && Monaco.editor && Monaco.editor.create && parent;
      if (!ready) {
        setTimeout(waitMonacoReady, 50);
      }
      return true;
    }

    await new Promise((resolve) => {
      resolve(waitMonacoReady());
    });

    editor = Monaco.editor.create(parent, {
      value: JSON.stringify(data, null, 2),
      language: 'json',
      theme: localSettings.theme === 'dark' ? 'github-dark' : 'github-light',
      automaticLayout: true
    });

    editor.getModel()?.updateOptions({
      tabSize: 2,
      insertSpaces: true,
      indentSize: 'tabSize'
    });

    editor.onDidChangeModelContent(() => {
      const newValue = editor.getValue();
      try {
        data = JSON.parse(newValue);
      } catch (e) {
        console.error('Invalid JSON:', e);
      }
      console.log('Account Data Updated:', data);
    });

    return () => {
      editor.dispose();
    };
  });
</script>

<div class="size-full" bind:this={parent}></div>

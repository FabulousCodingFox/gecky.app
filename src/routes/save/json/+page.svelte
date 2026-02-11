<script lang="ts">
  import AccountEditorJsonEditor from '../../../components/editors/account/AccountEditorJsonEditor.svelte';
  import { initContext } from '../shared.svelte';

  let editorData = initContext();
</script>

<AccountEditorJsonEditor bind:data={editorData.data} />

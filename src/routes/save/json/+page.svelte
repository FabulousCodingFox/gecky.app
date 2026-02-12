<script lang="ts">
  import JsonEditor from '../../../components/editors/JsonEditor.svelte';
  import { initContext } from '../shared.svelte';

  let editorData = initContext();
</script>

<JsonEditor bind:data={editorData.data} />

<script lang="ts">
  import JsonEditor from '../../../components/editors/JsonEditor.svelte';
  import PageLayout from '../../../components/ui/layout/PageLayout.svelte';
  import { initContext } from '../shared.svelte';

  let editorData = initContext();
</script>

<PageLayout>
  <JsonEditor bind:data={editorData.data} />
</PageLayout>

<script lang="ts">
  import Field from '../../../components/ui/fieldset/Field.svelte';
  import FieldGroup from '../../../components/ui/fieldset/FieldGroup.svelte';
  import Fieldset from '../../../components/ui/fieldset/Fieldset.svelte';
  import Label from '../../../components/ui/fieldset/Label.svelte';
  import Divider from '../../../components/ui/divider/Divider.svelte';
  import PageLayout from '../../../components/ui/layout/PageLayout.svelte';
  import { initContext } from '../shared.svelte';
  import Legend from '../../../components/ui/fieldset/Legend.svelte';
  import Text from '../../../components/ui/text/Text.svelte';
  import InventoryEditor from '../../../components/editors/input/InventoryInput.svelte';

  let editorData = initContext();
</script>

<PageLayout>
  <Fieldset>
    <Legend>General</Legend>
    <Text>General settings</Text>
    <FieldGroup class="lg:grid-cols-2 xl:grid-cols-3">
      <Field>
        <Label>Name</Label>
      </Field>
      <Field>
        <Label>Type</Label>
      </Field>
      <Field>
        <Label>Class</Label>
      </Field>
      <Field>
        <Label>Home Seed</Label>
      </Field>
      <Field>
        <Label>Model Seed</Label>
      </Field>
    </FieldGroup>
  </Fieldset>
  <Divider />
  <Fieldset>
    <Legend>Base Stats</Legend>
    <Text>Base Stats</Text>
    <FieldGroup class="lg:grid-cols-2 xl:grid-cols-3">
      <Field>
        <Label>Hyperdrive</Label>
      </Field>
      <Field>
        <Label>Fleet Coordination</Label>
      </Field>
    </FieldGroup>
  </Fieldset>
  <Divider />
  <Fieldset>
    <Legend>Inventory</Legend>
    <Text>Inventory</Text>
    <InventoryEditor bind:value={editorData.data.BaseContext.PlayerStateData.FreighterInventory} type="cargo" />
  </Fieldset>
  <Divider />
  <Fieldset>
    <Legend>Technology</Legend>
    <Text>Technology</Text>
    <InventoryEditor bind:value={editorData.data.BaseContext.PlayerStateData.FreighterInventory_TechOnly} type="tech" />
  </Fieldset>
</PageLayout>

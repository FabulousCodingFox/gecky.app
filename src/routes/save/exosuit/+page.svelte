<script lang="ts">
  import Field from '../../../components/ui/fieldset/Field.svelte';
  import FieldGroup from '../../../components/ui/fieldset/FieldGroup.svelte';
  import Fieldset from '../../../components/ui/fieldset/Fieldset.svelte';
  import Label from '../../../components/ui/fieldset/Label.svelte';
  import Legend from '../../../components/ui/fieldset/Legend.svelte';
  import Divider from '../../../components/ui/divider/Divider.svelte';
  import PageLayout from '../../../components/ui/layout/PageLayout.svelte';
  import Text from '../../../components/ui/text/Text.svelte';
  import { initContext } from '../shared.svelte';
  import InventoryEditor from '../../../components/editors/InventoryEditor.svelte';
  import SimpleNumberInput from '../../../components/editors/input/SimpleNumberInput.svelte';

  let editorData = initContext();
</script>

<PageLayout>
  <Fieldset>
    <Legend>Stats</Legend>
    <Text>Modify the exosuit's core stats.</Text>
    <FieldGroup class="lg:grid-cols-2 xl:grid-cols-3">
      <Field>
        <Label>Health</Label>
        <SimpleNumberInput min={0} bind:value={editorData.data.BaseContext.PlayerStateData.Health} />
      </Field>
      <Field>
        <Label>Shield</Label>
        <SimpleNumberInput min={0} bind:value={editorData.data.BaseContext.PlayerStateData.Shield} />
      </Field>
      <Field>
        <Label>Energy</Label>
        <SimpleNumberInput min={0} bind:value={editorData.data.BaseContext.PlayerStateData.Energy} />
      </Field>
    </FieldGroup>
  </Fieldset>
  <Divider />
  <Fieldset>
    <Legend>Currencies</Legend>
    <Text>Modify the amounts of various in-game currencies.</Text>
    <FieldGroup class="lg:grid-cols-2 xl:grid-cols-3">
      <Field>
        <Label>Units</Label>
        <SimpleNumberInput min={-1} bind:value={editorData.data.BaseContext.PlayerStateData.Units} />
      </Field>
      <Field>
        <Label>Nanites</Label>
        <SimpleNumberInput min={0} bind:value={editorData.data.BaseContext.PlayerStateData.Nanites} />
      </Field>
      <Field>
        <Label>Quicksilver</Label>
        <SimpleNumberInput min={0} bind:value={editorData.data.BaseContext.PlayerStateData.Specials} />
      </Field>
    </FieldGroup>
  </Fieldset>
  <Divider />
  <Fieldset>
    <Legend>Inventory</Legend>
    <Text>Modify the exosuit's inventory items.</Text>
    <InventoryEditor bind:value={editorData.data.BaseContext.PlayerStateData.Inventory} type="cargo" />
  </Fieldset>
  <Divider />
  <Fieldset>
    <Legend>Technology</Legend>
    <Text>Modify the exosuit's installed technology.</Text>
    <InventoryEditor bind:value={editorData.data.BaseContext.PlayerStateData.Inventory_TechOnly} type="tech" />
  </Fieldset>
</PageLayout>

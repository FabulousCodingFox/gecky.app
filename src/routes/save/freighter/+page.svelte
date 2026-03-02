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
  import SimpleTextInput from '../../../components/editors/input/SimpleTextInput.svelte';
  import { m } from '$lib/paraglide/messages';

  let editorData = initContext();
</script>

<PageLayout>
  <Fieldset>
    <Legend>{m.page_save_freighter_general_title()}</Legend>
    <Text>{m.page_save_freighter_general_descriptions()}</Text>
    <FieldGroup class="lg:grid-cols-2 xl:grid-cols-3">
      <Field>
        <Label>{m.page_save_freighter_general_name()}</Label>
        <SimpleTextInput bind:value={editorData.data.BaseContext.PlayerStateData.PlayerFreighterName} minlength={1} maxlength={31} />
      </Field>
      <Field>
        <Label>{m.page_save_freighter_general_type()}</Label>
      </Field>
      <Field>
        <Label>{m.page_save_freighter_general_class()}</Label>
      </Field>
      <Field>
        <Label>{m.page_save_freighter_general_homeseed()}</Label>
        <SimpleTextInput bind:value={editorData.data.BaseContext.PlayerStateData.CurrentFreighterHomeSystemSeed[1]} pattern="0x[0-9A-F]*" />
      </Field>
      <Field>
        <Label>{m.page_save_freighter_general_modelseed()}</Label>
        <SimpleTextInput bind:value={editorData.data.BaseContext.PlayerStateData.CurrentFreighter.Seed[1]} pattern="0x[0-9A-F]*" />
      </Field>
    </FieldGroup>
  </Fieldset>
  <Divider />
  <Fieldset>
    <Legend>{m.page_save_freighter_stats_title()}</Legend>
    <Text>{m.page_save_freighter_stats_description()}</Text>
    <FieldGroup class="lg:grid-cols-2 xl:grid-cols-3">
      <Field>
        <Label>{m.page_save_freighter_stats_hyperdrive()}</Label>
      </Field>
      <Field>
        <Label>{m.page_save_freighter_stats_fleet()}</Label>
      </Field>
    </FieldGroup>
  </Fieldset>
  <Divider />
  <Fieldset>
    <Legend>{m.page_save_freighter_inventory_title()}</Legend>
    <Text>{m.page_save_freighter_inventory_description()}</Text>
    <InventoryEditor bind:value={editorData.data.BaseContext.PlayerStateData.FreighterInventory} type="cargo" />
  </Fieldset>
  <Divider />
  <Fieldset>
    <Legend>{m.page_save_freighter_technology_title()}</Legend>
    <Text>{m.page_save_freighter_technology_description()}</Text>
    <InventoryEditor bind:value={editorData.data.BaseContext.PlayerStateData.FreighterInventory_TechOnly} type="tech" />
  </Fieldset>
</PageLayout>

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
  import InventoryEditor from '../../../components/editors/input/InventoryInput.svelte';
  import SimpleNumberInput from '../../../components/editors/input/SimpleNumberInput.svelte';
  import { m } from '$lib/paraglide/messages';
  import InputGroup from '../../../components/ui/input/InputGroup.svelte';

  let editorData = initContext();
</script>

<PageLayout>
  <Fieldset>
    <Legend>{m.page_save_exosuit_stats_title()}</Legend>
    <Text>{m.page_save_exosuit_stats_description()}</Text>
    <FieldGroup class="lg:grid-cols-2 xl:grid-cols-3">
      <Field>
        <Label>{m.page_save_exosuit_stats_health()}</Label>
        <SimpleNumberInput min={0} max={100} bind:value={editorData.data.BaseContext.PlayerStateData.Health} />
      </Field>
      <Field>
        <Label>{m.page_save_exosuit_stats_shield()}</Label>
        <SimpleNumberInput min={0} max={100} bind:value={editorData.data.BaseContext.PlayerStateData.Shield} />
      </Field>
      <Field>
        <Label>{m.page_save_exosuit_stats_energy()}</Label>
        <SimpleNumberInput min={0} max={100} bind:value={editorData.data.BaseContext.PlayerStateData.Energy} />
      </Field>
    </FieldGroup>
  </Fieldset>
  <Divider />
  <Fieldset>
    <Legend>{m.page_save_exosuit_currencies_title()}</Legend>
    <Text>{m.page_save_exosuit_currencies_description()}</Text>
    <FieldGroup class="lg:grid-cols-2 xl:grid-cols-3">
      <Field>
        <Label>{m.page_save_exosuit_currencies_units()}</Label>
        <InputGroup>
          <img src="/nms/textures/ui/frontend/icons/currency.units.png" aria-hidden="true" data-slot="icon" alt="" loading="lazy" decoding="async" />
          <SimpleNumberInput min={-1} bind:value={editorData.data.BaseContext.PlayerStateData.Units} />
        </InputGroup>
      </Field>
      <Field>
        <Label>{m.page_save_exosuit_currencies_nanites()}</Label>
        <InputGroup>
          <img src="/nms/textures/ui/frontend/icons/currency.nanites.png" aria-hidden="true" data-slot="icon" alt="" loading="lazy" decoding="async" />
          <SimpleNumberInput min={0} bind:value={editorData.data.BaseContext.PlayerStateData.Nanites} />
        </InputGroup>
      </Field>
      <Field>
        <Label>{m.page_save_exosuit_currencies_quicksilver()}</Label>
        <InputGroup>
          <img src="/nms/textures/ui/frontend/icons/currency.quicksilver.png" aria-hidden="true" data-slot="icon" alt="" loading="lazy" decoding="async" />
          <SimpleNumberInput min={0} bind:value={editorData.data.BaseContext.PlayerStateData.Specials} />
        </InputGroup>
      </Field>
    </FieldGroup>
  </Fieldset>
  <Divider />
  <Fieldset>
    <Legend>{m.page_save_exosuit_inventory_title()}</Legend>
    <Text>{m.page_save_exosuit_inventory_description()}</Text>
    <InventoryEditor bind:value={editorData.data.BaseContext.PlayerStateData.Inventory} type="cargo" />
  </Fieldset>
  <Divider />
  <Fieldset>
    <Legend>{m.page_save_exosuit_technology_title()}</Legend>
    <Text>{m.page_save_exosuit_technology_description()}</Text>
    <InventoryEditor bind:value={editorData.data.BaseContext.PlayerStateData.Inventory_TechOnly} type="tech" />
  </Fieldset>
</PageLayout>

<script lang="ts">
  import Field from '../../../components/ui/fieldset/Field.svelte';
  import FieldGroup from '../../../components/ui/fieldset/FieldGroup.svelte';
  import Fieldset from '../../../components/ui/fieldset/Fieldset.svelte';
  import Label from '../../../components/ui/fieldset/Label.svelte';
  import Divider from '../../../components/ui/divider/Divider.svelte';
  import PageLayout from '../../../components/ui/layout/PageLayout.svelte';
  import { initContext } from '../shared.svelte';
  import SimpleNumberInput from '../../../components/editors/input/SimpleNumberInput.svelte';
  import Heading from '../../../components/ui/heading/Heading.svelte';

  let editorData = initContext();

  let globalStats = editorData.data.BaseContext.PlayerStateData.Stats.find((e) => e.GroupId === '^GLOBAL_STATS').Stats;

  const getInt = (id: string) => {
    let value = globalStats.find((e) => e.Id === id).Value;
    return () => (value.IntValue ? value.IntValue : 0);
  };

  const setInt = (id: string) => {
    let value = globalStats.find((e) => e.Id === id).Value;
    return (v: number) => {
      if (value.IntValue) value.IntValue = v;
      else value = { IntValue: v };
    };
  };

  const getFloat = (id: string) => {
    let value = globalStats.find((e) => e.Id === id).Value;
    return () => (value.FloatValue ? value.FloatValue : 0);
  };

  const setFloat = (id: string) => {
    let value = globalStats.find((e) => e.Id === id).Value;
    return (v: number) => {
      if (value.FloatValue) value.FloatValue = v;
      else value = { FloatValue: v };
    };
  };
</script>

<PageLayout>
  <Fieldset>
    <Heading>Exploration Milestones</Heading>
    <FieldGroup class="lg:grid-cols-2 xl:grid-cols-5">
      <Field>
        <Label>Total Milestones</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^JM'), setInt('^JM')} />
      </Field>
      <Field>
        <Label>Alien Encounters</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^ALIENS_MET'), setInt('^ALIENS_MET')} />
      </Field>
      <Field>
        <Label>Words Collected</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^WORDS_LEARNT'), setInt('^WORDS_LEARNT')} />
      </Field>
      <Field>
        <Label>Space Exploration</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^DIST_WARP'), setInt('^DIST_WARP')} />
      </Field>
      <Field>
        <Label>Planetary Zoology</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^DISC_CREATURES'), setInt('^DISC_CREATURES')} />
      </Field>
    </FieldGroup>
  </Fieldset>
  <Divider soft />
  <Fieldset>
    <Heading>Survival Milestones</Heading>
    <FieldGroup class="lg:grid-cols-2 xl:grid-cols-5">
      <Field>
        <Label>On-foot Exploration</Label>
        <SimpleNumberInput float min={0} bind:value={getFloat('^DIST_WALKED'), setFloat('^DIST_WALKED')} />
      </Field>
      <Field>
        <Label>Extreme Survival</Label>
        <SimpleNumberInput float min={0} bind:value={getFloat('^LONGEST_LIFE_EX'), setFloat('^LONGEST_LIFE_EX')} />
      </Field>
      <Field>
        <Label>Sentinels Destroyed</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^SENTINEL_KILLS'), setInt('^SENTINEL_KILLS')} />
      </Field>
      <Field>
        <Label>Units Accrued</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^MONEY'), setInt('^MONEY')} />
      </Field>
      <Field>
        <Label>Ships Destroyed</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^ENEMIES_KILLED'), setInt('^ENEMIES_KILLED')} />
      </Field>
    </FieldGroup>
  </Fieldset>
  <Divider soft />
  <Fieldset>
    <Heading>Previous Expeditions</Heading>
  </Fieldset>
  <Divider />
  <Fieldset>
    <Heading>The Gek</Heading>
    <FieldGroup class="lg:grid-cols-2 xl:grid-cols-5">
      <Field>
        <Label>Standing</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^TRA_STANDING'), setInt('^TRA_STANDING')} />
      </Field>
      <Field>
        <Label>Missions Completed</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^TDONE_MISSIONS'), setInt('^TDONE_MISSIONS')} />
      </Field>
      <Field>
        <Label>Words Learned</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^TWORDS_LEARNT'), setInt('^TWORDS_LEARNT')} />
      </Field>
      <Field>
        <Label>Systems Visited</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^TSEEN_SYSTEMS'), setInt('^TSEEN_SYSTEMS')} />
      </Field>
      <Field>
        <Label>Smuggling Run</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^SMUGGLE_VALUE'), setInt('^SMUGGLE_VALUE')} />
      </Field>
    </FieldGroup>
  </Fieldset>
  <Divider soft />
  <Fieldset>
    <Heading>The Vy'keen</Heading>
    <FieldGroup class="lg:grid-cols-2 xl:grid-cols-5">
      <Field>
        <Label>Standing</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^WAR_STANDING'), setInt('^WAR_STANDING')} />
      </Field>
      <Field>
        <Label>Missions Completed</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^WDONE_MISSIONS'), setInt('^WDONE_MISSIONS')} />
      </Field>
      <Field>
        <Label>Words Learned</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^WWORDS_LEARNT'), setInt('^WWORDS_LEARNT')} />
      </Field>
      <Field>
        <Label>Systems Visited</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^WSEEN_SYSTEMS'), setInt('^WSEEN_SYSTEMS')} />
      </Field>
      <Field>
        <Label>Walkers Destroyed</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^WALKERS_KILLED'), setInt('^WALKERS_KILLED')} />
      </Field>
    </FieldGroup>
  </Fieldset>
  <Divider soft />
  <Fieldset>
    <Heading>The Korvax</Heading>
    <FieldGroup class="lg:grid-cols-2 xl:grid-cols-5">
      <Field>
        <Label>Standing</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^EXP_STANDING'), setInt('^EXP_STANDING')} />
      </Field>
      <Field>
        <Label>Missions Completed</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^EDONE_MISSIONS'), setInt('^EDONE_MISSIONS')} />
      </Field>
      <Field>
        <Label>Words Learned</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^EWORDS_LEARNT'), setInt('^EWORDS_LEARNT')} />
      </Field>
      <Field>
        <Label>Systems Visited</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^ESEEN_SYSTEMS'), setInt('^ESEEN_SYSTEMS')} />
      </Field>
      <Field>
        <Label>Nanite Clusters</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^NANITES_EVER'), setInt('^NANITES_EVER')} />
      </Field>
    </FieldGroup>
  </Fieldset>
  <Divider />
  <Fieldset>
    <Heading>Merchants Guild</Heading>
    <FieldGroup class="lg:grid-cols-2 xl:grid-cols-5">
      <Field>
        <Label>Standing</Label>
      </Field>
      <Field>
        <Label>Missions Completed</Label>
      </Field>
      <Field>
        <Label>Units Earned</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^MONEY'), setInt('^MONEY')} />
      </Field>
      <Field>
        <Label>Plants Farmed</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^PLANTS_PLANTED'), setInt('^PLANTS_PLANTED')} />
      </Field>
      <Field>
        <Label>Rare Treasures</Label>
      </Field>
    </FieldGroup>
  </Fieldset>
  <Divider soft />
  <Fieldset>
    <Heading>Mercenaries Guild</Heading>
    <FieldGroup class="lg:grid-cols-2 xl:grid-cols-5">
      <Field>
        <Label>Standing</Label>
      </Field>
      <Field>
        <Label>Missions Completed</Label>
      </Field>
      <Field>
        <Label>Sentinels Destroyed</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^SENTINEL_KILLS'), setInt('^SENTINEL_KILLS')} />
      </Field>
      <Field>
        <Label>Pirates Killed</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^PIRATES_KILLED'), setInt('^PIRATES_KILLED')} />
      </Field>
      <Field>
        <Label>Horrors Eliminated</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^FIENDS_KILLED'), setInt('^FIENDS_KILLED')} />
      </Field>
    </FieldGroup>
  </Fieldset>
  <Divider soft />
  <Fieldset>
    <Heading>Explorers Guild</Heading>
    <FieldGroup class="lg:grid-cols-2 xl:grid-cols-5">
      <Field>
        <Label>Standing</Label>
      </Field>
      <Field>
        <Label>Missions Completed</Label>
      </Field>
      <Field>
        <Label>Rare Fauna Scanned</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^RARE_SCANNED'), setInt('^RARE_SCANNED')} />
      </Field>
      <Field>
        <Label>Systems Mapped</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^DIST_WARP'), setInt('^DIST_WARP')} />
      </Field>
      <Field>
        <Label>Plants Catalogued</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^DISC_FLORA'), setInt('^DISC_FLORA')} />
      </Field>
    </FieldGroup>
  </Fieldset>
  <Divider soft />
  <Fieldset>
    <Heading>Outlaws</Heading>
    <FieldGroup class="lg:grid-cols-2 xl:grid-cols-5">
      <Field>
        <Label>Standing</Label>
      </Field>
      <Field>
        <Label>Missions Completed</Label>
      </Field>
      <Field>
        <Label>Smuggling Run</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^SMUGGLE_VALUE'), setInt('^SMUGGLE_VALUE')} />
      </Field>
      <Field>
        <Label>Bounties Completed</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^BOUNTIES'), setInt('^BOUNTIES')} />
      </Field>
      <Field>
        <Label>Freighters Plundered</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^FPODS_BROKEN'), setInt('^FPODS_BROKEN')} />
      </Field>
    </FieldGroup>
  </Fieldset>
  <Divider soft />
  <Fieldset>
    <Heading>The Autophage</Heading>
    <FieldGroup class="lg:grid-cols-2 xl:grid-cols-5">
      <Field>
        <Label>Standing</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^BUI_STANDING'), setInt('^BUI_STANDING')} />
      </Field>
      <Field>
        <Label>Missions Completed</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^BDONE_MISSIONS'), setInt('^BDONE_MISSIONS')} />
      </Field>
      <Field>
        <Label>Words learnt</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^BWORDS_LEARNT'), setInt('^BWORDS_LEARNT')} />
      </Field>
      <Field>
        <Label>Radiant Shards</Label>
        <SimpleNumberInput min={0} bind:value={getInt('^DRONE_SHARDS'), setInt('^DRONE_SHARDS')} />
      </Field>
      <Field>
        <Label>Autophage Salvage</Label>
      </Field>
    </FieldGroup>
  </Fieldset>
</PageLayout>

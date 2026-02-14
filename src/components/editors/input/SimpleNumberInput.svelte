<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements';
  import Input from '../../ui/input/Input.svelte';
  import ErrorMessage from '../../ui/fieldset/ErrorMessage.svelte';
  import { m } from '$lib/paraglide/messages';

  type InputProps = {
    class?: string;
    value?: number;
    float?: boolean;
  } & Omit<SvelteHTMLElements['input'], 'class' | 'type' | 'value'>;

  let { class: className = '', value = $bindable(), float = false, ...props }: InputProps = $props();

  let error: string | null = $state(null);

  let rawValue: string = $state(value!.toString());

  let minValue = props.min != undefined ? Number.parseFloat(props.min.toString()) : undefined;
  let maxValue = props.max != undefined ? Number.parseFloat(props.max.toString()) : undefined;

  function recalc() {
    // Try convert to a number
    let numValue: number = Number.parseFloat(rawValue);
    if (isNaN(numValue) || (!float && !Number.isInteger(numValue))) {
      error = m.component_simplenumberinput_error_invalid();
      return;
    }

    if (minValue != undefined && numValue < minValue) {
      error = m.component_simplenumberinput_error_min({ min: minValue });
    } else if (maxValue != undefined && numValue > maxValue) {
      error = m.component_simplenumberinput_error_max({ max: maxValue });
    } else {
      error = null;
      value = numValue;
    }
  }
</script>

<Input type="number" class={className} bind:value={rawValue} {...props} aria-invalid={error != null} onchange={recalc} />
{#if error}
  <ErrorMessage>{error}</ErrorMessage>
{/if}

<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements';
  import Input from '../../ui/input/Input.svelte';
  import ErrorMessage from '../../ui/fieldset/ErrorMessage.svelte';

  type InputProps = {
    class?: string;
    value?: number;
  } & Omit<SvelteHTMLElements['input'], 'class' | 'type' | 'value'>;

  let { class: className = '', value = $bindable(), ...props }: InputProps = $props();

  let error: string | null = $state(null);

  let rawValue: string = $state(value!.toString());

  let minValue = props.min != undefined ? Number.parseInt(props.min.toString()) : undefined;
  let maxValue = props.max != undefined ? Number.parseInt(props.max.toString()) : undefined;

  function recalc() {
    // Try convert to a number
    let numValue: number = Number.parseInt(rawValue);
    if (isNaN(numValue)) {
      error = 'The number is invalid';
      return;
    }

    if (minValue != undefined && numValue < minValue) {
      error = 'The number must be >= ' + minValue;
    } else if (maxValue != undefined && numValue > maxValue) {
      error = 'The number must be <= ' + maxValue;
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

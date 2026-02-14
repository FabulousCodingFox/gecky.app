<script lang="ts">
  import type { SvelteHTMLElements } from 'svelte/elements';
  import Input from '../../ui/input/Input.svelte';
  import ErrorMessage from '../../ui/fieldset/ErrorMessage.svelte';
  import { m } from '$lib/paraglide/messages';

  type InputProps = {
    class?: string;
    value?: string;
  } & Omit<SvelteHTMLElements['input'], 'class' | 'type' | 'value'>;

  let { class: className = '', value = $bindable(), ...props }: InputProps = $props();

  let error: string | null = $state(null);

  let rawValue: string = $state(value!);

  let minLength = props.minlength != undefined ? Number.parseInt(props.minlength.toString()) : undefined;
  let maxLength = props.maxlength != undefined ? Number.parseInt(props.maxlength.toString()) : undefined;

  function recalc() {
    console.log(minLength);
    if (minLength != undefined && rawValue.length < minLength) {
      error = m.component_simpletextinput_error_min({ min: minLength });
    } else if (maxLength != undefined && rawValue.length > maxLength) {
      error = m.component_simpletextinput_error_max({ max: maxLength });
    } else if (props.pattern != undefined && !rawValue.match(props.pattern)) {
      error = m.component_simpletextinput_error_pattern({ pattern: props.pattern });
    } else {
      error = null;
      value = rawValue;
    }
  }
</script>

<Input type="text" class={className} bind:value={rawValue} {...props} aria-invalid={error != null} onchange={recalc} />
{#if error}
  <ErrorMessage>{error}</ErrorMessage>
{/if}

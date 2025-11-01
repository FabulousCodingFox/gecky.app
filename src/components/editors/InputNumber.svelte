<script lang="ts">
  type Props = {
    value: number;
    label: string;
    max?: number | null;
    min?: number | null;
  };

  let { value = $bindable(), label, max = null, min = null }: Props = $props();
</script>

<div>
  <label class="block text-sm/6 font-medium text-gray-900 dark:text-white">{label}</label>
  <div class="mt-2">
    <input
      bind:value
      type="number"
      {max}
      {min}
      class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-600 sm:text-sm/6 dark:bg-white/5 dark:text-white dark:outline-white/10 dark:placeholder:text-gray-500 dark:focus:outline-primary-500"
    />
  </div>
</div>

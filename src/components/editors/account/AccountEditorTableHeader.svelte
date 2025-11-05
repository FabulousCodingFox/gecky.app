<script lang="ts">
  let { name, selected, total }: { name: string; selected: number; total: number } = $props();
</script>

<div class="flex items-center justify-between rounded-lg bg-gray-100 px-4 py-2 dark:bg-gray-800/50">
  <div class="flex items-center space-x-4">
    <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
      {name}
    </span>
    <span class="text-xs text-gray-500 dark:text-gray-400">
      {selected} / {total}
    </span>
  </div>
  <div class="flex items-center space-x-2">
    <div class="h-2 w-24 rounded-full bg-gray-200 dark:bg-gray-700">
      <div class="h-2 rounded-full bg-primary-600 transition-all duration-300 ease-in-out" style="width: {total > 0 ? (selected / total) * 100 : 0}%" aria-hidden="true"></div>
    </div>
    <span class="text-xs font-medium text-gray-600 dark:text-gray-400">
      {total > 0 ? Math.round((selected / total) * 100) : 0}%
    </span>
  </div>
</div>

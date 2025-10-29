<script lang="ts">
  import CodeBracketIcon from '@iconify-svelte/heroicons/code-bracket-20-solid';
  import ComputerDesktopIcon from '@iconify-svelte/heroicons/computer-desktop-20-solid';
  import LockClosedIcon from '@iconify-svelte/heroicons/lock-closed-20-solid';
  import { m } from '$lib/paraglide/messages';

  const features = [
    {
      name: m.page_home_feature_opensource_title(),
      description: m.page_home_feature_opensource_description(),
      icon: CodeBracketIcon
    },
    {
      name: m.page_home_feature_local_title(),
      description: m.page_home_feature_local_description(),
      icon: LockClosedIcon
    },
    {
      name: m.page_home_feature_ui_title(),
      description: m.page_home_feature_ui_description(),
      icon: ComputerDesktopIcon
    }
  ];
</script>

<div class="overflow-hidden py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
      <div class="lg:pt-4 lg:pr-8">
        <div class="lg:max-w-lg">
          <p class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-gray-900 sm:text-5xl dark:text-white">{m.page_home_hero_title()}</p>
          <p class="mt-6 text-lg/8 text-gray-700 dark:text-gray-300">{m.page_home_hero_description()}</p>
          <dl class="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none dark:text-gray-400">
            {#each features as feature}
              <div class="relative pl-9">
                <dt class="inline font-semibold text-gray-900 dark:text-white">
                  <feature.icon class="absolute top-1 left-1 size-5 text-indigo-600 dark:text-indigo-400" width="20" height="20" />
                  {feature.name}
                </dt>
                <dd class="inline">{feature.description}</dd>
              </div>
            {/each}
          </dl>
        </div>
      </div>
      <enhanced:img src="$lib/assets/app_screenshot.png?enhanced" sizes="min(5760px, 50vw)" fetchpriority="high" class="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-228 md:-ml-4 lg:-ml-0" />
    </div>
  </div>
</div>

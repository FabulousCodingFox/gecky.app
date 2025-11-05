<script lang="ts">
  import Sidebar from '../../components/Sidebar.svelte';
  import HomeIcon from '@iconify-svelte/heroicons/home';
  import CodeBracketIcon from '@iconify-svelte/heroicons/code-bracket';
  import UserIcon from '@iconify-svelte/heroicons/user';
  import { initContext } from './shared.svelte';

  let editorData = initContext();

  let { children } = $props();

  let sidebar: { name: string; href: string; icon: any | null }[] = $derived(
    editorData.data
      ? [
          { name: 'Start', href: '/save/', icon: HomeIcon },
          { name: 'Exosuit', href: '/save/exosuit/', icon: UserIcon },
          { name: 'JSON Editor', href: '/save/json/', icon: CodeBracketIcon }
        ]
      : [{ name: 'Start', href: '/save/', icon: HomeIcon }]
  );
</script>

<Sidebar data={sidebar} />

<main class="size-full lg:pl-72">
  {@render children?.()}
</main>

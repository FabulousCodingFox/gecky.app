<script lang="ts">
  import { AutoLayout, createLayout } from 'animejs';
  import { NavigationMenu, type NavigationMenuListProps } from 'bits-ui';
  import { clsx } from 'clsx';
  import { onMount, type Snippet } from 'svelte';

  let { children, class: className = '', ...props }: { children?: Snippet; class?: string } & Omit<NavigationMenuListProps, 'class'> = $props();

  let element: HTMLUListElement = $state(null!);
  let layout: AutoLayout = null!;

  onMount(() => {
    layout = createLayout(element, {
      ease: 'outBack'
    });

    const observer = new MutationObserver((mutations) =>
      mutations.forEach((m) => {
        if (m.type === 'attributes' && m.attributeName === 'data-current') {
          const target = m.target as HTMLElement;
          if (target.dataset.current !== 'true') return;
          layout.update(({ root }) => {
            target.appendChild(root.querySelector('[data-slot=indicator]')!);
          });
        }
      })
    );

    observer.observe(element, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-current']
    });

    element.querySelector('[data-current=true]')?.parentElement!.insertAdjacentHTML('afterbegin', `<span class="absolute inset-y-2 -left-4 w-0.5 rounded-full bg-zinc-950 dark:bg-white" data-slot="indicator"></span>`);

    return () => observer.disconnect();
  });
</script>

<NavigationMenu.List {...props} bind:ref={element} class={clsx('flex flex-col gap-0.5', className)} data-slot="section">{@render children?.()}</NavigationMenu.List>

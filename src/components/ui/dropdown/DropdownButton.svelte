<script lang="ts">
  import { DropdownMenu } from 'bits-ui';
  import TouchTarget from '../button/TouchTarget.svelte';
  import clsx from 'clsx';
  import { styles } from '../button/buttonStyles';
  import type { Snippet } from 'svelte';

  type ButtonProps = {
    children?: Snippet;
    color?: keyof typeof styles.colors;
    outline?: boolean;
    plain?: boolean;
    class?: string;
  } & Omit<DropdownMenu.TriggerProps, 'class'>;

  let { children, color = 'dark/zinc', outline = false, plain = false, class: className = '', ...props }: ButtonProps = $props();
</script>

<DropdownMenu.Trigger class={clsx(clsx(styles.base, outline ? styles.outline : plain ? styles.plain : clsx(styles.solid, styles.colors[color])), className)} {...props}>
  <TouchTarget>{@render children?.()}</TouchTarget>
</DropdownMenu.Trigger>

<script lang="ts">
  import { Button } from 'bits-ui';
  import { clsx } from 'clsx';
  import type { Snippet } from 'svelte';
  import TouchTarget from './TouchTarget.svelte';
  import { styles } from './buttonStyles';

  type ButtonProps = {
    children?: Snippet;
    color?: keyof typeof styles.colors;
    outline?: boolean;
    plain?: boolean;
    class?: string;
  } & Omit<Button.RootProps, 'class'>;

  let { children, color = 'dark/zinc', outline = false, plain = false, class: className = '', ...props }: ButtonProps = $props();
</script>

<Button.Root class={clsx(clsx(styles.base, outline ? styles.outline : plain ? styles.plain : clsx(styles.solid, styles.colors[color])), className)} {...props}>
  <TouchTarget>{@render children?.()}</TouchTarget>
</Button.Root>

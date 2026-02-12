import clsx from 'clsx';

export const sharedClasses = clsx(
  // Base
  'flex min-w-0 items-center',
  // Icons
  '*:data-[slot=icon]:size-5 *:data-[slot=icon]:shrink-0 sm:*:data-[slot=icon]:size-4',
  '*:data-[slot=icon]:text-zinc-500 group-data-highlighted/option:*:data-[slot=icon]:text-white dark:*:data-[slot=icon]:text-zinc-400',
  'forced-colors:*:data-[slot=icon]:text-[CanvasText] forced-colors:group-data-highlighted/option:*:data-[slot=icon]:text-[Canvas]',
  // Avatars
  '*:data-[slot=avatar]:-mx-0.5 *:data-[slot=avatar]:size-6 sm:*:data-[slot=avatar]:size-5'
);

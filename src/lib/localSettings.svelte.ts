import { browser } from '$app/environment';
import type { Language, LocalSettingsStore, Theme } from '$lib';
import { getContext, setContext } from 'svelte';
import { setLocale } from './paraglide/runtime';

function getInitialTheme(): Theme {
  if (!browser) return 'light';
  const storedTheme = localStorage.getItem('theme') as Theme | null;
  return storedTheme === 'dark' ? 'dark' : 'light';
}

function getInitialLanguage(): Language {
  if (!browser) return 'en';
  const storedLang = localStorage.getItem('language');
  if (storedLang === 'de' || storedLang === 'en' || storedLang === 'es') return storedLang;
  return 'en';
}

export function createLocalSettingsStore() {
  const localSettings = $state<LocalSettingsStore>({
    theme: getInitialTheme(),
    language: getInitialLanguage()
  });

  setContext('localSettings', localSettings);

  $effect(() => {
    if (!browser) return;
    localStorage.setItem('theme', localSettings.theme);
    document.documentElement.classList.toggle('dark', localSettings.theme === 'dark');
    document.documentElement.classList.toggle('light', localSettings.theme === 'light');
  });

  $effect(() => {
    if (!browser) return;
    localStorage.setItem('language', localSettings.language);
    setLocale(localSettings.language);
  });
}

export function apply() {
  if (!browser) return;
  const ctx = getContext<LocalSettingsStore>('localSettings');
  document.documentElement.classList.toggle('dark', ctx.theme === 'dark');
  document.documentElement.classList.toggle('light', ctx.theme === 'light');
  setLocale(ctx.language);
}

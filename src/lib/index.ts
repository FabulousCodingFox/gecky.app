import { m } from './paraglide/messages';
import flag_de from '$lib/assets/flags/flag_de.png?enhanced&w=32';
import flag_en from '$lib/assets/flags/flag_en.png?enhanced&w=32';
import flag_es from '$lib/assets/flags/flag_es.png?enhanced&w=32';
import MoonIcon from '@iconify-svelte/heroicons/moon';
import SunIcon from '@iconify-svelte/heroicons/sun';
import type { Snippet } from 'svelte';

export type Theme = 'light' | 'dark';

export type Language = 'en' | 'de' | 'es';

export type LocalSettingsStore = {
  theme: Theme;
  language: Language;
};

export type LanguageMeta = {
  id: Language;
  name: string;
  flag: string;
  browser_locale: Intl.LocalesArgument;
};

export type ThemeMeta = {
  id: Theme;
  name: string;
  icon: typeof MoonIcon;
};

export const languages: Record<Language, LanguageMeta> = {
  en: { id: 'en', name: m.lang_en(), flag: flag_en, browser_locale: 'en-US' },
  de: { id: 'de', name: m.lang_de(), flag: flag_de, browser_locale: 'de-DE' },
  es: { id: 'es', name: m.lang_es(), flag: flag_es, browser_locale: 'es-ES' }
};

export const themes: Record<Theme, ThemeMeta> = {
  light: { id: 'light', name: m.theme_light(), icon: SunIcon },
  dark: { id: 'dark', name: m.theme_dark(), icon: MoonIcon }
};

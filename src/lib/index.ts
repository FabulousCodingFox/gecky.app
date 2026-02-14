import { m } from './paraglide/messages';
import flag_de from '@iconify-svelte/circle-flags/de';
import flag_en from '@iconify-svelte/circle-flags/en';
import flag_es from '@iconify-svelte/circle-flags/es';
import MoonIcon from '@iconify-svelte/heroicons/moon-20-solid';
import SunIcon from '@iconify-svelte/heroicons/sun-20-solid';

export type Theme = 'light' | 'dark';

export type Language = 'en' | 'de' | 'es';

export type LocalSettingsStore = {
  theme: Theme;
  language: Language;
};

export type LanguageMeta = {
  id: Language;
  name: string;
  icon: typeof flag_de;
  browser_locale: Intl.LocalesArgument;
};

export type ThemeMeta = {
  id: Theme;
  name: string;
  icon: typeof MoonIcon;
};

export const languages: Record<Language, LanguageMeta> = {
  en: { id: 'en', name: m.lang_en(), icon: flag_en, browser_locale: 'en-US' },
  de: { id: 'de', name: m.lang_de(), icon: flag_de, browser_locale: 'de-DE' },
  es: { id: 'es', name: m.lang_es(), icon: flag_es, browser_locale: 'es-ES' }
};

export const themes: Record<Theme, ThemeMeta> = {
  light: { id: 'light', name: m.theme_light(), icon: SunIcon },
  dark: { id: 'dark', name: m.theme_dark(), icon: MoonIcon }
};

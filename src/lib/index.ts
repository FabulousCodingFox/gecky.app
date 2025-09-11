import { m } from './paraglide/messages';
import flag_de from '$lib/assets/flags/flag_de.png';
import flag_en from '$lib/assets/flags/flag_en.png';
import flag_es from '$lib/assets/flags/flag_es.png';
import { Moon, Sun } from '@steeze-ui/heroicons';
import type { IconSource } from '@steeze-ui/svelte-icon';

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
};

export type ThemeMeta = {
  id: Theme;
  name: string;
  icon: IconSource;
};

export const languages: Record<Language, LanguageMeta> = {
  en: { id: 'en', name: m.language_en(), flag: flag_en },
  de: { id: 'de', name: m.language_de(), flag: flag_de },
  es: { id: 'es', name: m.language_es(), flag: flag_es }
};

export const themes: Record<Theme, ThemeMeta> = {
  light: { id: 'light', name: m.theme_light(), icon: Sun },
  dark: { id: 'dark', name: m.theme_dark(), icon: Moon }
};

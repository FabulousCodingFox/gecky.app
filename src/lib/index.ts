import { m } from './paraglide/messages';

export type Theme = 'light' | 'dark';

export type Language = 'en' | 'de';

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
  icon: string;
};

export const languages: Record<Language, LanguageMeta> = {
  en: { id: 'en', name: m.language_en(), flag: '🇬🇧' },
  de: { id: 'de', name: m.language_de(), flag: '🇩🇪' }
};

export const themes: Record<Theme, ThemeMeta> = {
  light: { id: 'light', name: m.theme_light(), icon: '🌞' },
  dark: { id: 'dark', name: m.theme_dark(), icon: '🌜' }
};

import { WIDGET_DEFAULT_LANGUAGE } from '../widgetConfig.js';

const STORAGE_KEY = 'reih-widget-active-language';

export function readPersistedWidgetLanguage() {
  try {
    if (typeof window === 'undefined') return WIDGET_DEFAULT_LANGUAGE;
    return window.localStorage.getItem(STORAGE_KEY) ?? WIDGET_DEFAULT_LANGUAGE;
  } catch {
    return WIDGET_DEFAULT_LANGUAGE;
  }
}

export function writePersistedWidgetLanguage(languageCode) {
  try {
    window.localStorage.setItem(STORAGE_KEY, languageCode);
  } catch {
    // private mode — in-memory value still applies for this session
  }
}

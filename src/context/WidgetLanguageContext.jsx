import { createContext, useCallback, useMemo, useState } from 'react';
import { normalizeWidgetLanguage } from '../widgetConfig.js';
import {
  readPersistedWidgetLanguage,
  writePersistedWidgetLanguage,
} from '../lib/widgetLanguageStorage.js';

export const WidgetLanguageContext = createContext(null);

/** Active widget iframe locale (pl-PL | en-US); persisted for staging QA. */
export function WidgetLanguageProvider({ children }) {
  const [activeLanguage, setActiveLanguageState] = useState(() =>
    normalizeWidgetLanguage(readPersistedWidgetLanguage()),
  );

  const setActiveLanguage = useCallback((nextLanguage) => {
    const normalized = normalizeWidgetLanguage(nextLanguage);
    setActiveLanguageState(normalized);
    writePersistedWidgetLanguage(normalized);
  }, []);

  const value = useMemo(
    () => ({ activeLanguage, setActiveLanguage }),
    [activeLanguage, setActiveLanguage],
  );

  return (
    <WidgetLanguageContext.Provider value={value}>
      {children}
    </WidgetLanguageContext.Provider>
  );
}

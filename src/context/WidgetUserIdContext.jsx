import { createContext, useCallback, useMemo, useState } from 'react';
import {
  readPersistedUserId,
  writePersistedUserId,
} from '../lib/widgetUserIdStorage.js';
import { WIDGET_USER_ID } from '../widgetEnv.js';

export const WidgetUserIdContext = createContext(null);

/** Committed user_id for widget API calls; restored from localStorage after refresh. */
export function WidgetUserIdProvider({ children }) {
  const [activeUserId, setActiveUserId] = useState(() =>
    readPersistedUserId(WIDGET_USER_ID),
  );

  const applyUserId = useCallback((nextUserId) => {
    const trimmed = nextUserId.trim();
    setActiveUserId(trimmed);
    writePersistedUserId(trimmed);
  }, []);

  const value = useMemo(
    () => ({ activeUserId, applyUserId }),
    [activeUserId, applyUserId],
  );

  return (
    <WidgetUserIdContext.Provider value={value}>{children}</WidgetUserIdContext.Provider>
  );
}

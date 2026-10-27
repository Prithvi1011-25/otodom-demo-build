const STORAGE_KEY = 'reih-widget-active-user-id';
const APPLIED_KEY = 'reih-widget-user-id-applied';

export function hasPersistedUserIdPreference() {
  try {
    if (typeof window === 'undefined') return false;
    return window.localStorage.getItem(APPLIED_KEY) === '1';
  } catch {
    return false;
  }
}

/** Restores last applied user_id; uses fallback only before the user has ever clicked Apply. */
export function readPersistedUserId(fallbackUserId) {
  try {
    if (typeof window === 'undefined') return fallbackUserId;
    if (!hasPersistedUserIdPreference()) return fallbackUserId;

    const stored = window.localStorage.getItem(STORAGE_KEY);
    // Applied anonymous (empty) is stored as '' — do not substitute the demo default.
    return stored ?? '';
  } catch {
    return fallbackUserId;
  }
}

export function writePersistedUserId(userId) {
  try {
    window.localStorage.setItem(STORAGE_KEY, userId);
    window.localStorage.setItem(APPLIED_KEY, '1');
  } catch {
    // private mode / quota — in-memory value still applies for this session
  }
}

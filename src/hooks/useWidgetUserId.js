import { useContext } from 'react';
import { WidgetUserIdContext } from '../context/WidgetUserIdContext.jsx';

export function useWidgetUserId() {
  const context = useContext(WidgetUserIdContext);
  if (!context) {
    throw new Error('useWidgetUserId must be used within WidgetUserIdProvider');
  }
  return context;
}

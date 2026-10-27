import { useContext } from 'react';
import { WidgetLanguageContext } from '../context/WidgetLanguageContext.jsx';

export function useWidgetLanguage() {
  const context = useContext(WidgetLanguageContext);
  if (!context) {
    throw new Error('useWidgetLanguage must be used within WidgetLanguageProvider');
  }
  return context;
}

import { buildWidgetLanguage } from '../widgetConfig.js';
import { useWidgetLanguage } from '../hooks/useWidgetLanguage.js';

const LANGUAGE_OPTIONS = buildWidgetLanguage();

export function WidgetLanguageControl() {
  const { activeLanguage, setActiveLanguage } = useWidgetLanguage();

  return (
    <div className="widget-identity__row">
      <label className="widget-identity__label" htmlFor="widget-language-select">
        iframe language
      </label>
      <select
        id="widget-language-select"
        className="widget-identity__select"
        value={activeLanguage}
        onChange={(event) => setActiveLanguage(event.target.value)}
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.code} value={option.code}>
            {option.nativeName} ({option.code})
          </option>
        ))}
      </select>
    </div>
  );
}

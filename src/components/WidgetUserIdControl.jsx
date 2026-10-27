import { useEffect, useState } from 'react';
import { useWidgetUserId } from '../hooks/useWidgetUserId.js';
import { WidgetLanguageControl } from './WidgetLanguageControl.jsx';

export function WidgetUserIdControl({ listingId = '' }) {
  const { activeUserId, applyUserId } = useWidgetUserId();
  const [draftUserId, setDraftUserId] = useState(activeUserId);

  useEffect(() => {
    setDraftUserId(activeUserId);
  }, [activeUserId]);

  const trimmedDraft = draftUserId.trim();
  const canApply = trimmedDraft !== activeUserId;

  return (
    <div className="widget-identity">
      <WidgetLanguageControl />
      <div className="widget-identity__row">
        <span className="widget-identity__label">listing_id</span>
        <code className="widget-identity__listing">{listingId || '—'}</code>
      </div>
      <div className="widget-identity__row widget-identity__row--user">
        <label className="widget-identity__label" htmlFor="widget-user-id-input">
          user_id
        </label>
        <input
          id="widget-user-id-input"
          className="widget-identity__input"
          type="text"
          value={draftUserId}
          autoComplete="off"
          spellCheck={false}
          placeholder="Leave empty for anonymous"
          onChange={(event) => setDraftUserId(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && canApply) {
              event.preventDefault();
              applyUserId(trimmedDraft);
            }
          }}
        />
        <button
          type="button"
          className="widget-identity__apply"
          disabled={!canApply}
          onClick={() => applyUserId(trimmedDraft)}
        >
          Apply
        </button>
      </div>
    </div>
  );
}

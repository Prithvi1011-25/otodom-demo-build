import { IntegrationTabs } from './IntegrationTabs.jsx';
import { resolveWidgetListingId } from '../widgetConfig.js';
import { WidgetUserIdControl } from './WidgetUserIdControl.jsx';

export function IntegrationToolbar({ slug, active, listing }) {
  const listingId = resolveWidgetListingId(listing);

  return (
    <div className="integration-toolbar">
      <IntegrationTabs slug={slug} active={active} />
      <WidgetUserIdControl listingId={listingId} />
    </div>
  );
}

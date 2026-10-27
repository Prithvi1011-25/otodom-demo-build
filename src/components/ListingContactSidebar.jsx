import { ListingContactForm } from './ListingContactForm.jsx';

export function ListingContactSidebar({ listing }) {
  return (
    <aside className="ad-sidebar">
      <div className="ad-sidebar__card">
        <ListingContactForm listing={listing} />
      </div>
    </aside>
  );
}

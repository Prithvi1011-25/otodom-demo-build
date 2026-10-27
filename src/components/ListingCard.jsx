import { Link } from 'react-router-dom';
import { ImagePlaceholder } from './ImagePlaceholder.jsx';

export function ListingCard({ listing }) {
  const hero = listing.media[0];

  return (
    <Link to={`/listing/${listing.slug}`} className="listing-card">
      <div className="listing-card__media">
        {hero?.image_url ? (
          <img src={hero.image_url} alt={listing.title} />
        ) : (
          <ImagePlaceholder label={hero?.label ?? 'Main photo'} />
        )}
      </div>

      <div className="listing-card__body">
        <p className="listing-card__meta">
          {listing.offerType} · Listing {listing.id}
        </p>
        <h2 className="listing-card__title">{listing.title}</h2>
        <p className="listing-card__address">{listing.address}</p>
        <div className="listing-card__footer">
          <span className="listing-card__price">{listing.price} PLN</span>
          <span className="listing-card__details">
            {listing.details.rooms} bed. · {listing.details.area}
          </span>
        </div>
      </div>
    </Link>
  );
}

import { Link } from 'react-router-dom';
import { ImagePlaceholder } from './ImagePlaceholder.jsx';

function formatPlnPrice(price) {
  const value = Number(String(price).replace(/[\s,]/g, ''));
  if (Number.isNaN(value)) return `${price} zł`;
  return `${value.toLocaleString('pl-PL').replace(/\u00a0/g, ' ')} zł`;
}

function getPromotedLocation(listing) {
  const parts = listing.breadcrumbs?.slice(3);
  if (parts?.length) {
    return parts.join(', ');
  }

  return listing.address;
}

function getPromotedSeller(listing) {
  return { name: null, type: 'Oferta prywatna' };
}

function PromotedCard({ listing }) {
  const hero = listing.media[0];
  const seller = getPromotedSeller(listing);

  return (
    <Link to={`/listing/${listing.slug}`} className="promoted-card">
      <div className="promoted-card__media">
        {hero?.image_url ? (
          <img src={hero.image_url} alt={listing.title} loading="lazy" />
        ) : (
          <ImagePlaceholder label={hero?.label ?? 'Zdjęcie główne'} />
        )}
      </div>

      <div className="promoted-card__body">
        <p className="promoted-card__price">{formatPlnPrice(listing.price)}</p>
        <p className="promoted-card__location">{getPromotedLocation(listing)}</p>
        <p className="promoted-card__seller">
          {seller.name ? (
            <>
              <span>{seller.name}</span>
              <span className="promoted-card__seller-type">{seller.type}</span>
            </>
          ) : (
            <span className="promoted-card__seller-type promoted-card__seller-type--solo">
              {seller.type}
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}

export function PromotedAds({ listings }) {
  const promoted = listings.slice(0, 8);

  return (
    <section className="promoted-ads">
      <div className="promoted-ads__inner home-page-frame">
        <div className="promoted-ads__header">
          <div className="promoted-ads__title-row">
            <h2>Promowane ogłoszenia</h2>
            <Link to="/" className="promoted-ads__view-all promoted-ads__view-all--inline">
              Zobacz Wszystkie
            </Link>
          </div>
        </div>

        <div className="promoted-ads__track">
          {promoted.map((listing) => (
            <PromotedCard key={listing.id} listing={listing} />
          ))}
        </div>

        <Link to="/" className="promoted-ads__view-all promoted-ads__view-all--below">
          Zobacz Wszystkie
        </Link>
      </div>
    </section>
  );
}

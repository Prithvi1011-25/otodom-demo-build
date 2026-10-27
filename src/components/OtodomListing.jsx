import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AgencyBar } from './AgencyBar.jsx';
import { GalleryPhoto } from './GalleryPhoto.jsx';
import { ListingContactSidebar } from './ListingContactSidebar.jsx';
import {
  CheckIcon,
  ChevronDownIcon,
  LocationIcon,
  MoreInfoIcon,
} from './listingIcons.jsx';
import { getWidgetHostCssVars } from '../widgetConfig.js';
import '../listing-page.css';

const GALLERY_ACTIONS = [
  { icon: '/icons/gallery-ai.svg', label: 'Zaaranżuj wnętrze', primary: true },
  { icon: '/icons/gallery-plan.svg', label: 'Rzut' },
  { icon: '/icons/gallery-video.svg', label: 'Wideo' },
  { icon: '/icons/gallery-cube.svg', label: 'Spacer 3D', bold: true },
];

const GALLERY_ACTIONS_MOBILE = [
  { icon: '/icons/gallery-ai.svg', label: 'Zaaranżuj wnętrze', primary: true },
  { icon: '/icons/chip-camera.svg', label: 'photos', photos: true },
  { icon: '/icons/gallery-plan.svg', label: 'Plany mieszkań (2)' },
  { icon: '/icons/gallery-video.svg', label: 'Wideo' },
  { icon: '/icons/gallery-cube.svg', label: 'Spacer 3D', bold: true },
];

const EXTRA_FEATURES = [
  { label: 'balkon' },
  { label: 'garaż', info: true },
  { label: 'pomieszczenie gospodarcze' },
  { label: 'osobna kuchnia' },
];

function DetailRow({ label, value, muted }) {
  return (
    <div className="ad-details-table__row">
      <dt>{label}</dt>
      <dd className={muted ? 'ad-details-table__value--muted' : undefined}>{value}</dd>
    </div>
  );
}

const CENOSKOP_PARAMS = [
  { icon: '/cenoskop/icon-description.svg', label: 'Opis', width: 20, height: 23 },
  { icon: '/cenoskop/icon-location.svg', label: 'Lokalizację', width: 16, height: 22 },
  { icon: '/cenoskop/icon-infrastructure.svg', label: 'Infrastrukturę', width: 20, height: 24 },
  { icon: '/cenoskop/icon-surroundings.svg', label: 'Otoczenie', width: 20, height: 22 },
  { icon: '/cenoskop/icon-prices.svg', label: 'Ceny w okolicy', width: 20, height: 20 },
];

function formatPrice(price) {
  const value = Number(String(price).replace(/[\s,]/g, ''));
  if (Number.isNaN(value)) return `${price} zł`;
  return `${value.toLocaleString('pl-PL').replace(/\u00a0/g, ' ')} zł`;
}

function formatPricePerSqm(pricePerSqm) {
  const match = String(pricePerSqm).match(/([\d\s,]+)/);
  if (!match) return pricePerSqm;
  const value = Number(match[1].replace(/[\s,]/g, ''));
  if (Number.isNaN(value)) return pricePerSqm;
  return `${value.toLocaleString('pl-PL').replace(/\u00a0/g, ' ')} zł/m²`;
}

function formatRent(rent) {
  if (!rent || rent === 'no information' || rent === 'brak informacji') return 'brak informacji';
  if (rent.includes('/miesiąc') || rent.toLowerCase().includes('/month')) return rent;
  return `${rent}/miesiąc`;
}

function formatChipArea(area) {
  if (!area) return null;
  return String(area).replace(/\s*m²/i, 'm²').replace(/\s+/g, '');
}

function formatChipRooms(rooms) {
  if (!rooms) return null;
  const value = String(rooms).trim();
  if (/pok/i.test(value)) return value;
  return `${value} pok.`;
}

function estimateMonthlyRate(price) {
  const value = Number(String(price).replace(/[\s,]/g, ''));
  if (Number.isNaN(value)) return '2 123';
  const rate = Math.round((value * 0.8 * 0.005) / 10) * 10;
  return rate.toLocaleString('pl-PL').replace(/\u00a0/g, ' ');
}

function getDetailRows(listing) {
  const availableFrom = listing.availableFrom ?? listing.details.availableFrom ?? 'brak informacji';
  const isAvailableMuted = availableFrom === 'brak informacji';
  return [
    { label: 'Ogrzewanie:', value: listing.details.heating },
    { label: 'Piętro:', value: listing.details.floor },
    { label: 'Czynsz:', value: formatRent(listing.rent) },
    { label: 'Stan wykończenia:', value: listing.details.condition },
    { label: 'Rynek:', value: listing.details.market },
    { label: 'Forma własności:', value: listing.details.ownership },
    { label: 'Dostępne od:', value: availableFrom, muted: isAvailableMuted },
    { label: 'Typ sprzedawcy:', value: listing.details.sellerType ?? 'agencja' },
  ];
}

export function OtodomListing({ listing, onOpenGallery, onContactAdvertiser, widget }) {
  const { openAll, hasImages } = widget;
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartXRef = useRef(null);
  const suppressCarouselClickRef = useRef(false);

  const hero = listing.media[0];
  const thumbs = listing.media.slice(1, 5);
  const agency = listing.agency ?? {
    brand: 'metrohouse',
    name: 'Metrohouse S.A.',
    logo: '/agency/metrohouse-logo.png',
  };

  const detailHeading = listing.breadcrumbs?.[0] ?? 'Mieszkanie na sprzedaż';
  const chipArea = formatChipArea(listing.details?.area ?? listing.titleHighlight);
  const chipRooms = formatChipRooms(listing.details?.rooms);
  const monthlyRate = estimateMonthlyRate(listing.price);
  const currentMedia = listing.media[activeSlide] ?? hero;
  const mediaCount = listing.media.length;

  const goToPrevSlide = () => {
    setActiveSlide((slide) => (slide - 1 + mediaCount) % mediaCount);
  };

  const goToNextSlide = () => {
    setActiveSlide((slide) => (slide + 1) % mediaCount);
  };

  const handleCarouselTouchStart = (event) => {
    touchStartXRef.current = event.touches[0].clientX;
    suppressCarouselClickRef.current = false;
  };

  const handleCarouselTouchEnd = (event) => {
    if (touchStartXRef.current === null || mediaCount <= 1) {
      touchStartXRef.current = null;
      return;
    }

    const delta = event.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (Math.abs(delta) < 50) {
      return;
    }

    suppressCarouselClickRef.current = true;
    if (delta > 0) {
      goToPrevSlide();
    } else {
      goToNextSlide();
    }
  };

  const handleCarouselClick = () => {
    if (suppressCarouselClickRef.current) {
      suppressCarouselClickRef.current = false;
      return;
    }

    if (currentMedia) {
      onOpenGallery(currentMedia.id);
    }
  };

  return (
    <div className="ad-listing" style={getWidgetHostCssVars()}>
      <AgencyBar agency={agency} />

      <div className="ad-toolbar">
        <div className="ad-page-frame ad-toolbar__inner">
          <Link to="/" className="ad-toolbar__btn ad-toolbar__btn--back">
            <img src="/icons/chevron-left.svg" alt="" width={24} height={24} aria-hidden />
            Wstecz
          </Link>
          <div className="ad-toolbar__actions">
            <span
              role="button"
              tabIndex={0}
              className="ad-toolbar__btn ad-toolbar__btn--action ad-static-cta"
            >
              <img src="/icons/share.svg" alt="" width={24} height={24} aria-hidden />
              Udostępnij
            </span>
            <span
              role="button"
              tabIndex={0}
              className="ad-toolbar__btn ad-toolbar__btn--action ad-static-cta"
            >
              <img src="/icon.svg" alt="" width={24} height={24} aria-hidden />
              Zapisz
            </span>
          </div>
        </div>
      </div>

      <section className="ad-gallery">
        <div className="ad-page-frame ad-gallery__desktop">
          <div className="ad-gallery__mosaic">
            <div className="ad-gallery__hero">
              {hero ? (
                <GalleryPhoto
                  media={hero}
                  label={hero.label}
                  variant="hero"
                  disabled={!hasImages}
                  onOpen={() => onOpenGallery(hero.id)}
                />
              ) : null}
            </div>

            {thumbs.map((item, index) => {
              const isLast = index === thumbs.length - 1;

              if (isLast) {
                return (
                  <div key={item.id} className="ad-gallery__thumb ad-gallery__thumb--all">
                    <img src={item.image_url} alt={item.label} />
                    <button
                      type="button"
                      className="ad-gallery__all-photos-btn"
                      onClick={() => onOpenGallery()}
                      aria-label={`Wszystkie zdjęcia (${listing.media.length})`}
                    >
                      <span className="ad-gallery__thumb-overlay" aria-hidden />
                      <span className="ad-gallery__all-photos">
                        Wszystkie zdjęcia ({listing.media.length})
                      </span>
                    </button>
                  </div>
                );
              }

              return (
                <div key={item.id} className="ad-gallery__thumb">
                  <GalleryPhoto
                    media={item}
                    label={item.label}
                    variant="thumb"
                    disabled={!hasImages}
                    onOpen={() => onOpenGallery(item.id)}
                  />
                </div>
              );
            })}

            <div className="ad-gallery__action-bar">
              {GALLERY_ACTIONS.map((action) =>
                action.primary ? (
                  <button
                    key={action.label}
                    type="button"
                    className="ad-gallery__action ad-gallery__action--primary"
                    disabled={!hasImages}
                    onClick={() => openAll()}
                  >
                    <img src={action.icon} alt="" aria-hidden width="20" height="20" />
                    {action.label}
                  </button>
                ) : (
                  <span
                    key={action.label}
                    role="button"
                    tabIndex={0}
                    className={`ad-gallery__action ad-static-cta${
                      action.bold ? ' ad-gallery__action--bold' : ''
                    }`}
                  >
                    <img src={action.icon} alt="" aria-hidden width="20" height="20" />
                    {action.label}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <div className="ad-gallery__mobile">
          <div
            className="ad-gallery__carousel"
            onTouchStart={handleCarouselTouchStart}
            onTouchEnd={handleCarouselTouchEnd}
          >
            <button
              type="button"
              className="ad-gallery__carousel-hit"
              onClick={handleCarouselClick}
              aria-label="Otwórz galerię zdjęć"
            >
              {currentMedia?.image_url ? (
                <img src={currentMedia.image_url} alt={listing.title} className="ad-gallery__carousel-image" />
              ) : null}
            </button>
            <div className="ad-gallery__carousel-gradient" aria-hidden />
            <div className="ad-gallery__carousel-pagination" aria-hidden>
              {listing.media.slice(0, 5).map((item, index) => (
                <span
                  key={item.id}
                  className={`ad-gallery__carousel-dot${index === activeSlide ? ' ad-gallery__carousel-dot--active' : ''}`}
                />
              ))}
            </div>
            <div className="ad-gallery__carousel-counter">
              <img src="/icons/chip-camera.svg" alt="" width={16} height={16} aria-hidden />
              <span>
                {activeSlide + 1}/{listing.media.length}
              </span>
            </div>
            {listing.media.length > 1 ? (
              <>
                <button
                  type="button"
                  className="ad-gallery__carousel-nav ad-gallery__carousel-nav--prev"
                  aria-label="Poprzednie zdjęcie"
                  onClick={goToPrevSlide}
                />
                <button
                  type="button"
                  className="ad-gallery__carousel-nav ad-gallery__carousel-nav--next"
                  aria-label="Następne zdjęcie"
                  onClick={goToNextSlide}
                />
              </>
            ) : null}
          </div>

          <div className="ad-gallery__chips-scroll">
            {GALLERY_ACTIONS_MOBILE.map((action) => {
              const label =
                action.photos === true ? `Zdjęcia (${listing.media.length})` : action.label;

              if (action.primary) {
                return (
                  <button
                    key={label}
                    type="button"
                    className="ad-gallery__action ad-gallery__action--primary ad-gallery__action--chip"
                    disabled={!hasImages}
                    onClick={() => openAll()}
                  >
                    <img src={action.icon} alt="" aria-hidden width="20" height="20" />
                    {label}
                  </button>
                );
              }

              if (action.photos) {
                return (
                  <button
                    key={label}
                    type="button"
                    className="ad-gallery__action ad-gallery__action--chip"
                    onClick={() => onOpenGallery()}
                  >
                    <img src={action.icon} alt="" aria-hidden width="16" height="16" />
                    {label}
                  </button>
                );
              }

              return (
                <span
                  key={label}
                  role="button"
                  tabIndex={0}
                  className={`ad-gallery__action ad-gallery__action--chip ad-static-cta${
                    action.bold ? ' ad-gallery__action--bold' : ''
                  }`}
                >
                  <img src={action.icon} alt="" aria-hidden width="16" height="16" />
                  {label}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <div className="ad-page-frame ad-listing__columns">
        <div className="ad-listing__main">
          <section className="ad-card ad-summary-card">
            <div className="ad-summary">
              <h1 className="ad-summary__title">{listing.title}</h1>
              <div className="ad-summary__price-row">
                <p className="ad-summary__price">{formatPrice(listing.price)}</p>
                <p className="ad-summary__price-meta">{formatPricePerSqm(listing.pricePerSqm)}</p>
              </div>
              <span
                role="button"
                tabIndex={0}
                className="ad-summary__mortgage-btn ad-static-cta ad-mobile-only"
              >
                Rata od {monthlyRate} zł
              </span>
              <p className="ad-summary__location ad-static-cta">
                <LocationIcon size={24} className="ad-summary__location-icon" />
                {listing.address}
              </p>

              <hr className="ad-summary__divider" />

              <span className="ad-summary__ad-label">Reklama</span>
              <span className="ad-summary__ad-link ad-static-cta">
                <img className="ad-summary__ad-logo" src="/ing-logo.png" alt="ING" />
                <span className="ad-desktop-only">Finansowanie z ING</span>
                <span className="ad-mobile-only">Opcje finansowania ING</span>
              </span>
            </div>
          </section>

          <section className="ad-card ad-details-card">
            <h2 className="ad-details-card__heading">
              <span className="ad-mobile-only">Mieszkanie na sprzedaż</span>
              <span className="ad-desktop-only">{detailHeading}</span>
            </h2>

            {(chipArea || chipRooms) ? (
              <div className="ad-detail-chips ad-mobile-only">
                {chipArea ? (
                  <span className="ad-detail-chips__item">
                    <img src="/icons/chip-plan.svg" alt="" width={16} height={16} aria-hidden />
                    {chipArea}
                  </span>
                ) : null}
                {chipRooms ? (
                  <span className="ad-detail-chips__item">
                    <img src="/icons/chip-cube.svg" alt="" width={16} height={16} aria-hidden />
                    {chipRooms}
                  </span>
                ) : null}
              </div>
            ) : null}

            <dl className="ad-details-table">
              {getDetailRows(listing).map((row) => (
                <DetailRow key={row.label} label={row.label} value={row.value} muted={row.muted} />
              ))}
              <div className="ad-details-table__row ad-details-table__row--extra">
                <dt>Dodatkowo:</dt>
                <dd>
                  <ul className="ad-extras">
                    {EXTRA_FEATURES.map((feature) => (
                      <li key={feature.label} className="ad-extras__item">
                        <CheckIcon size={16} className="ad-extras__check" />
                        <span>{feature.label}</span>
                        {feature.info ? (
                          <MoreInfoIcon size={16} className="ad-extras__info" />
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            </dl>

            <div className="ad-collapse">
              <div className="ad-collapse__row ad-static-cta" role="button" tabIndex={0}>
                <span>Szczegóły budynku</span>
                <ChevronDownIcon size={24} className="ad-collapse__chevron ad-desktop-only" />
                <ChevronDownIcon size={16} className="ad-collapse__chevron ad-mobile-only" />
              </div>
              <div className="ad-collapse__row ad-static-cta" role="button" tabIndex={0}>
                <span>Wyposażenie</span>
                <ChevronDownIcon size={24} className="ad-collapse__chevron ad-desktop-only" />
                <ChevronDownIcon size={16} className="ad-collapse__chevron ad-mobile-only" />
              </div>
            </div>

            <div className="ad-media-links ad-mobile-only">
              <span role="button" tabIndex={0} className="ad-media-links__item ad-static-cta">
                <img src="/icons/gallery-video.svg" alt="" width={16} height={16} aria-hidden />
                <span>Wideo</span>
              </span>
              <span role="button" tabIndex={0} className="ad-media-links__item ad-static-cta">
                <img src="/icons/gallery-cube.svg" alt="" width={16} height={16} aria-hidden />
                <span>Spacer wirtualny</span>
              </span>
              <span role="button" tabIndex={0} className="ad-media-links__item ad-static-cta">
                <img src="/icons/gallery-plan.svg" alt="" width={16} height={16} aria-hidden />
                <span>Plan zagospodarowania przestrzennego</span>
              </span>
            </div>

            <span
              role="button"
              tabIndex={0}
              className="ad-flat-btn ad-flat-btn--underline ad-static-cta ad-desktop-only"
            >
              <img src="/icons/gallery-plan.svg" alt="" width={16} height={16} aria-hidden />
              <span>Plan zagospodarowania przestrzennego</span>
            </span>
          </section>

          <section className="ad-card ad-description-card">
            <h2 className="ad-details-card__description-title">Opis</h2>

            <div className="ad-description__read-more">
              <div className="ad-description__clip">
                <div className="ad-description__body">
                  {listing.description.split('\n\n').map((paragraph) => (
                    <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <span
                role="button"
                tabIndex={0}
                className="ad-flat-btn ad-static-cta ad-description__more"
              >
                <span>Pełny opis</span>
                <img
                  src="/icons/chevron-down-16.svg"
                  alt=""
                  width={16}
                  height={16}
                  aria-hidden
                />
              </span>
            </div>

            <hr className="ad-description__divider" />

            <div className="ad-description__footer">
              <div className="ad-description__meta">
                <span className="ad-mobile-only">Zaktualizowano: 2 godziny temu</span>
                <span>ID: {listing.id ?? '3482292'}</span>
                <span>Nr. w biurze: 348229...</span>
              </div>
              <span
                role="button"
                tabIndex={0}
                className="ad-flat-btn ad-flat-btn--danger ad-static-cta"
              >
                <img src="/icons/flag.svg" alt="" width={24} height={24} aria-hidden />
                <span>Raport</span>
              </span>
            </div>
          </section>

          <section className="ad-notify-banner">
            <div className="ad-notify-banner__content">
              <div className="ad-notify-banner__icon" aria-hidden>
                <img src="/icons/bell.svg" alt="" width={24} height={24} />
              </div>
              <div className="ad-notify-banner__text">
                <p className="ad-notify-banner__title">Chcesz śledzić podobne nieruchomości?</p>
                <p className="ad-notify-banner__sub">
                  Włącz powiadomienia i nigdy nie przegap świetnej okazji
                </p>
              </div>
            </div>
            <span
              role="button"
              tabIndex={0}
              className="ad-outline-btn ad-static-cta"
            >
              Powiadom o podobnych ogłoszeniach
            </span>
          </section>

          <section className="ad-card ad-map-card">
            <h2 className="ad-details-card__description-title">Mapa</h2>
            <p className="ad-map-card__address">
              <LocationIcon size={16} className="ad-summary__location-icon" />
              {listing.address}
            </p>
            <div className="ad-map-card__frame" aria-hidden>
              <img className="ad-map-card__image" src="/map.png" alt="" />
              <div className="ad-map-card__pin">
                <LocationIcon size={32} />
              </div>
            </div>
          </section>

          <section className="ad-card ad-mortgage-card">
            <h2 className="ad-details-card__description-title">Kalkulator kredytowy</h2>
            <p className="ad-mortgage-card__lead">
              Myślisz o kupnie tego mieszkania na kredyt? Skorzystaj z kalkulatora, aby poznać
              szacunkową ratę.
            </p>

            <div className="ad-mortgage-card__field ad-mortgage-card__field--price">
              <div className="ad-mortgage-card__field-head">
                <p className="ad-mortgage-card__field-title">Cena nieruchomości</p>
                <p className="ad-mortgage-card__field-hint ad-desktop-only">
                  Ustaw kwotę, którą zamierzasz wydać
                </p>
              </div>
              <div className="ad-mortgage-card__input ad-static-cta">
                <span className="ad-mortgage-card__input-value">700 000</span>
                <span className="ad-mortgage-card__input-unit">zł</span>
              </div>
            </div>

            <hr className="ad-mortgage-card__divider" />

            <div className="ad-mortgage-card__field ad-mortgage-card__field--slider">
              <div className="ad-mortgage-card__field-head">
                <p className="ad-mortgage-card__field-title">Wkład własny</p>
                <p className="ad-mortgage-card__field-hint ad-desktop-only">
                  ( 20% ceny nieruchomości to minimum wymagane przez większość banków)
                </p>
              </div>
              <div className="ad-mortgage-card__field-controls">
                <div className="ad-slider ad-static-cta" aria-hidden>
                  <span className="ad-slider__cap">10%</span>
                  <div className="ad-slider__track">
                    <div className="ad-slider__fill" />
                    <div className="ad-slider__knob" />
                  </div>
                  <span className="ad-slider__cap">90%</span>
                </div>
                <div className="ad-mortgage-card__slider-inputs">
                  <div className="ad-mortgage-card__input ad-static-cta">
                    <span className="ad-mortgage-card__input-value">50</span>
                    <span className="ad-mortgage-card__input-unit">%</span>
                  </div>
                  <div className="ad-mortgage-card__input ad-static-cta">
                    <span className="ad-mortgage-card__input-value">350 000</span>
                    <span className="ad-mortgage-card__input-unit">zł</span>
                  </div>
                </div>
              </div>
            </div>

            <hr className="ad-mortgage-card__divider" />

            <div className="ad-mortgage-card__field ad-mortgage-card__field--slider">
              <div className="ad-mortgage-card__field-head">
                <p className="ad-mortgage-card__field-title">Okres spłaty</p>
                <p className="ad-mortgage-card__field-hint ad-desktop-only">
                  (30 lat to najczęstszy wybór. Im krótszy okres, tym wyższa rata miesięczna.)
                </p>
              </div>
              <div className="ad-mortgage-card__field-controls ad-mortgage-card__field-controls--term">
                <div className="ad-slider ad-static-cta" aria-hidden>
                  <span className="ad-slider__cap">5 l.</span>
                  <div className="ad-slider__track">
                    <div className="ad-slider__fill" />
                    <div className="ad-slider__knob" />
                  </div>
                  <span className="ad-slider__cap">35 l.</span>
                </div>
                <div className="ad-mortgage-card__input ad-static-cta">
                  <span className="ad-mortgage-card__input-value">30</span>
                  <span className="ad-mortgage-card__input-unit">lat</span>
                </div>
              </div>
            </div>

            <hr className="ad-mortgage-card__divider" />

            <div className="ad-mortgage-card__result">
              <div className="ad-mortgage-card__rate">
                <span className="ad-mortgage-card__rate-label">Szacunkowa rata/miesiąc:</span>
                <span className="ad-mortgage-card__rate-value">
                  {estimateMonthlyRate(listing.price)} zł
                </span>
              </div>
              <span
                role="button"
                tabIndex={0}
                className="ad-outline-btn ad-outline-btn--wide ad-static-cta"
              >
                Zapytaj o ofertę
              </span>
              <p className="ad-mortgage-card__legal">
                Powyższa kalkulacja ma charakter orientacyjny. Kalkulacja została opracowana na
                podstawie reprezentatywnych przykładów ofert dostępnych u naszych partnerów i nie
                stanowi oferty w rozumieniu art. 66 par. 1 Kodeksu Cywilnego. Ostateczne warunki
                finansowania zależą od decyzji banku i oceny zdolności kredytowej.
              </p>
            </div>

            <hr className="ad-mortgage-card__divider" />

            <div className="ad-mortgage-card__bik">
              <p className="ad-mortgage-card__bik-title">Twoje szanse na kredyt z BIK</p>
              <div className="ad-mortgage-card__bik-body">
                <p className="ad-mortgage-card__bik-sub">
                  Uzyskaj bezpłatny dostęp do swojego Statusu Kredytowego BIK i wsparcie Ekspertów
                  Finansowych współpracujących z Otodom.
                </p>
                <div className="ad-mortgage-card__bik-logo-wrap">
                  <img
                    className="ad-mortgage-card__bik-logo"
                    src="/agency/bik-logo.png"
                    alt=""
                    width={132}
                  />
                </div>
              </div>
              <span
                role="button"
                tabIndex={0}
                className="ad-flat-btn ad-flat-btn--underline ad-static-cta"
              >
                <span>Odbierz bezpłatny kod</span>
              </span>
            </div>
          </section>

          <section className="ad-card ad-cenoskop-card">
            <h2 className="ad-details-card__description-title">Szacunkowa wartość rynkowa</h2>
            <p className="ad-cenoskop-card__lead">
              Na podstawie ponad 140 czynników oszacowaliśmy wartość oferowanej nieruchomości między{' '}
              <strong>412 857</strong> a <strong>494 539</strong> zł.
            </p>

            <img
              className="ad-cenoskop-card__logo"
              src="/cenoskop/logo.png"
              alt="Cenoskop otodom"
              width={144}
              height={14}
            />

            <div className="ad-cenoskop-card__range" aria-hidden>
              <div className="ad-cenoskop-card__chart">
                <div className="ad-cenoskop-card__range-track ad-cenoskop-card__range-track--pointer">
                  <div className="ad-cenoskop-card__track-seg ad-cenoskop-card__track-seg--dark">
                    <div className="ad-cenoskop-card__pointer-anchor">
                      <div className="ad-cenoskop-card__ad-price">
                        <p className="ad-cenoskop-card__ad-price-label">Cena z ogłoszenia:</p>
                        <p className="ad-cenoskop-card__ad-price-value">412 857 zł</p>
                        <p className="ad-cenoskop-card__ad-price-sub">7 981 zł/m²</p>
                      </div>
                      <img
                        className="ad-cenoskop-card__pointer-icon"
                        src="/cenoskop/pointer.svg"
                        alt=""
                        width={20}
                        height={20}
                      />
                    </div>
                  </div>
                  <div
                    className="ad-cenoskop-card__track-seg ad-cenoskop-card__track-seg--green"
                    aria-hidden
                  />
                  <div
                    className="ad-cenoskop-card__track-seg ad-cenoskop-card__track-seg--dark"
                    aria-hidden
                  />
                </div>

                <div className="ad-cenoskop-card__range-bar">
                  <span className="ad-cenoskop-card__range-seg ad-cenoskop-card__range-seg--dark" />
                  <span className="ad-cenoskop-card__range-seg ad-cenoskop-card__range-seg--green" />
                  <span className="ad-cenoskop-card__range-seg ad-cenoskop-card__range-seg--dark" />
                </div>

                <div className="ad-cenoskop-card__range-track ad-cenoskop-card__range-track--labels">
                  <div
                    className="ad-cenoskop-card__track-seg ad-cenoskop-card__track-seg--dark"
                    aria-hidden
                  />
                  <div className="ad-cenoskop-card__track-seg ad-cenoskop-card__track-seg--green">
                    <div className="ad-cenoskop-card__range-label ad-cenoskop-card__range-label--min">
                      <p className="ad-cenoskop-card__range-price">412 857 zł</p>
                      <p className="ad-cenoskop-card__range-sub">7 981 zł/m²</p>
                    </div>
                    <div className="ad-cenoskop-card__range-label ad-cenoskop-card__range-label--max">
                      <p className="ad-cenoskop-card__range-price">494 539 zł</p>
                      <p className="ad-cenoskop-card__range-sub">9 560 zł/m²</p>
                    </div>
                  </div>
                  <div
                    className="ad-cenoskop-card__track-seg ad-cenoskop-card__track-seg--dark"
                    aria-hidden
                  />
                </div>
              </div>
            </div>

            <div className="ad-cenoskop-card__params-section">
              <h3 className="ad-cenoskop-card__params-title">Wzięliśmy pod uwagę:</h3>
              <ul className="ad-cenoskop-card__params">
                {CENOSKOP_PARAMS.map((param) => (
                  <li key={param.label}>
                    <img
                      src={param.icon}
                      alt=""
                      width={param.width}
                      height={param.height}
                    />
                    <span>{param.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <span
              role="button"
              tabIndex={0}
              className="ad-flat-btn ad-flat-btn--underline ad-static-cta"
            >
              <span>Jak to obliczamy?</span>
            </span>
          </section>

          <section className="ad-card ad-seller-card">
            <h2 className="ad-details-card__description-title">O sprzedającym</h2>
            <div className="ad-seller-card__body">
              <div className="ad-seller-card__logo">
                <img src={agency.logo} alt={agency.name} />
              </div>
              <div className="ad-seller-card__info">
                <p className="ad-seller-card__name">{agency.name}</p>
                <p className="ad-seller-card__type">Agencja nieruchomości</p>
                <span
                  role="button"
                  tabIndex={0}
                  className="ad-flat-btn ad-flat-btn--underline ad-static-cta"
                >
                  <span>Pokaż numer</span>
                </span>
                <p className="ad-seller-card__address">
                  Juliusza Lea 18/1a, 30-048, Kraków, małopolskie
                </p>
              </div>
            </div>
            <div className="ad-seller-card__actions">
              <span role="button" tabIndex={0} className="ad-outline-btn ad-static-cta">
                Dowiedz się więcej
              </span>
              <span role="button" tabIndex={0} className="ad-solid-btn ad-static-cta">
                Zapytaj o ofertę
              </span>
            </div>
          </section>
        </div>

        <ListingContactSidebar listing={listing} />
      </div>
    </div>
  );
}

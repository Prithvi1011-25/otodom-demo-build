import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ListingContactSidebar } from './ListingContactSidebar.jsx';
import '../photo-gallery-modal.css';

const CHIP_TABS = [
  { id: 'photos', icon: '/icons/chip-camera.svg', label: 'Zdjęcia', active: true },
  { id: 'plan', icon: '/icons/chip-plan.svg', label: 'Plan' },
  { id: 'video', icon: '/icons/chip-video.svg', label: 'Wideo' },
  { id: 'walk', icon: '/icons/chip-cube.svg', label: 'Spacer 3D' },
];

const PROMO_COPY = {
  title: 'Chcesz zobaczyć, jak to mieszkanie może odzwierciedlić Twój styl?',
  sub: 'Wypróbuj nasz wirtualny kreator wnętrz, aby w kilka sekund odkryć różne style dla tego wnętrza.',
  cta: 'Zaaranżuj wnętrze',
};

// After the hero + promo we alternate: 50/50 row -> full-width -> 50/50 -> full,
// so every full-width image is followed by a two-image row.
// If the last slice can't fill a row, promote it to full-width so we never
// render a small, orphaned tile.
const GRID_PATTERN = [
  { kind: 'row', cols: 2, height: 314 },
  { kind: 'full', height: 478 },
];

function buildGridSections(items) {
  const sections = [];
  let cursor = 0;
  let patternIndex = 0;
  while (cursor < items.length) {
    const spec = GRID_PATTERN[patternIndex % GRID_PATTERN.length];
    const take = spec.kind === 'row' ? spec.cols : 1;
    const slice = items.slice(cursor, cursor + take);
    if (slice.length === 0) break;

    let effectiveSpec = spec;
    if (spec.kind === 'row' && slice.length < spec.cols) {
      effectiveSpec =
        slice.length === 1
          ? { kind: 'full', height: 314 }
          : { kind: 'row', cols: slice.length, height: spec.height };
    }

    sections.push({ spec: effectiveSpec, items: slice });
    cursor += slice.length;
    patternIndex += 1;
  }
  return sections;
}

export function PhotoGalleryModal({
  media,
  listing,
  isOpen,
  scrollToMediaId = null,
  onClose,
  widget,
}) {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const scrollContainerRef = useRef(null);
  const tileRefs = useRef({});
  const { openAll, openSingle, hasImages } = widget;

  const openWidgetForPhoto = (item) => {
    if (!hasImages || !item?.image_url) return;
    void openSingle(item);
  };

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = '';
      setLightboxIndex(null);
      return undefined;
    }

    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (lightboxIndex !== null) {
          setLightboxIndex(null);
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, lightboxIndex, onClose]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const attempt = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      if (!scrollToMediaId) {
        container.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        return;
      }

      const target = tileRefs.current[scrollToMediaId];
      if (!target) return;
      const targetTop = target.getBoundingClientRect().top;
      const containerTop = container.getBoundingClientRect().top;
      container.scrollTo({
        top: container.scrollTop + targetTop - containerTop - 16,
        behavior: 'auto',
      });
    };
    const raf = requestAnimationFrame(attempt);
    return () => cancelAnimationFrame(raf);
  }, [isOpen, scrollToMediaId, media]);

  if (!isOpen || media.length === 0) {
    return null;
  }

  const active = lightboxIndex !== null ? media[lightboxIndex] : null;
  const hero = media[0];
  const rest = media.slice(1);
  const gridSections = buildGridSections(rest);

  const registerTile = (id) => (el) => {
    if (el) tileRefs.current[id] = el;
  };

  let indexCursor = 1;

  return createPortal(
    <div className="pgm" role="presentation">
      <div className="pgm__scroll" ref={scrollContainerRef}>
        <header className="pgm__toolbar">
          <button
            type="button"
            className="pgm__icon-btn pgm__icon-btn--back"
            aria-label="Wstecz"
            onClick={onClose}
          >
            <img src="/icons/pgm-back.svg" alt="" width="24" height="24" aria-hidden />
          </button>
          <div className="pgm__toolbar-spacer" aria-hidden />
          <button type="button" className="pgm__icon-btn ad-static-cta" aria-label="Udostępnij">
            <img src="/icons/pgm-share.svg" alt="" width="24" height="24" aria-hidden />
          </button>
          <button type="button" className="pgm__icon-btn ad-static-cta" aria-label="Zapisz">
            <img src="/icons/pgm-heart.svg" alt="" width="24" height="24" aria-hidden />
          </button>
        </header>

        <div className="pgm__chip-bar">
          {CHIP_TABS.map((tab) => (
            <span
              key={tab.id}
              role="button"
              tabIndex={0}
              className={
                tab.active
                  ? 'pgm__chip pgm__chip--active ad-static-cta'
                  : 'pgm__chip ad-static-cta'
              }
            >
              <img src={tab.icon} alt="" width="16" height="16" aria-hidden />
              <span>
                {tab.label}
                {tab.active ? ` (${media.length})` : ''}
              </span>
            </span>
          ))}
          {hasImages ? (
            <button
              type="button"
              className="pgm__chip-bar-widget"
              onClick={() => openAll()}
            >
              {PROMO_COPY.cta}
            </button>
          ) : null}
        </div>

        <div className="pgm__container">
          <div className="pgm__layout">
            <div className="pgm__main">
              <h2 className="pgm__heading">Zdjęcia</h2>

              <div className="pgm__photos">
                {hero ? (
                  <div className="pgm__hero" ref={registerTile(hero.id)}>
                    <button
                      type="button"
                      className="pgm__tile-btn"
                      onClick={() => openWidgetForPhoto(hero)}
                      aria-label="Zaaranżuj wnętrze — zdjęcie 1"
                    >
                      <img src={hero.image_url} alt={hero.label} />
                    </button>
                  </div>
                ) : null}

                {hasImages ? (
                  <div className="pgm__promo">
                    <div className="pgm__promo-content">
                      <span className="pgm__promo-icon" aria-hidden>
                        <img src="/icons/promo-sparkle.svg" alt="" width="24" height="24" />
                      </span>
                      <div className="pgm__promo-text">
                        <p className="pgm__promo-title">{PROMO_COPY.title}</p>
                        <p className="pgm__promo-sub">{PROMO_COPY.sub}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      className="pgm__promo-btn"
                      onClick={() => openAll()}
                    >
                      {PROMO_COPY.cta}
                    </button>
                  </div>
                ) : null}

                {gridSections.map((section, sectionIdx) => {
                  const rowKey = `row-${sectionIdx}`;
                  const rowClass =
                    section.spec.kind === 'row'
                      ? `pgm__row pgm__row--cols-${section.spec.cols}`
                      : 'pgm__row pgm__row--full';
                  return (
                    <div
                      key={rowKey}
                      className={rowClass}
                      style={{ '--pgm-row-h': `${section.spec.height}px` }}
                    >
                      {section.items.map((item) => {
                        const localIndex = indexCursor;
                        indexCursor += 1;
                        return (
                          <div
                            key={item.id}
                            className="pgm__tile"
                            ref={registerTile(item.id)}
                          >
                            <button
                              type="button"
                              className="pgm__tile-btn"
                              onClick={() => openWidgetForPhoto(item)}
                              aria-label={`Zaaranżuj wnętrze — zdjęcie ${localIndex + 1}`}
                            >
                              <img src={item.image_url} alt={item.label} loading="lazy" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pgm__sidebar">
              <ListingContactSidebar listing={listing} />
            </div>
          </div>
        </div>
      </div>

      {active ? (
        <div className="photo-lightbox" role="dialog" aria-modal="true" aria-label="Podgląd zdjęcia">
          <header className="photo-lightbox__toolbar">
            <button
              type="button"
              className="photo-lightbox__icon-btn photo-lightbox__toolbar-close"
              aria-label="Wróć do galerii"
              onClick={() => setLightboxIndex(null)}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="1.25"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <div className="photo-lightbox__count">
              {lightboxIndex + 1}/{media.length}
            </div>
            <div className="photo-lightbox__toolbar-actions">
              <button
                type="button"
                className="photo-lightbox__icon-btn ad-static-cta"
                aria-label="Udostępnij"
              >
                <img src="/icons/pgm-share.svg" alt="" width="24" height="24" aria-hidden />
              </button>
              <button
                type="button"
                className="photo-lightbox__icon-btn ad-static-cta"
                aria-label="Zapisz"
              >
                <img src="/icons/pgm-heart.svg" alt="" width="24" height="24" aria-hidden />
              </button>
            </div>
          </header>

          <div className="photo-lightbox__body">
            <button
              type="button"
              className="photo-lightbox__nav photo-lightbox__nav--prev"
              aria-label="Poprzednie zdjęcie"
              onClick={() =>
                setLightboxIndex((index) => (index - 1 + media.length) % media.length)
              }
            >
              <img src="/icons/chevron-left.svg" alt="" width="24" height="24" aria-hidden />
            </button>

            <div className="photo-lightbox__stage">
              <img
                className="photo-lightbox__image"
                src={active.image_url}
                alt={active.label}
              />
            </div>

            <button
              type="button"
              className="photo-lightbox__nav photo-lightbox__nav--next"
              aria-label="Następne zdjęcie"
              onClick={() =>
                setLightboxIndex((index) => (index + 1) % media.length)
              }
            >
              <img src="/icons/chevron-right.svg" alt="" width="24" height="24" aria-hidden />
            </button>
          </div>

          <div className="photo-lightbox__thumbs">
            {media.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                className={
                  idx === lightboxIndex
                    ? 'photo-lightbox__thumb photo-lightbox__thumb--active'
                    : 'photo-lightbox__thumb'
                }
                aria-label={`Pokaż zdjęcie ${idx + 1}`}
                aria-current={idx === lightboxIndex ? 'true' : undefined}
                onClick={() => setLightboxIndex(idx)}
              >
                <img src={item.image_url} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>,
    document.body,
  );
}

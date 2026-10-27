import { useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { ContactAdvertiserModal } from '../components/ContactAdvertiserModal.jsx';
import { Footer } from '../components/Footer.jsx';
import { HomeHeader } from '../components/HomeHeader.jsx';
import { IntegrationToolbar } from '../components/IntegrationToolbar.jsx';
import { useWidgetLanguage } from '../hooks/useWidgetLanguage.js';
import { useWidgetUserId } from '../hooks/useWidgetUserId.js';
import { MobileBottomBar } from '../components/MobileBottomBar.jsx';
import { OtodomListing } from '../components/OtodomListing.jsx';
import '../home-page.css';
import { PhotoGalleryModal } from '../components/PhotoGalleryModal.jsx';
import { useReihNpmPackage } from '../hooks/useReihNpmPackage.js';
import { useReihScriptEmbed } from '../hooks/useReihScriptEmbed.js';
import { clearReihLoader } from '../widgetConfig.js';
import { getListingBySlug } from '../data/listings.js';

function ListingPageContent({
  listing,
  integration,
  widget,
  contactOpen,
  setContactOpen,
}) {
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryScrollToId, setGalleryScrollToId] = useState(null);

  const openGallery = () => {
    clearReihLoader();
    setGalleryScrollToId(null);
    setGalleryOpen(true);
  };

  const closeGallery = () => {
    setGalleryOpen(false);
    setGalleryScrollToId(null);
  };

  return (
    <div className="app-shell app-shell--listing">
      <HomeHeader />

      <IntegrationToolbar slug={listing.slug} active={integration} listing={listing} />

      <main className="listing-page">
        <OtodomListing
          listing={listing}
          onOpenGallery={openGallery}
          onContactAdvertiser={() => setContactOpen(true)}
          widget={widget}
        />
      </main>

      <Footer />

      <PhotoGalleryModal
        media={listing.media}
        listing={listing}
        isOpen={galleryOpen}
        scrollToMediaId={galleryScrollToId}
        onClose={closeGallery}
        onContactAdvertiser={() => setContactOpen(true)}
        widget={widget}
      />

      <ContactAdvertiserModal
        listing={listing}
        isOpen={contactOpen}
        onClose={() => setContactOpen(false)}
      />

      <MobileBottomBar
        onMessage={() => setContactOpen(true)}
        onCall={() => setContactOpen(true)}
      />
    </div>
  );
}

function ListingPageCdn() {
  const { slug } = useParams();
  const listing = getListingBySlug(slug);
  const { activeUserId } = useWidgetUserId();
  const { activeLanguage } = useWidgetLanguage();
  const [contactOpen, setContactOpen] = useState(false);
  const widget = useReihScriptEmbed(listing?.media ?? [], listing?.slug ?? '', {
    listing,
    userId: activeUserId,
    language: activeLanguage,
    onActionClick: () => {
      setContactOpen(true);
    },
  });

  if (!listing) {
    return <Navigate to="/" replace />;
  }

  return (
    <ListingPageContent
      listing={listing}
      integration="cdn"
      widget={widget}
      contactOpen={contactOpen}
      setContactOpen={setContactOpen}
    />
  );
}

function ListingPageNpm() {
  const { slug } = useParams();
  const listing = getListingBySlug(slug);
  const { activeUserId } = useWidgetUserId();
  const { activeLanguage } = useWidgetLanguage();
  const [contactOpen, setContactOpen] = useState(false);
  const widget = useReihNpmPackage(listing?.media ?? [], listing?.slug ?? '', {
    listing,
    userId: activeUserId,
    language: activeLanguage,
    onActionClick: () => {
      setContactOpen(true);
    },
  });

  if (!listing) {
    return <Navigate to="/" replace />;
  }

  return (
    <ListingPageContent
      listing={listing}
      integration="npm"
      widget={widget}
      contactOpen={contactOpen}
      setContactOpen={setContactOpen}
    />
  );
}

export function ListingPage({ integration = 'cdn' }) {
  if (integration === 'npm') {
    return <ListingPageNpm />;
  }

  return <ListingPageCdn />;
}

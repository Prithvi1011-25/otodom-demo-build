import { Footer } from '../components/Footer.jsx';
import { HomeHeader } from '../components/HomeHeader.jsx';
import { HomeSearchWidget } from '../components/HomeSearchWidget.jsx';
import { PromotedAds } from '../components/PromotedAds.jsx';
import { LISTINGS } from '../data/listings.js';
import '../home-page.css';

export function HomePage() {
  return (
    <div className="app-shell app-shell--home">
      <HomeHeader />

      <main className="home-landing">
        <section className="home-hero" aria-labelledby="home-hero-title">
          <div className="home-hero__media" aria-hidden />
          <div className="home-hero__overlay" aria-hidden />

          <div className="home-page-frame home-hero__body">
            <div className="home-hero__copy">
              <h1 id="home-hero-title">Adresujemy marzenia</h1>
              <p>Znajdź dom, który Ci odpowiada</p>
            </div>

            <HomeSearchWidget />
          </div>
        </section>

        <PromotedAds listings={LISTINGS} />
      </main>

      <Footer />
    </div>
  );
}

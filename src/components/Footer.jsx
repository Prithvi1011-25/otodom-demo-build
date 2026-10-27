import { OtodomLogo } from './OtodomLogo.jsx';
import '../footer.css';

const LINK_GROUPS = [
  {
    heading: 'O Otodom',
    links: [
      'O nas',
      'Cennik dla użytkowników indywidualnych',
      'Cennik dla biur nieruchomości',
      'Cennik dla deweloperów',
      'Biuro prasowe',
      'Kariera',
      'Centrum pomocy',
      'Digital Service Act',
    ],
  },
  {
    heading: 'Dla profesjonalistów',
    links: [
      'Baza wiedzy i inspiracji',
      'Akademia Otodom',
      'Magazyn Lighthouse',
      'Certyfikat Najemcy',
      'Integracje CRM',
      'Otodom Analytics',
    ],
  },
  {
    heading: 'Baza danych i wiedzy',
    links: [
      'Raporty Otodom',
      'Sytuacja na rynku',
      'Komentarze eksperckie',
      'Dane Otodom',
      'Wiedza i inspiracje',
    ],
  },
  {
    heading: 'Serwisy',
    links: ['OLX.pl', 'Otomoto.pl', 'Fixly.pl', 'Obido.pl', 'Imovirtual.com', 'Storia.ro'],
  },
  {
    heading: 'Mapa strony',
    links: ['Mapa kategorii', 'Mapa miejscowości'],
  },
  {
    heading: 'Kontakt',
    links: ['Obsługa klienta', 'Dział sprzedaży'],
  },
];

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M20 10.06C20 4.5 15.523 0 10 0S0 4.5 0 10.06C0 15.083 3.657 19.245 8.437 20v-7.03H5.898v-2.91h2.54V7.845c0-2.52 1.492-3.912 3.777-3.912 1.094 0 2.238.196 2.238.196v2.476h-1.26c-1.243 0-1.63.775-1.63 1.57v1.886h2.773l-.443 2.91h-2.33V20C16.343 19.245 20 15.083 20 10.06z"
        fill="#1c2637"
      />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M19.582 5.186a2.51 2.51 0 00-1.768-1.777C16.254 3 10 3 10 3s-6.254 0-7.814.409a2.51 2.51 0 00-1.768 1.777C0 6.75 0 10 0 10s0 3.25.418 4.814a2.51 2.51 0 001.768 1.777C3.746 17 10 17 10 17s6.254 0 7.814-.409a2.51 2.51 0 001.768-1.777C20 13.25 20 10 20 10s0-3.25-.418-4.814zM8 13V7l5.196 3L8 13z"
        fill="#1c2637"
      />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M17.04 17.04h-2.964v-4.64c0-1.106-.02-2.53-1.542-2.53-1.544 0-1.78 1.204-1.78 2.45v4.72H7.79V7.5h2.845v1.303h.04c.396-.75 1.363-1.542 2.807-1.542 3.003 0 3.558 1.977 3.558 4.548v5.231zM4.443 6.196a1.72 1.72 0 110-3.437 1.72 1.72 0 010 3.437zm1.483 10.844H2.958V7.5h2.968v9.54zM18.52 0H1.476C.66 0 0 .646 0 1.443V18.56C0 19.356.66 20 1.476 20h17.043C19.336 20 20 19.356 20 18.556V1.44C20 .646 19.336 0 18.52 0z"
        fill="#1c2637"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 1.802c2.67 0 2.987.01 4.042.058 2.71.124 3.976 1.41 4.1 4.1.048 1.054.057 1.37.057 4.04 0 2.672-.01 2.988-.057 4.042-.124 2.687-1.387 3.977-4.1 4.1-1.055.048-1.37.058-4.042.058-2.67 0-2.987-.01-4.041-.058-2.717-.124-3.977-1.417-4.1-4.1C1.812 12.988 1.802 12.672 1.802 10c0-2.67.01-2.986.058-4.04.124-2.69 1.387-3.977 4.1-4.1C6.914 1.812 7.23 1.802 10 1.802zM10 0C7.284 0 6.944.012 5.877.06 2.246.227.228 2.242.06 5.877.012 6.944 0 7.284 0 10s.012 3.057.06 4.123c.167 3.632 2.182 5.65 5.817 5.817C6.944 19.988 7.284 20 10 20s3.057-.012 4.123-.06c3.629-.167 5.652-2.182 5.817-5.817.048-1.066.06-1.407.06-4.123s-.012-3.056-.06-4.122c-.163-3.629-2.18-5.65-5.817-5.818C13.057.012 12.716 0 10 0zm0 4.865a5.135 5.135 0 100 10.27 5.135 5.135 0 000-10.27zm0 8.468a3.333 3.333 0 110-6.666 3.333 3.333 0 010 6.666zm5.338-9.87a1.2 1.2 0 100 2.4 1.2 1.2 0 000-2.4z"
        fill="#1c2637"
      />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M16.708 4.833a4.833 4.833 0 01-2.916-1.083A4.833 4.833 0 0111.958 0H8.833v13.083a2.208 2.208 0 11-2.208-2.208c.208 0 .416.042.625.083v-3.25a5.833 5.833 0 00-.625-.041 5.375 5.375 0 105.375 5.375V6.708a7.917 7.917 0 004.708 1.542v-3.25a5.166 5.166 0 01-.916-.167z"
        fill="#1c2637"
      />
    </svg>
  );
}

function SpotifyIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 0C4.477 0 0 4.477 0 10s4.477 10 10 10 10-4.477 10-10S15.523 0 10 0zm4.586 14.421a.623.623 0 01-.858.207c-2.348-1.436-5.305-1.76-8.789-.964a.623.623 0 11-.278-1.216c3.812-.87 7.083-.495 9.716 1.113a.623.623 0 01.209.86zm1.223-2.723a.78.78 0 01-1.073.256c-2.688-1.653-6.784-2.132-9.964-1.166a.78.78 0 11-.454-1.494c3.633-1.103 8.148-.57 11.235 1.331a.78.78 0 01.256 1.073zm.105-2.836c-3.224-1.913-8.542-2.089-11.62-1.155a.935.935 0 11-.543-1.79c3.532-1.072 9.404-.865 13.115 1.34a.935.935 0 01-.952 1.605z"
        fill="#1c2637"
      />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M15.5 1.75h2.94l-6.42 7.34L19.75 18.25h-5.92l-4.64-6.06-5.31 6.06H.94l6.87-7.85L.25 1.75h6.06l4.19 5.54 4.9-5.54h.1zm-1.03 14.75h1.63L5.6 3.4H3.85l10.62 13.1z"
        fill="#1c2637"
      />
    </svg>
  );
}

const SOCIAL_ICONS = [
  { key: 'facebook', label: 'Facebook', Icon: FacebookIcon },
  { key: 'youtube', label: 'YouTube', Icon: YouTubeIcon },
  { key: 'linkedin', label: 'LinkedIn', Icon: LinkedInIcon },
  { key: 'instagram', label: 'Instagram', Icon: InstagramIcon },
  { key: 'tiktok', label: 'TikTok', Icon: TikTokIcon },
  { key: 'spotify', label: 'Spotify', Icon: SpotifyIcon },
  { key: 'x', label: 'X', Icon: XIcon },
];

function AppStoreBadge() {
  return (
    <span className="site-footer__app-badge" role="img" aria-label="Pobierz w App Store">
      <svg width="17" height="20" viewBox="0 0 17 20" fill="none" aria-hidden>
        <path
          d="M13.99 10.634c.008-1.335.712-2.573 1.86-3.267a4.017 4.017 0 00-3.171-1.71c-1.333-.14-2.626.79-3.305.79-.693 0-1.74-.777-2.865-.755-1.663.054-3.196.99-4.043 2.472-1.788 3.089-.455 7.629 1.26 10.128.856 1.224 1.858 2.588 3.17 2.54 1.283-.053 1.762-.815 3.31-.815 1.533 0 1.984.816 3.32.786 1.375-.022 2.243-1.235 3.07-2.47a10.052 10.052 0 001.404-2.855 3.897 3.897 0 01-2.01-3.594zM11.6 4.245A3.812 3.812 0 0012.484 1.5a3.943 3.943 0 00-2.55 1.317 3.667 3.667 0 00-.906 2.649c.98.01 1.912-.44 2.572-1.222z"
          fill="#1c2637"
        />
      </svg>
      <span className="site-footer__app-badge-text">
        <span className="site-footer__app-badge-eyebrow">Download on the</span>
        <span className="site-footer__app-badge-title">App Store</span>
      </span>
    </span>
  );
}

function GooglePlayBadge() {
  return (
    <span className="site-footer__app-badge" role="img" aria-label="Pobierz w Google Play">
      <svg width="18" height="20" viewBox="0 0 18 20" fill="none" aria-hidden>
        <path d="M.9.42A2.05 2.05 0 000 2.12v15.76c0 .66.3 1.25.9 1.7l9.13-9.58L.9.42z" fill="#00D2FF" />
        <path d="M13.68 6.79L10.03 10l3.65 3.21 4.05-2.35c1.14-.66 1.14-2.36 0-3.02L13.68 6.79z" fill="#FFCE00" />
        <path d="M.9.42l9.13 9.58L13.68 6.79 2.72.28A1.98 1.98 0 00.9.42z" fill="#00F076" />
        <path d="M.9 19.58c.5.38 1.2.47 1.82.14l10.96-6.51L10.03 10 .9 19.58z" fill="#FF3A44" />
      </svg>
      <span className="site-footer__app-badge-text">
        <span className="site-footer__app-badge-eyebrow">Get it on</span>
        <span className="site-footer__app-badge-title">Google Play</span>
      </span>
    </span>
  );
}

export function Footer() {
  return (
    <footer className="site-footer" aria-label="Stopka">
      <div className="site-footer__inner">
        <div className="site-footer__logo">
          <OtodomLogo className="site-footer__brand" />
        </div>

        <div className="site-footer__grid">
          {LINK_GROUPS.map((group) => (
            <div key={group.heading} className="site-footer__group">
              <h3 className="site-footer__heading">{group.heading}</h3>
              <ul className="site-footer__list">
                {group.links.map((link) => (
                  <li key={link}>
                    <span className="site-footer__link" role="link" tabIndex={0}>
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="site-footer__meta">
          <div className="site-footer__meta-block">
            <span className="site-footer__meta-label">Dołącz do nas:</span>
            <div className="site-footer__socials">
              {SOCIAL_ICONS.map(({ key, label, Icon }) => (
                <span
                  key={key}
                  className="site-footer__social"
                  role="link"
                  tabIndex={0}
                  aria-label={label}
                >
                  <Icon />
                </span>
              ))}
            </div>
          </div>

          <div className="site-footer__meta-block">
            <span className="site-footer__meta-label">Aplikacje mobilne:</span>
            <div className="site-footer__apps">
              <AppStoreBadge />
              <GooglePlayBadge />
            </div>
          </div>
        </div>

        <div className="site-footer__bottom">
          <p className="site-footer__copyright">
            &copy; 2026 Otodom.pl, Grupa OLX sp. z o.o.
          </p>
          <ul className="site-footer__legal">
            <li>
              <span className="site-footer__legal-link" role="link" tabIndex={0}>
                Warunki współpracy
              </span>
            </li>
            <li>
              <span className="site-footer__legal-link" role="link" tabIndex={0}>
                Polityka prywatności
              </span>
            </li>
            <li>
              <span className="site-footer__legal-link" role="link" tabIndex={0}>
                Ustawienia plików cookie
              </span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

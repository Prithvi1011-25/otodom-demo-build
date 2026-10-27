import { OtodomLogo } from './OtodomLogo.jsx';

function ChevronDown() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M5 20c1.5-3.5 4.5-5 7-5s5.5 1.5 7 5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const NAV_DROPDOWN = ['Buy', 'Rent', 'Sell', 'Primary market', 'Companies'];

export function SiteHeader() {
  return (
    <header className="otodom-header otodom-header--listing">
      <div className="otodom-header__inner ad-page-frame">
        <OtodomLogo className="otodom-logo otodom-logo--listing" />

        <nav className="otodom-nav otodom-nav--listing" aria-label="Main">
          {NAV_DROPDOWN.map((label) => (
            <a key={label} href="#" className="otodom-nav__link">
              {label}
              <ChevronDown />
            </a>
          ))}
          <a href="#" className="otodom-nav__link otodom-nav__link--plain">
            Mortgages
          </a>
        </nav>

        <div className="otodom-header__right">
          <a href="#" className="otodom-header__account">
            <UserIcon />
            My account
          </a>
          <button type="button" className="otodom-header__cta otodom-header__cta--outline">
            Post an ad
          </button>
        </div>
      </div>
    </header>
  );
}

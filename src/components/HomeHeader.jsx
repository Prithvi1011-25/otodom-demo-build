import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { OtodomLogo } from './OtodomLogo.jsx';

function ChevronDown() {
  return (
    <span className="home-header__chevron" aria-hidden>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M2.00134 7H3.41534L12.0013 15.586L20.5873 7H22.0013V8.414L12.4158 18H11.5883L2.00134 8.414V7Z"
          fill="currentColor"
        />
      </svg>
    </span>
  );
}

function UserIcon() {
  return (
    <svg
      className="home-header__account-icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g transform="translate(-972.267, -24)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M979.767 30.5C979.767 32.9815 981.786 35 984.267 35C986.748 35 988.767 32.9815 988.767 30.5C988.767 28.0185 986.748 26 984.267 26C981.786 26 979.767 28.0185 979.767 30.5ZM981.767 30.5C981.767 29.1215 982.888 28 984.267 28C985.645 28 986.767 29.1215 986.767 30.5C986.767 31.8785 985.645 33 984.267 33C982.888 33 981.767 31.8785 981.767 30.5Z"
          fill="currentColor"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M976.267 46H992.267L993.267 45C993.267 40.0375 989.23 36 984.267 36C979.304 36 975.267 40.0375 975.267 45L976.267 46ZM991.196 44H977.338C977.825 40.6125 980.747 38 984.267 38C987.787 38 990.709 40.6125 991.196 44Z"
          fill="currentColor"
        />
      </g>
    </svg>
  );
}

const NAV_ITEMS = ['Kupuję', 'Wynajmuję', 'Sprzedaję', 'Rynek pierwotny', 'Firmy'];

function CloseIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 2L22 22M22 2L2 22"
        stroke="#1c2637"
        strokeWidth="1.67"
      />
    </svg>
  );
}

function MobileMenu({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div className="home-header-menu">
      <button
        type="button"
        className="home-header-menu__backdrop"
        aria-label="Zamknij menu"
        onClick={onClose}
      />

      <aside
        id="home-header-mobile-menu"
        className="home-header-menu__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Menu nawigacji"
      >
        <div className="home-header-menu__top">
          <button
            type="button"
            className="home-header-menu__close"
            aria-label="Zamknij menu"
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="home-header-menu__nav" aria-label="Główne">
          {NAV_ITEMS.map((label) => (
            <a key={label} href="#" className="home-header-menu__link" onClick={onClose}>
              <span>{label}</span>
              <img src="/icons/chevron-right.svg" alt="" width={22} height={22} />
            </a>
          ))}
        </nav>

        <a href="#" className="home-header-menu__account" onClick={onClose}>
          <UserIcon />
          <span>Moje konto</span>
        </a>

        <div className="home-header-menu__footer">
          <button type="button" className="home-header-menu__cta">
            Dodaj ogłoszenie
          </button>
        </div>
      </aside>
    </div>,
    document.body,
  );
}

export function HomeHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="home-header">
        <div className="home-header__inner home-page-frame">
          <OtodomLogo className="home-header__logo" />

          <nav className="home-header__nav" aria-label="Główne">
            {NAV_ITEMS.map((label) => (
              <div key={label} className="home-header__nav-item">
                <a href="#" className="home-header__nav-link">
                  {label}
                  <ChevronDown />
                </a>
              </div>
            ))}
          </nav>

          <div className="home-header__actions">
            <span className="home-header__account">
              <UserIcon />
              <span>Moje konto</span>
            </span>
            <button type="button" className="home-header__cta">
              Dodaj ogłoszenie
            </button>
          </div>

          <button
            type="button"
            className="home-header__menu-btn"
            aria-label="Menu"
            aria-expanded={menuOpen}
            aria-controls="home-header-mobile-menu"
            onClick={() => setMenuOpen(true)}
          >
            <img src="/icons/menu.svg" alt="" width={40} height={40} />
          </button>
        </div>
      </header>

      <MobileMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

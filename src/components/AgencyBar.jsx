export function AgencyBar({ agency }) {
  const logoSrc = agency.logo ?? '/agency/metrohouse-logo.png';

  return (
    <div className="ad-agency-bar">
      <div className="ad-agency-bar__inner ad-page-frame">
        <a href="#" className="ad-agency-bar__link">
          <img
            className="ad-agency-bar__logo"
            src={logoSrc}
            alt={agency.brand}
          />
          <span className="ad-agency-bar__label">
            <span className="ad-agency-bar__name">{agency.name}</span>
            <img
              className="ad-agency-bar__chevron"
              src="/icons/chevron-right.svg"
              alt=""
              width={16}
              height={16}
              aria-hidden
            />
          </span>
        </a>
      </div>
    </div>
  );
}

import { PhoneIcon } from './listingIcons.jsx';
import { buildContactMessage } from '../lib/contactMessage.js';
import '../listing-page.css';

const DEFAULT_AGENT = {
  name: 'Agata Nowak',
  company: 'Skanska',
  photo: '/agency/agata-nowak.png',
};

function getAgent(listing) {
  return {
    name: listing?.agent?.name ?? DEFAULT_AGENT.name,
    company: listing?.agent?.company ?? listing?.agency?.name ?? DEFAULT_AGENT.company,
    photo: listing?.agent?.photo ?? DEFAULT_AGENT.photo,
  };
}

export function ListingContactForm({
  listing,
  interactive = false,
  className = '',
  titleId,
  onSubmit,
}) {
  const agent = getAgent(listing);
  const message = buildContactMessage(listing);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit?.(event);
  };

  const formBody = (
    <>
      <div className="ad-sidebar__header">
        <img className="ad-sidebar__avatar" src={agent.photo} alt={agent.name} />

        <div className="ad-sidebar__agent-info">
          <p className="ad-sidebar__agent-name" id={titleId}>
            {agent.name}
          </p>
          <div className="ad-sidebar__agent-sub">
            <p className="ad-sidebar__agent-company">{agent.company}</p>
            <span
              role="button"
              tabIndex={0}
              className="ad-flat-btn ad-flat-btn--underline ad-static-cta ad-sidebar__phone-link"
            >
              <PhoneIcon size={16} />
              <span>Pokaż numer</span>
            </span>
          </div>
        </div>
      </div>

      <div className="ad-sidebar__fields">
        <div className="ad-sidebar__field">
          <span className="ad-sidebar__label">Imię*</span>
          {interactive ? (
            <input
              type="text"
              name="name"
              className="ad-sidebar__input"
              placeholder="Wpisz swoje imię"
              autoComplete="name"
            />
          ) : (
            <div className="ad-sidebar__input ad-static-cta">Wpisz swoje imię</div>
          )}
        </div>

        <div className="ad-sidebar__field">
          <span className="ad-sidebar__label">E-mail*</span>
          {interactive ? (
            <input
              type="email"
              name="email"
              className="ad-sidebar__input"
              placeholder="Wpisz swój e-mail"
              autoComplete="email"
            />
          ) : (
            <div className="ad-sidebar__input ad-static-cta">Wpisz swój e-mail</div>
          )}
        </div>

        <div className="ad-sidebar__field">
          <span className="ad-sidebar__label">Numer telefonu*</span>
          {interactive ? (
            <div className="ad-sidebar__input ad-sidebar__phone-input">
              <span className="ad-sidebar__phone-code">+48</span>
              <input
                type="tel"
                name="phone"
                className="ad-sidebar__phone-field"
                placeholder="Wpisz swój numer telefonu"
                autoComplete="tel"
              />
            </div>
          ) : (
            <div className="ad-sidebar__input ad-sidebar__phone-input ad-static-cta">
              <span className="ad-sidebar__phone-code">+48</span>
              <span className="ad-sidebar__phone-value">Wpisz swój numer telefonu</span>
            </div>
          )}
        </div>
      </div>

      <div className="ad-sidebar__field ad-sidebar__field--message">
        <span className="ad-sidebar__label ad-sidebar__label--bold">Twoja wiadomość</span>
        {interactive ? (
          <textarea
            name="message"
            className="ad-sidebar__input ad-sidebar__input--area"
            rows={5}
            defaultValue={message}
          />
        ) : (
          <div className="ad-sidebar__input ad-sidebar__input--area ad-static-cta">{message}</div>
        )}
      </div>

      <div className="ad-sidebar__legal">
        <p>Ogłoszeniodawca otrzyma Twoje dane, aby umożliwić kontakt.</p>
        <p>Administratorem Twoich danych osobowych jest OLX Sp. z o.o. więcej</p>
      </div>

      {interactive ? (
        <button type="submit" className="ad-sidebar__submit">
          Wyślij wiadomość
        </button>
      ) : (
        <span role="button" tabIndex={0} className="ad-sidebar__submit ad-static-cta">
          Wyślij wiadomość
        </span>
      )}
    </>
  );

  if (interactive) {
    return (
      <form
        className={`ad-sidebar__form ${className}`.trim()}
        onSubmit={handleSubmit}
      >
        {formBody}
      </form>
    );
  }

  return <div className={`ad-sidebar__form ${className}`.trim()}>{formBody}</div>;
}

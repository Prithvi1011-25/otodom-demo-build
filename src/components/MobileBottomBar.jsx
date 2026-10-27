export function MobileBottomBar({ onMessage, onCall }) {
  return (
    <div className="ad-mobile-bar" role="toolbar" aria-label="Kontakt z ogłoszeniodawcą">
      <button type="button" className="ad-mobile-bar__btn ad-mobile-bar__btn--outline" onClick={onMessage}>
        Wyślij wiadomość
      </button>
      <button type="button" className="ad-mobile-bar__btn ad-mobile-bar__btn--solid" onClick={onCall}>
        Zadzwoń
      </button>
    </div>
  );
}

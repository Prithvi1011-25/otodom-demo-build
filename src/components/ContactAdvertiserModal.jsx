import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ListingContactForm } from './ListingContactForm.jsx';
import '../contact-advertiser-modal.css';

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

export function ContactAdvertiserModal({ listing, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !listing) {
    return null;
  }

  return createPortal(
    <div className="contact-modal" role="presentation">
      <button
        type="button"
        className="contact-modal__backdrop"
        aria-label="Zamknij formularz kontaktowy"
        onClick={onClose}
      />

      <div
        className="contact-modal__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-modal-title"
      >
        <button
          type="button"
          className="contact-modal__close"
          aria-label="Zamknij"
          onClick={onClose}
        >
          <CloseIcon />
        </button>

        <div className="ad-sidebar__card contact-modal__card">
          <ListingContactForm listing={listing} interactive titleId="contact-modal-title" />
        </div>
      </div>
    </div>,
    document.body,
  );
}

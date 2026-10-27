export function ImagePlaceholder({ label, className = '' }) {
  return (
    <div className={`image-placeholder ${className}`.trim()} aria-hidden="true">
      <div className="image-placeholder__icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="1.5" />
          <circle cx="8.5" cy="8.5" r="1.5" strokeWidth="1.5" />
          <path
            d="M21 15l-5-5L5 21"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="image-placeholder__label">{label}</span>
      <span className="image-placeholder__hint">Photo coming soon</span>
    </div>
  );
}

import { Link } from 'react-router-dom';

export function OtodomLogo({ className = 'otodom-brand-logo' }) {
  return (
    <Link to="/" className={className} aria-label="otodom" translate="no">
      <img src="/otodom-logo.svg" alt="" width={154} height={30} />
    </Link>
  );
}

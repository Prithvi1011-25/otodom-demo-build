import { Link } from 'react-router-dom';

const TABS = [
  { id: 'cdn', label: 'CDN Script Embed', suffix: '' },
  { id: 'npm', label: 'npm Package', suffix: '/npm' },
];

export function IntegrationTabs({ slug, active }) {
  return (
    <nav className="integration-tabs" aria-label="Widget integration">
      {TABS.map((tab) => (
        <Link
          key={tab.id}
          to={`/listing/${slug}${tab.suffix}`}
          className={`integration-tabs__tab${active === tab.id ? ' integration-tabs__tab--active' : ''}`}
          aria-current={active === tab.id ? 'page' : undefined}
        >
          {tab.label}
        </Link>
      ))}
    </nav>
  );
}

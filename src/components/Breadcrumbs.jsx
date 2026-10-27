export function Breadcrumbs({ crumbs }) {
  return (
    <nav className="otodom-breadcrumbs" aria-label="Breadcrumb">
      {crumbs.map((crumb, index) => (
        <span key={crumb}>
          {index > 0 && <span className="otodom-breadcrumbs__sep">›</span>}
          <a href="#">{crumb}</a>
        </span>
      ))}
    </nav>
  );
}

import { useEffect, useRef, useState } from 'react';

function ChevronDown() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SelectField({ className, label, options, defaultValue }) {
  const initial = options.find((opt) => opt.value === defaultValue) ?? options[0];
  const [selected, setSelected] = useState(initial);
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointer = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`home-search__field home-search__field--select home-select${
        open ? ' home-select--open' : ''
      }${className ? ` ${className}` : ''}`}
    >
      <span className="visually-hidden">{label}</span>
      <button
        type="button"
        className="home-select__trigger"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="home-select__value">{selected.label}</span>
        <ChevronDown />
      </button>

      {open && (
        <ul className="home-select__menu" role="listbox" aria-label={label}>
          {options.map((opt) => (
            <li key={opt.value} role="option" aria-selected={opt.value === selected.value}>
              <button
                type="button"
                className={`home-select__option${
                  opt.value === selected.value ? ' home-select__option--active' : ''
                }`}
                onClick={() => {
                  setSelected(opt);
                  setOpen(false);
                }}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16l4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MapSearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M9 4L3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 4v14M15 6v14" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SmallSearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
      <path d="M15.5 15.5L20 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h.01M4 12h.01M4 18h.01M8 6h12M8 12h12M8 18h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const RECENT_LOCATIONS = [{ name: 'Prusewo', detail: 'wieś, Krokowa, pucki, pomorskie' }];

const LOCATION_ACTIONS = [
  { icon: <MapSearchIcon />, label: 'Szukaj na mapie' },
  { icon: <SmallSearchIcon />, label: 'Szukaj w pobliżu adresu' },
  { icon: <ListIcon />, label: 'Wybierz lokalizację z listy' },
];

function LocationField() {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointer = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`home-search__field home-search__field--location home-location${
        open ? ' home-location--open' : ''
      }`}
    >
      <label>
        <span className="visually-hidden">Lokalizacja</span>
        <input
          type="search"
          placeholder="Wpisz lokalizację"
          name="location-query-nofill"
          autoComplete="off"
          autoCorrect="off"
          spellCheck="false"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onClick={() => setOpen(true)}
          onFocus={() => setOpen(true)}
        />
      </label>

      {open && (
        <div className="home-location__panel">
          <div className="home-location__section">
            <p className="home-location__section-title">Ostatnio wybrane</p>
            {RECENT_LOCATIONS.map((item) => (
              <button
                key={item.name}
                type="button"
                className="home-location__recent"
                onClick={() => {
                  setValue(item.name);
                  setOpen(false);
                }}
              >
                <span className="home-location__recent-name">{item.name}</span>
                <span className="home-location__recent-detail">{item.detail}</span>
              </button>
            ))}
          </div>

          <div className="home-location__actions">
            {LOCATION_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                className="home-location__action"
                onClick={() => setOpen(false)}
              >
                {action.icon}
                <span className="home-location__action-label">{action.label}</span>
                <ChevronRight />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function RangeInput({ placeholder, unit, label }) {
  return (
    <label className="home-search__range-field">
      <span className="visually-hidden">{label}</span>
      <input type="text" placeholder={placeholder} />
      <span className="home-search__range-unit">{unit}</span>
    </label>
  );
}

export function HomeSearchWidget() {
  const [activeTab, setActiveTab] = useState('search');

  return (
    <div className="home-search">
      <div className="home-search__toggle" role="tablist" aria-label="Typ wyszukiwania">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'search'}
          className={`home-search__tab${activeTab === 'search' ? ' home-search__tab--active' : ''}`}
          onClick={() => setActiveTab('search')}
        >
          Szukaj
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'developer'}
          className={`home-search__tab${activeTab === 'developer' ? ' home-search__tab--active' : ''}`}
          onClick={() => setActiveTab('developer')}
        >
          Oferty deweloperów
        </button>
      </div>

      <form className="home-search__form" onSubmit={(event) => event.preventDefault()}>
        <div className="home-search__grid">
          <SelectField
            className="home-search__field--type"
            label="Typ nieruchomości"
            defaultValue="mieszkania"
            options={[
              { value: 'mieszkania', label: 'Mieszkania' },
              { value: 'kawalerki', label: 'Kawalerki' },
              { value: 'domy', label: 'Domy' },
              { value: 'inwestycje', label: 'Inwestycje' },
              { value: 'pokoje', label: 'Pokoje' },
              { value: 'dzialki', label: 'Działki' },
            ]}
          />

          <SelectField
            className="home-search__field--transaction"
            label="Rodzaj transakcji"
            defaultValue="sale"
            options={[
              { value: 'sale', label: 'Na sprzedaż' },
              { value: 'rent', label: 'Do wynajęcia' },
            ]}
          />

          <LocationField />

          <SelectField
            className="home-search__field--radius"
            label="Promień"
            defaultValue="0"
            options={[
              { value: '0', label: '+ 0 km' },
              { value: '5', label: '+ 5 km' },
              { value: '10', label: '+ 10 km' },
              { value: '25', label: '+ 25 km' },
            ]}
          />

          <div className="home-search__range-group home-search__range-group--price">
            <span className="home-search__range-label">Cena</span>
            <div className="home-search__range-inputs">
              <RangeInput placeholder="od" unit="zł" label="Cena od" />
              <RangeInput placeholder="do" unit="zł" label="Cena do" />
            </div>
          </div>

          <div className="home-search__range-group home-search__range-group--area">
            <span className="home-search__range-label">Powierzchnia</span>
            <div className="home-search__range-inputs">
              <RangeInput placeholder="od" unit="m²" label="Powierzchnia od" />
              <RangeInput placeholder="do" unit="m²" label="Powierzchnia do" />
            </div>
          </div>

          <button type="submit" className="home-search__submit">
            <SearchIcon />
            Wyszukaj
          </button>
        </div>
      </form>
    </div>
  );
}

import { ImagePlaceholder } from './ImagePlaceholder.jsx';

export function MediaWithWidgetButton({
  media,
  label,
  className = '',
  variant = 'hero',
  onOpen,
  widgetDisabled = false,
}) {
  const hasImage = Boolean(media.image_url);
  const isThumb = variant === 'thumb';

  return (
    <div className={`media-frame media-frame--${variant} ${className}`.trim()}>
      <div className="media-frame__media">
        {hasImage ? (
          <img src={media.image_url} alt={label} className="media-frame__image" />
        ) : (
          <ImagePlaceholder label={label} className="media-frame__placeholder" />
        )}
      </div>

      <button
        type="button"
        className="media-frame__cta"
        disabled={widgetDisabled || !hasImage}
        title={
          hasImage
            ? 'Reimagine this space'
            : 'Add listing photos to launch the widget'
        }
        onClick={(event) => {
          event.stopPropagation();
          onOpen(media);
        }}
      >
        {isThumb ? (
          <>Reimagine →</>
        ) : (
          <>Reimagine this space →</>
        )}
      </button>
    </div>
  );
}

import { ImagePlaceholder } from './ImagePlaceholder.jsx';

export function GalleryPhoto({ media, label, variant = 'hero', onOpen, disabled = false }) {
  const hasImage = Boolean(media.image_url);

  return (
    <div
      className={`gallery-photo gallery-photo--${variant}`}
      role={onOpen && hasImage ? 'button' : undefined}
      tabIndex={onOpen && hasImage && !disabled ? 0 : undefined}
      onClick={
        onOpen && hasImage && !disabled
          ? () => {
              onOpen(media);
            }
          : undefined
      }
      onKeyDown={
        onOpen && hasImage && !disabled
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onOpen(media);
              }
            }
          : undefined
      }
    >
      {hasImage ? (
        <img src={media.image_url} alt={label} className="gallery-photo__img" />
      ) : (
        <ImagePlaceholder label={label} />
      )}
    </div>
  );
}

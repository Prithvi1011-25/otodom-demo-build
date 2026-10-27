const IMAGE_EXTENSIONS = ['webp', 'png', 'jpg', 'jpeg'];

const imageModules = {
  ...import.meta.glob('../assets/listings/**/*.webp', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
  ...import.meta.glob('../assets/listings/**/*.png', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
  ...import.meta.glob('../assets/listings/**/*.{jpg,jpeg}', {
    eager: true,
    query: '?url',
    import: 'default',
  }),
};

function getPublicFileName(path, index) {
  const fileName = path.split('/').pop() ?? '';
  const ext = fileName.split('.').pop()?.toLowerCase() ?? 'webp';

  if (IMAGE_EXTENSIONS.includes(ext)) {
    return fileName;
  }

  return `${String(index + 1).padStart(2, '0')}.webp`;
}

function getPhotoLabel(fileName) {
  const base = fileName.replace(/\.[^.]+$/, '');

  if (/^\d+$/.test(base)) {
    return `Photo ${Number(base)}`;
  }

  return base
    .replace(/^\d+_?/, '')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function buildMedia(slug) {
  const prefix = `../assets/listings/${slug}/`;

  return Object.entries(imageModules)
    .filter(([path]) => path.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
    .map(([path, url], index) => {
      const number = index + 1;
      const publicFile = getPublicFileName(path, index);

      return {
        id: `photo-${number}`,
        label: getPhotoLabel(publicFile),
        image_url: url,
        publicFile,
      };
    });
}

/**
 * Widget API needs publicly reachable image_url values.
 * UI uses Vite-bundled assets; widget uses stable /listings/{slug}/NN.webp paths.
 */

import { WIDGET_FALLBACK_IMAGE_ORIGIN } from './widgetEnv.js';

const PRIVATE_HOST =
  /^(localhost|127\.0\.0\.1|0\.0\.0\.0|192\.168\.|10\.|172\.(1[6-9]|2\d|3[01])\.)/i;

export function isPrivateOrigin(origin) {
  try {
    return PRIVATE_HOST.test(new URL(origin).hostname);
  } catch {
    return true;
  }
}

export async function getWidgetImageOrigin() {
  const fromEnv = import.meta.env.VITE_WIDGET_IMAGE_ORIGIN?.trim();
  if (fromEnv) return fromEnv.replace(/\/$/, '');

  if (typeof window === 'undefined') {
    return '';
  }

  if (!isPrivateOrigin(window.location.origin)) {
    return window.location.origin;
  }

  // Local dev: widget API needs public URLs — use production-hosted listing images.
  return WIDGET_FALLBACK_IMAGE_ORIGIN.replace(/\/$/, '');
}

function padPhotoNumber(index) {
  return String(index + 1).padStart(2, '0');
}

export async function buildWidgetImageUrl(slug, photoIndex, publicFile) {
  const origin = await getWidgetImageOrigin();
  const fileName = publicFile ?? `${padPhotoNumber(photoIndex)}.webp`;
  return `${origin}/listings/${slug}/${fileName}`;
}

export async function toWidgetMediaItems(allMedia, slug, selectedMedia = allMedia) {
  const items = selectedMedia.filter((item) => item?.image_url);

  return Promise.all(
    items.map(async (item) => {
      const index = allMedia.findIndex((entry) => entry.id === item.id);
      const photoIndex = index >= 0 ? index : 0;
      const image_url = await buildWidgetImageUrl(slug, photoIndex, item.publicFile);
      const payload = { image_url };

      if (item.label) {
        payload.label = item.label;
      }

      return payload;
    }),
  );
}

export function hasWidgetMedia(media) {
  return Array.isArray(media) && media.some((item) => item?.image_url);
}

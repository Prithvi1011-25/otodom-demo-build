import {
  hasWidgetMedia,
  toWidgetMediaItems,
} from './widgetMedia.js';

export {
  WIDGET_DEV_API_BASE_URL,
  WIDGET_DEV_APP_URL,
  WIDGET_LOCAL_API_BASE_URL,
  WIDGET_USER_ID,
} from './widgetEnv.js';

export const WIDGET_SCRIPT_URL = 'https://stage-widget.styldod.com/widget.js';

export const WIDGET_SCRIPT_ID = 'reih-widget-script';

export const WIDGET_PUBLIC_KEY = 'ppk_SQl4LpRx106qAzdVoRSPgmh-';

export const REIH_LOADER_ID = 'reih-host-loader';

export function clearReihLoader() {
  document.getElementById(REIH_LOADER_ID)?.remove();
}

export function resolveMediaUrl(url) {
  if (!url) return '';
  if (url.startsWith('/') && typeof window !== 'undefined') {
    return `${window.location.origin}${url}`;
  }
  return url;
}

export function resolveListingMedia(media = []) {
  return media
    .filter((item) => item?.image_url)
    .map((item) => ({
      ...item,
      image_url: resolveMediaUrl(item.image_url),
    }));
}

/** Media payload for widget API — public listing URLs only, no extra keys. */
export async function resolveWidgetMedia(allMedia, slug, selectedMedia = allMedia) {
  return toWidgetMediaItems(allMedia, slug, selectedMedia);
}

export { hasWidgetMedia };

/** Active widget UI locale — must be a string (stage embed calls `.trim()` on this value). */
export const WIDGET_DEFAULT_LANGUAGE = 'pl-PL';

/** Catalog entries for docs; do not pass this array as `language` (breaks session load). */
export function buildWidgetLanguage() {
  return [
    { code: 'pl-PL', name: 'Polish', nativeName: 'Polski' },
    { code: 'en-US', name: 'English (United States)', nativeName: 'English (US)' },
  ];
}

export function normalizeWidgetLanguage(languageCode) {
  const trimmed = typeof languageCode === 'string' ? languageCode.trim() : '';
  const allowed = buildWidgetLanguage().map((entry) => entry.code);
  return allowed.includes(trimmed) ? trimmed : WIDGET_DEFAULT_LANGUAGE;
}

export function buildWidgetBranding() {
  return {
    logo: 'https://ecdn.styldod.com/assets/logo/6a2bca9bce2a355c2c13d058.svg',
  };
}

// export function buildWidgetBody() {
//   return {
//     text: 'Like these arrangements?',
//     subtext:
//       'Contact the advertiser to see this property in person or ask about the details.',
//     actions_label: 'Contact the advertiser',
//   };
// }

// export function buildWidgetHeader() {
//   return {
//     text: 'Visualize Your Space',
//     subtext: 'See how this property could look with different styles',
//     actions_label: 'Schedule a Viewing',
//   };
// }

// export function buildWidgetFooter() {
//   return {
//     text: 'Powered by ReimagineHome',
//     subtext: 'AI-powered interior design at your fingertips',
//     actions_label: 'Learn More',
//   };
// }

let widgetCallbackOverrides = {};

const widgetCallbacks = {
  onComplete: (detail) => {
    console.log('[reih] onComplete:', detail);
  },
  onError: (err) => {
    console.error('[reih] onError:', err);
  },
  onClose: () => {
    console.log('[reih] onClose: widget closed');
  },
  onActionClick: (section) => {
    widgetCallbackOverrides.onActionClick?.(section);
    if (!widgetCallbackOverrides.onActionClick) {
      console.log('[reih] onActionClick fired:', section);
    }
  },
};

export function setWidgetCallbackOverrides(overrides = {}) {
  widgetCallbackOverrides = overrides;
}

/** Widget listing_id — URL slug (e.g. property-4), not the demo numeric id in listings.js. */
export function resolveWidgetListingId(listing) {
  if (!listing) return '';
  return String(listing.slug ?? listing.id ?? '');
}

function buildWidgetIdentity(listing, userId) {
  const identity = {};
  const trimmedUserId = typeof userId === 'string' ? userId.trim() : '';

  if (trimmedUserId) {
    identity.user_id = trimmedUserId;
  }

  const listingId = resolveWidgetListingId(listing);
  if (listingId) {
    identity.listing_id = listingId;
  }

  return identity;
}

function buildWidgetOptions(listing, userId, languageCode = WIDGET_DEFAULT_LANGUAGE) {
  return {
    // mode: 'simple',
    ...buildWidgetIdentity(listing, userId),
    branding: buildWidgetBranding(),
    // body: buildWidgetBody(),
    // header: buildWidgetHeader(),
    // footer: buildWidgetFooter(),
    // sidebar_position: 'right',
    language: normalizeWidgetLanguage(languageCode),
    ...widgetCallbacks,
  };
}

export function getWidgetHostCssVars() {
  return {};
}

export async function openReihWithMedia(
  widget,
  media,
  listing,
  userId,
  languageCode = WIDGET_DEFAULT_LANGUAGE,
) {
  clearReihLoader();
  if (media.length === 0) {
    console.warn('[reih] No images configured for this listing yet.');
    return;
  }

  await widget.open({
    media,
    ...buildWidgetOptions(listing, userId, languageCode),
  });
}

export function waitForReihWidget(timeoutMs = 30_000) {
  const existing = window.reihWidget;
  if (existing && typeof existing.open === 'function') {
    return Promise.resolve(existing);
  }

  return new Promise((resolve, reject) => {
    const script = document.querySelector('script[src*="widget.js"]');

    let settled = false;
    const finish = (widget) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      clearInterval(poller);
      script?.removeEventListener('load', tryResolve);
      resolve(widget);
    };

    const tryResolve = () => {
      const widget = window.reihWidget;
      if (widget && typeof widget.open === 'function') {
        finish(widget);
      }
    };

    script?.addEventListener('load', tryResolve);
    const poller = window.setInterval(tryResolve, 50);

    const timer = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      clearInterval(poller);
      script?.removeEventListener('load', tryResolve);
      reject(new Error('[reih] Widget script did not load in time'));
    }, timeoutMs);

    tryResolve();
  });
}

export async function buildScriptEmbedWidgetConfig(
  media,
  slug,
  listing,
  userId,
  selectedMedia = media,
  languageCode = WIDGET_DEFAULT_LANGUAGE,
) {
  return {
    media: await resolveWidgetMedia(media, slug, selectedMedia),
    ...buildWidgetOptions(listing, userId, languageCode),
  };
}

/** CDN embed: set window.reihWidgetConfig before open (public_key lives on data-public-key). */
export async function setScriptEmbedConfig(
  media,
  slug,
  listing,
  userId,
  selectedMedia = media,
  languageCode = WIDGET_DEFAULT_LANGUAGE,
) {
  window.reihWidgetConfig = await buildScriptEmbedWidgetConfig(
    media,
    slug,
    listing,
    userId,
    selectedMedia,
    languageCode,
  );
}

export async function buildWidgetConfig(
  media,
  slug,
  listing,
  userId,
  languageCode = WIDGET_DEFAULT_LANGUAGE,
) {
  return {
    public_key: WIDGET_PUBLIC_KEY,
    ...(await buildScriptEmbedWidgetConfig(
      media,
      slug,
      listing,
      userId,
      media,
      languageCode,
    )),
  };
}

/** npm package: public_key and defaults passed to reihWidget.configure(). */
export function buildNpmWidgetConfigureOptions(
  listing,
  userId,
  languageCode = WIDGET_DEFAULT_LANGUAGE,
) {
  return {
    public_key: WIDGET_PUBLIC_KEY,
    ...buildWidgetOptions(listing, userId, languageCode),
  };
}

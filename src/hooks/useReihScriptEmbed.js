import { useCallback, useEffect, useRef } from 'react';
import {
  WIDGET_PUBLIC_KEY,
  WIDGET_SCRIPT_ID,
  WIDGET_SCRIPT_URL,
  buildScriptEmbedWidgetConfig,
  clearReihLoader,
  openReihWithMedia,
  resolveWidgetMedia,
  setScriptEmbedConfig,
  setWidgetCallbackOverrides,
  waitForReihWidget,
} from '../widgetConfig.js';
import { hasWidgetMedia } from '../widgetMedia.js';

/** Matches widget iframe slide-out duration (reimaginehome-widget SLIDE_MS). */
const WIDGET_CLOSE_MS = 300;

/**
 * CDN script-embed integration — injects widget.js and uses window.reihWidget.
 * public_key is set on the script tag's data-public-key, not in reihWidgetConfig.
 */
export function useReihScriptEmbed(
  media,
  slug,
  { listing, onActionClick, userId, language } = {},
) {
  const openingRef = useRef(false);
  const mediaRef = useRef(media);
  const slugRef = useRef(slug);
  const listingRef = useRef(listing);
  const userIdRef = useRef(userId);
  const languageRef = useRef(language);
  const onActionClickRef = useRef(onActionClick);

  useEffect(() => {
    onActionClickRef.current = onActionClick;
  }, [onActionClick]);

  useEffect(() => {
    setWidgetCallbackOverrides({
      onActionClick: (section) => {
        window.reihWidget?.close?.();
        clearReihLoader();
        window.setTimeout(() => {
          onActionClickRef.current?.(section);
        }, WIDGET_CLOSE_MS);
      },
    });

    return () => {
      setWidgetCallbackOverrides({});
    };
  }, []);

  useEffect(() => {
    userIdRef.current = userId;
  }, [userId]);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    mediaRef.current = media;
    slugRef.current = slug;
    listingRef.current = listing;

    let cancelled = false;

    (async () => {
      if (!cancelled) {
        await setScriptEmbedConfig(
          media,
          slug,
          listing,
          userId ?? '',
          media,
          language ?? '',
        );
      }
    })();

    const onScriptLoad = () => {
      void setScriptEmbedConfig(
        mediaRef.current,
        slugRef.current,
        listingRef.current,
        userIdRef.current,
        mediaRef.current,
        languageRef.current ?? '',
      );
    };

    let script = document.getElementById(WIDGET_SCRIPT_ID);

    if (!script) {
      script = document.createElement('script');
      script.id = WIDGET_SCRIPT_ID;
      script.src = `${WIDGET_SCRIPT_URL}?v=${Date.now()}`;
      script.async = true;
      script.setAttribute('data-public-key', WIDGET_PUBLIC_KEY);
      script.addEventListener('load', onScriptLoad);
      document.body.appendChild(script);
    } else {
      script.addEventListener('load', onScriptLoad);
    }

    return () => {
      cancelled = true;
      script?.removeEventListener('load', onScriptLoad);
      window.reihWidget?.destroy?.();
      clearReihLoader();
    };
  }, [media, slug, listing, userId, language]);

  const openWidget = useCallback(async (selectedMedia) => {
    if (openingRef.current) return;

    openingRef.current = true;
    try {
      const widgetMedia = await resolveWidgetMedia(
        mediaRef.current,
        slugRef.current,
        selectedMedia,
      );

      window.reihWidgetConfig = await buildScriptEmbedWidgetConfig(
        mediaRef.current,
        slugRef.current,
        listingRef.current,
        userIdRef.current,
        selectedMedia,
        languageRef.current ?? '',
      );

      const widget = await waitForReihWidget();
      widget.destroy();
      clearReihLoader();
      await openReihWithMedia(
        widget,
        widgetMedia,
        listingRef.current,
        userIdRef.current,
        languageRef.current ?? '',
      );
    } catch (error) {
      clearReihLoader();
      console.error('[reih] Widget open failed:', error);
    } finally {
      openingRef.current = false;
    }
  }, []);

  const openAll = useCallback(() => {
    void openWidget(mediaRef.current);
  }, [openWidget]);

  const openSingle = useCallback(
    (item) => {
      if (!item?.image_url) return;
      void openWidget([item]);
    },
    [openWidget],
  );

  const hasImages = hasWidgetMedia(media);

  return { openAll, openSingle, hasImages };
}

import { useCallback, useEffect, useRef } from 'react';
import { reihWidget } from 'reimaginehome-widget';
import {
  buildNpmWidgetConfigureOptions,
  clearReihLoader,
  resolveWidgetMedia,
  resolveWidgetListingId,
  setWidgetCallbackOverrides,
} from '../widgetConfig.js';
import { hasWidgetMedia } from '../widgetMedia.js';

/** Matches widget iframe slide-out duration (reimaginehome-widget SLIDE_MS). */
const WIDGET_CLOSE_MS = 300;

/**
 * npm package integration — import reimaginehome-widget and use reihWidget.configure/open.
 */
export function useReihNpmPackage(
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
        reihWidget.close?.();
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
    reihWidget.configure(
      buildNpmWidgetConfigureOptions(listing, userId ?? '', language ?? ''),
    );

    return () => {
      reihWidget.destroy();
      clearReihLoader();
    };
  }, [listing, userId, language]);

  useEffect(() => {
    mediaRef.current = media;
    slugRef.current = slug;
    listingRef.current = listing;
  }, [media, slug, listing]);

  const openWidget = useCallback(async (selectedMedia) => {
    if (openingRef.current) return;

    openingRef.current = true;
    try {
      const widgetMedia = await resolveWidgetMedia(
        mediaRef.current,
        slugRef.current,
        selectedMedia,
      );

      if (widgetMedia.length === 0) {
        console.warn('[reih] No images configured for this listing yet.');
        return;
      }

      reihWidget.destroy();
      clearReihLoader();
      reihWidget.configure(
        buildNpmWidgetConfigureOptions(
          listingRef.current,
          userIdRef.current,
          languageRef.current ?? '',
        ),
      );

      const listingId = resolveWidgetListingId(listingRef.current);
      await reihWidget.open({
        media: widgetMedia,
        ...(listingId ? { listing_id: listingId } : {}),
        ...(userIdRef.current?.trim()
          ? { user_id: userIdRef.current.trim() }
          : {}),
        language: languageRef.current ?? '',
      });
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

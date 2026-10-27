const STAGE_WIDGET_APP_URL = 'https://stage-widget.styldod.com';
const STAGE_API_BASE_URL = 'https://stage-ep-api.styldod.com';

/** Rewrites reimaginehome-widget prod URLs to stage at bundle time. */
export function reihStageEnv() {
  return {
    name: 'reih-stage-env',
    enforce: 'pre',
    transform(code, id) {
      if (!id.includes('node_modules/reimaginehome-widget')) {
        return null;
      }

      return {
        code: code
          .replace(/return "prod"/, 'return "stage"')
          .replaceAll('https://widget.styldod.com', STAGE_WIDGET_APP_URL)
          .replaceAll('https://ep-api.styldod.com', STAGE_API_BASE_URL),
        map: null,
      };
    },
  };
}

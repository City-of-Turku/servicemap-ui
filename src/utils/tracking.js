import MatomoTracker from '@datapunt/matomo-tracker-js';
import { isMobileDevice } from '.';
import config from '../../config';
import featureFlags from '../../config/featureFlags';
import ServiceMapAPI from './newFetch/ServiceMapAPI';
import { isEmbed } from './path';

const externalTheme = config.themePKG;
const isExternalTheme = !externalTheme || externalTheme === 'undefined' ? null : externalTheme;

const sourceOptional = `${config.matomoUrl}/piwik.min.js`;
const sourceDefault = `${config.matomoUrl}/matomo.js`;

const trackerOptional = `${config.matomoUrl}/tracker.php`;
const trackerDefault = `${config.matomoUrl}/matomo.php`;

const matomoTracker = (config.matomoSiteId && config.matomoUrl)
  ? new MatomoTracker({
    urlBase: `${config.matomoUrl}`,
    siteId: config.matomoSiteId,
    trackerUrl: isExternalTheme ? trackerDefault : trackerOptional, // optional, default value: `${urlBase}matomo.php`
    srcUrl: isExternalTheme ? sourceDefault : sourceOptional, // optional, default value: `${urlBase}matomo.js`
    disabled: false, // optional, false by default. Makes all tracking calls no-ops if set to true.
    linkTracking: false, // optional, default value: true
  }) : null;

// Simple servicemap page view tracking that tracks only visit count, embed, and mobile data
// since Matomo can't be used in embed since it saves user specific data and requires user
// permissions which causes issues with question box
export const servicemapTrackPageView = () => {
  if (featureFlags.servicemapPageTracking) {
    const smAPI = new ServiceMapAPI();
    smAPI.sendStats({
      embed: isEmbed() ? 1 : 0,
      mobile_device: isMobileDevice() ? 1 : 0,
    });
  }
};

export default matomoTracker;

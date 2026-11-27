/* eslint-disable global-require */
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { transitIconSize } from '../../config/mapConfig';
import withPopupAboveIcon from '../../../../utils/popupAnchor';

/**
 * Create the map icon of a transit stop. Also used by other map layers that show transit stops,
 * e.g. the bus stops of the accessibility zones.
 * @param {number} type vehicle type of the stop
 * @param {Object} classes MapView styles
 * @param {boolean} isExternalTheme
 * @returns {Object} Leaflet divIcon
 */
const createTransitIcon = (type, classes, isExternalTheme = false) => {
  const { divIcon } = require('leaflet');
  let icon;

  switch (type) {
    case 3: // Bus stops
      icon = <span aria-hidden className={`${classes.transitIconMap} ${classes.busIconColor} icon-icon-hsl-bus`} />;
      break;
    case 0: // Tram stops
      icon = <span aria-hidden className={`${classes.transitIconMap} ${classes.tramIconColor} icon-icon-hsl-tram`} />;
      break;
    case 109: // Train stops
      icon = <span aria-hidden className={`${classes.transitIconMap} ${classes.trainIconColor} icon-icon-hsl-train`} />;
      break;
    case 1: // Subway stops
      icon = <span aria-hidden className={`${classes.transitIconMap} ${classes.metroIconColor} icon-icon-hsl-metro`} />;
      break;
    case 7: // Bike stations
      icon = <span aria-hidden className={`${classes.transitIconMap} ${classes.bikeIconColor} icon-icon-hsl-bike`} />;
      break;
    case 4: // Ferry stops
      icon = <span aria-hidden className={`${classes.transitIconMap} ${classes.ferryIconColor} icon-icon-hsl-ferry`} />;
      break;
    case -999:
      icon = (
        <span
          aria-hidden
          className={`${classes.transitIconMap} ${
            isExternalTheme ? classes.busIconColorDark : classes.busIconColor
          } icon-icon-hsl-bus`}
        />
      );
      break;
    default:
      icon = <span aria-hidden className={`${classes.transitIconMap} ${classes.busIconColor} icon-icon-hsl-bus`} />;
      break;
  }

  return divIcon(withPopupAboveIcon({
    html: renderToStaticMarkup(
      <>
        <span aria-hidden className={`${classes.transitBackground} icon-icon-hsl-background`} />
        {icon}
      </>,
    ),
    iconSize: [transitIconSize, transitIconSize],
  }));
};

export default createTransitIcon;

/* eslint-disable global-require, no-use-before-define */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { renderToStaticMarkup } from 'react-dom/server';
import { useMapEvents } from 'react-leaflet';
import TransitStopInfo from './TransitStopInfo';
import { fetchStops } from '../../utils/transitFetch';
import { transitIconSize } from '../../config/mapConfig';
import config from '../../../../../config';
import { isEmbed } from '../../../../utils/path';
import useMobileStatus from '../../../../utils/isMobile';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';

const TransitStops = ({ mapObject, classes }) => {
  const isMobile = useMobileStatus();
  const { Marker, Popup } = global.rL;

  const [transitStops, setTransitStops] = useState([]);
  const { showBusStops } = useMobilityPlatformContext();

  // If external theme (by Turku) is true, then can be used to select which color to render
  const externalTheme = config.themePKG;
  const isExternalTheme = !externalTheme || externalTheme === 'undefined' ? null : externalTheme;


  const map = useMapEvents({
    zoomend() {
      setZoomLevel(map.getZoom());
    },
    moveend() {
      handleTransit();
    },
  });

  const [zoomLevel, setZoomLevel] = useState(map.getZoom());
  const transitZoom = isMobile
    ? mapObject.options.detailZoom - 1 : mapObject.options.detailZoom;

  // Check if transit stops should be shown
  const showTransitStops = () => {
    const url = new URL(window.location);
    const embeded = isEmbed({ url: url.toString() });
    const isDataValid = transitStops.length > 0;
    const showTransit = (showBusStops && isDataValid && !embeded) || (isDataValid && url.searchParams.get('transit') === '1');
    return (zoomLevel >= transitZoom) && showTransit;
  };

  const fetchTransitStops = () => {
    fetchStops(map)
      .then((stops) => {
        setTransitStops(stops);
      });
  };

  const handleTransit = () => {
    if (zoomLevel >= transitZoom) {
      fetchTransitStops();
    }
  };

  const getTransitIcon = (type) => {
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
      case -999: case 4: // Ferry stops
        icon = <spanz aria-hidden className={`${classes.transitIconMap} ${classes.ferryIconColor} icon-icon-hsl-ferry`} />;
        break;
      default:
        icon = (
          <span
            aria-hidden
            className={`${classes.transitIconMap} ${
              isExternalTheme ? classes.busIconColorDark : classes.busIconColor
            } icon-icon-hsl-bus`}
          />
        );
        break;
    }

    return divIcon({
      html: renderToStaticMarkup(
        <>
          <span aria-hidden className={`${classes.transitBackground} icon-icon-hsl-background`} />
          {icon}
        </>,
      ),
      iconSize: [transitIconSize, transitIconSize],
      popupAnchor: [0, -13],
    });
  };

  const closePopup = () => {
    map.closePopup();
  };

  return (
    showTransitStops() ? transitStops.map((stop) => {
      const icon = getTransitIcon(stop.vehicleType);
      return (
        <Marker
          icon={icon}
          key={stop.name.fi + stop.gtfsId}
          position={[stop.lat, stop.lon]}
          keyboard={false}
        >
          <div aria-hidden>
            <Popup closeButton={false} className="popup" autoPan={false}>
              <TransitStopInfo
                stop={stop}
                onCloseClick={() => closePopup()}
              />
            </Popup>
          </div>
        </Marker>
      );
    }) : null
  );
};

TransitStops.propTypes = {
  mapObject: PropTypes.objectOf(PropTypes.any).isRequired,
  classes: PropTypes.objectOf(PropTypes.any).isRequired,
  isMobile: PropTypes.bool,
};

TransitStops.defaultProps = {
  isMobile: false,
};

export default TransitStops;

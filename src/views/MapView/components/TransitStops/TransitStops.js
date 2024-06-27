/* eslint-disable global-require, no-use-before-define */
import { css } from '@emotion/css';
import styled from '@emotion/styled';
import { useTheme } from '@mui/styles';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { useMapEvents } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { selectMapType } from '../../../../redux/selectors/settings';
import useMobileStatus from '../../../../utils/isMobile';
import { isEmbed } from '../../../../utils/path';
import { transitIconSize } from '../../config/mapConfig';
import { fetchBikeStations, fetchStops } from '../../utils/transitFetch';
import TransitStopInfo from './TransitStopInfo';
import getTypeAndClass from './util/util';

const StyledTransitIconMap = styled.span(({ color }) => ({
  fontSize: transitIconSize,
  height: transitIconSize,
  margin: 0,
  lineHeight: 1,
  textShadow: '-1px 0 #fff, 0 1px #fff, 1px 0 #fff, 0 -1px #fff',
  color,
}));

const TransitStops = ({ mapObject }) => {
  const isMobile = useMobileStatus();
  const useContrast = useSelector(selectMapType) === 'accessible_map';
  const { Marker, Popup } = global.rL;
  const theme = useTheme();

  const [transitStops, setTransitStops] = useState([]);
  const [rentalBikeStations, setRentalBikeStations] = useState([]);
  const [visibleBikeStations, setVisibleBikeStations] = useState([]);
  const [bikeStationsLoaded, setBikeStationsLoaded] = useState(false);

  const { showBusStops } = useMobilityPlatformContext();

  // If external theme (by Turku) is true, then can be used to select which color to render
  const externalTheme = config.themePKG;
  const isExternalTheme = !externalTheme || externalTheme === 'undefined' ? null : externalTheme;

  // Theme was undefined inside styled component for some reason
  const transitBackgroundClass = css({
    fontFamily: 'hsl-piktoframe',
    position: 'absolute',
    lineHeight: 0,
    zIndex: theme.zIndex.behind,
    color: 'white',
    fontSize: transitIconSize,
  });

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
      .then(stops => {
        setTransitStops(stops);
      });
  };

  const loadBikeStations = () => {
    if (!bikeStationsLoaded && showTransitStops()) {
      setBikeStationsLoaded(true);
      // Load bike stations only once as all the bike stations are fetched.
      fetchBikeStations()
        .then(stations => {
          const list = stations?.data?.bikeRentalStations || [];
          setRentalBikeStations(list);
          setVisibleBikeStations(showTransitStops() ? list : []);
        });
    }
  };

  const clearTransitStops = () => {
    setTransitStops([]);
  };

  const handleTransit = () => {
    if (zoomLevel >= transitZoom) {
      fetchTransitStops();
      loadBikeStations();
      setVisibleBikeStations(rentalBikeStations);
    } else {
      if (transitStops.length) {
        clearTransitStops();
      }
      if (visibleBikeStations.length) {
        setVisibleBikeStations([]);
      }
    }
  };

  useEffect(() => {
    loadBikeStations();
  }, []);

  const getTransitIcon = type => {
    const { divIcon } = require('leaflet');
    const { color, className } = getTypeAndClass(type);
    return divIcon({
      html: renderToStaticMarkup(
        <>
          <span aria-hidden className={`${transitBackgroundClass} icon-icon-hsl-background`} />
          <StyledTransitIconMap aria-hidden color={useContrast ? '#000000' : color} className={className} />
        </>,
      ),
      iconSize: [transitIconSize, transitIconSize],
      popupAnchor: [0, -13],
    });
  };

  const closePopup = () => {
    map.closePopup();
  };

  if (!showTransitStops()) return null;

  return (
    showTransitStops() ? transitStops.map(stop => {
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
};

TransitStops.defaultProps = {
};

export default TransitStops;

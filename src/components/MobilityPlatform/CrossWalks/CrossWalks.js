/* eslint-disable global-require */
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useMap, useMapEvents } from 'react-leaflet';
import pedestrianIcon from 'servicemap-ui-turku/assets/icons/icons-icon_pedestrian.svg';
import pedestrianIconContrast from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_pedestrian-bw.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapDataBbox } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid } from '../utils/utils';
import MapUtility from '../../../utils/mapUtility';
import MarkerComponent from '../MarkerComponent';

/** Shows crosswalks on the map in marker form */

const CrossWalks = ({ mapObject }) => {
  const [crossWalksData, setCrossWalksData] = useState([]);

  const { openMobilityPlatform, showCrossWalks } = useContext(MobilityPlatformContext);

  const map = useMap();
  const currentZoom = map.getZoom();
  const [zoomLevel, setZoomLevel] = useState(currentZoom);

  const L = require('leaflet');

  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  // TODO verify icons
  const customIcon = icon(createIcon(useContrast ? pedestrianIconContrast : pedestrianIcon));

  const fetchBounds = map.getBounds();
  const cornerBottom = fetchBounds.getSouthWest();
  const cornerTop = fetchBounds.getNorthEast();

  const viewSize = {
    width: Math.abs(cornerBottom.lng - cornerTop.lng),
    height: Math.abs(cornerBottom.lat - cornerTop.lat),
  };

  // Increase the search area by the amount of current view size
  cornerBottom.lat -= viewSize.height;
  cornerBottom.lng -= viewSize.width;
  cornerTop.lat += viewSize.height;
  cornerTop.lng += viewSize.width;

  const wideBounds = L.latLngBounds(cornerTop, cornerBottom);

  // Bounds used in fetch
  const fetchBox = MapUtility.getBboxFromBounds(wideBounds, true);

  const mapEvent = useMapEvents({
    zoomend() {
      setZoomLevel(mapEvent.getZoom());
    },
    moveend() {
      if (openMobilityPlatform && zoomLevel >= mapObject.options.detailZoom) {
        fetchMobilityMapDataBbox('CrossWalkSign', 3000, fetchBox, setCrossWalksData);
      }
    },
  });

  const renderData = zoomLevel >= mapObject.options.detailZoom && isDataValid(showCrossWalks, crossWalksData);

  // TODO update content
  return (
    <>
      {renderData ? (
        crossWalksData.map(item => (
          <MarkerComponent
            key={item.id}
            item={item}
            icon={customIcon}
          >
            <p>temp</p>
          </MarkerComponent>
        ))
      ) : null}
    </>
  );
};

CrossWalks.propTypes = {
  mapObject: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default CrossWalks;

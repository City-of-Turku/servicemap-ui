/* eslint-disable global-require */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useMap, useMapEvents } from 'react-leaflet';
import crossWalkIcon from 'servicemap-ui-turku/assets/icons/icons-icon_crosswalk.svg';
import crossWalkIconContrast from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_crosswalk-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import {
  createIcon, isDataValid, setRender, checkMapType,
} from '../utils/utils';
import { isEmbed } from '../../../utils/path';
import MapUtility from '../../../utils/mapUtility';
import MarkerComponent from '../MarkerComponent';
import TextContent from '../TextContent';

/** Shows crosswalks on the map in marker form */

const CrossWalks = ({ mapObject }) => {
  const [crossWalksData, setCrossWalksData] = useState([]);

  const { openMobilityPlatform, showCrossWalks } = useMobilityPlatformContext();

  const map = useMap();
  const currentZoom = map.getZoom();
  const [zoomLevel, setZoomLevel] = useState(currentZoom);

  const L = require('leaflet');

  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const url = new URL(window.location);
  const embedded = isEmbed({ url: url.toString() });

  const customIcon = icon(createIcon(checkMapType(embedded, useContrast, url) ? crossWalkIconContrast : crossWalkIcon));

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

  const handleCrossWalks = () => {
    const options = {
      type_name: 'CrossWalkSign',
      page_size: 3000,
      bbox: fetchBox,
    };
    if (
      (openMobilityPlatform && zoomLevel >= mapObject.options.detailZoom)
      || (embedded && zoomLevel >= mapObject.options.detailZoom)
    ) {
      fetchMobilityMapData(options, setCrossWalksData);
    }
  };

  const mapEvent = useMapEvents({
    zoomend() {
      setZoomLevel(mapEvent.getZoom());
    },
    moveend() {
      handleCrossWalks();
    },
  });

  const paramValue = url.searchParams.get('crosswalks') === '1';
  const renderData = zoomLevel >= mapObject.options.detailZoom
    && setRender(paramValue, embedded, showCrossWalks, crossWalksData, isDataValid);

  // TODO verify text content
  return (
    <>
      {renderData
        ? crossWalksData.map(item => (
          <MarkerComponent key={item.id} item={item} icon={customIcon}>
            <TextContent
              titleId="mobilityPlatform.content.crosswalks.title"
              translationId="mobilityPlatform.info.short.crosswalks"
            />
          </MarkerComponent>
        ))
        : null}
    </>
  );
};

CrossWalks.propTypes = {
  mapObject: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default CrossWalks;

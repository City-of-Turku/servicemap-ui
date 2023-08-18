/* eslint-disable global-require */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { useMap, useMapEvents } from 'react-leaflet';
import benchIcon from 'servicemap-ui-turku/assets/icons/icons-icon_bench.svg';
import benchIconContrast from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_bench-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import {
  createIcon, isDataValid, setRender, checkMapType,
} from '../utils/utils';
import { isEmbed } from '../../../utils/path';
import MapUtility from '../../../utils/mapUtility';
import MarkerComponent from '../MarkerComponent';
import PublicBenchesContent from './components/PublicBenchesContent';

/** Shows public benches on the map in marker form */

const PublicBenches = ({ mapObject }) => {
  const [publicBenchesData, setPublicBenchesData] = useState([]);

  const { showPublicBenches } = useMobilityPlatformContext();

  const map = useMap();
  const currentZoom = map.getZoom();
  const [zoomLevel, setZoomLevel] = useState(currentZoom);

  const L = require('leaflet');

  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const url = new URL(window.location);
  const embedded = isEmbed({ url: url.toString() });

  const customIcon = icon(createIcon(checkMapType(embedded, useContrast, url) ? benchIconContrast : benchIcon));

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

  const isDetailZoom = zoomLevel >= mapObject.options.detailZoom;

  const handlePublicBenches = () => {
    const options = {
      type_name: 'PublicBench',
      page_size: 1000,
      bbox: fetchBox,
    };
    if (
      (showPublicBenches && isDetailZoom)
      || (embedded && isDetailZoom)
    ) {
      fetchMobilityMapData(options, setPublicBenchesData);
    }
  };

  const mapEvent = useMapEvents({
    zoomend() {
      setZoomLevel(mapEvent.getZoom());
    },
    moveend() {
      handlePublicBenches();
    },
  });

  const paramValue = url.searchParams.get('public_benches') === '1';
  const renderData = isDetailZoom && setRender(paramValue, embedded, showPublicBenches, publicBenchesData, isDataValid);

  return (
    <>
      {renderData
        ? publicBenchesData.map(item => (
          <MarkerComponent key={item.id} item={item} icon={customIcon}>
            <PublicBenchesContent item={item} />
          </MarkerComponent>
        ))
        : null}
    </>
  );
};

PublicBenches.propTypes = {
  mapObject: PropTypes.objectOf(PropTypes.any).isRequired,
};

export default PublicBenches;

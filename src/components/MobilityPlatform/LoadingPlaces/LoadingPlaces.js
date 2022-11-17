import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import loadingPlaceIcon from 'servicemap-ui-turku/assets/icons/icons-icon_loading_place.svg';
import loadingPlaceIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_loading_place-bw.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon } from '../utils/utils';
import LoadingPlacesContent from './components/LoadingPlacesContent';

const LoadingPlaces = () => {
  const [loadingPlaces, setLoadingPlaces] = useState([]);

  const { openMobilityPlatform, showLoadingPlaces } = useContext(MobilityPlatformContext);

  const map = useMap();

  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon(createIcon(useContrast ? loadingPlaceIconBw : loadingPlaceIcon));

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('LUP', 100, setLoadingPlaces);
    }
  }, [openMobilityPlatform, setLoadingPlaces]);

  const renderData = showLoadingPlaces && loadingPlaces && loadingPlaces.length > 0;

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      loadingPlaces.forEach((item) => {
        bounds.push([item.geometry_coords.lat, item.geometry_coords.lon]);
      });
      map.fitBounds(bounds);
    }
  }, [showLoadingPlaces, loadingPlaces]);

  return (
    <>
      {renderData ? (
        loadingPlaces.map(item => (
          <Marker
            key={item.id}
            icon={customIcon}
            position={[item.geometry_coords.lat, item.geometry_coords.lon]}
          >
            <>
              <Popup>
                <LoadingPlacesContent item={item} />
              </Popup>
            </>
          </Marker>
        ))
      ) : null}
    </>
  );
};

export default LoadingPlaces;

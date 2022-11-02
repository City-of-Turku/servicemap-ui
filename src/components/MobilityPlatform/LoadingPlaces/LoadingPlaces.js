import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import loadingPlaceIcon from 'servicemap-ui-turku/assets/icons/icons-icon_loading_place.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid, createIcon } from '../utils/utils';
import LoadingPlacesContent from './components/LoadingPlacesContent';

const LoadingPlaces = () => {
  const [loadingPlaces, setLoadingPlaces] = useState([]);

  const { openMobilityPlatform, mobilityMap } = useContext(MobilityPlatformContext);

  const map = useMap();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon(createIcon(loadingPlaceIcon));

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('LUP', 100, setLoadingPlaces);
    }
  }, [openMobilityPlatform, setLoadingPlaces]);

  const renderData = isDataValid(mobilityMap.loadingPlaces, loadingPlaces);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      loadingPlaces.forEach((item) => {
        bounds.push([item.geometry_coords.lat, item.geometry_coords.lon]);
      });
      map.fitBounds(bounds);
    }
  }, [mobilityMap.loadingPlaces, loadingPlaces]);

  return (
    <>
      {renderData
      && loadingPlaces.map(item => (
        <Marker
          key={item.id}
          icon={customIcon}
          position={[item.geometry_coords.lat, item.geometry_coords.lon]}
        >
          <Popup>
            <LoadingPlacesContent item={item} />
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default LoadingPlaces;

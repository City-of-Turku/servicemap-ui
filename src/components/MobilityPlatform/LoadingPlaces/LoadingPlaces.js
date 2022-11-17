import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapPolygonData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid, fitPolygonsToBounds } from '../utils/utils';
import LoadingPlacesContent from './components/LoadingPlacesContent';

const LoadingPlaces = () => {
  const [loadingPlaces, setLoadingPlaces] = useState([]);

  const { openMobilityPlatform, showLoadingPlaces } = useContext(MobilityPlatformContext);

  const map = useMap();

  const useContrast = useSelector(useAccessibleMap);

  const { Polygon, Popup } = global.rL;

  const blueOptions = { color: 'rgba(7, 44, 115, 255)', weight: 5 };
  const whiteOptions = {
    color: 'rgba(255, 255, 255, 255)',
    fillOpacity: 0.3,
    weight: 5,
    dashArray: '12',
  };
  const pathOptions = useContrast ? whiteOptions : blueOptions;

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapPolygonData('LoadingUnloadingPlace', 200, setLoadingPlaces);
    }
  }, [openMobilityPlatform, setLoadingPlaces]);

  const renderData = isDataValid(showLoadingPlaces, loadingPlaces);

  useEffect(() => {
    fitPolygonsToBounds(renderData, loadingPlaces, map);
  }, [showLoadingPlaces, loadingPlaces]);

  return (
    <>
      {renderData
        ? loadingPlaces.map(item => (
          <Polygon
            key={item.id}
            pathOptions={pathOptions}
            positions={item.geometry_coords}
            eventHandlers={{
              mouseover: (e) => {
                e.target.setStyle({ fillOpacity: useContrast ? '0.6' : '0.2' });
              },
              mouseout: (e) => {
                e.target.setStyle({ fillOpacity: useContrast ? '0.3' : '0.2' });
              },
            }}
          >
            <>
              <Popup>
                <LoadingPlacesContent item={item} />
              </Popup>
            </>
          </Polygon>
        ))
        : null}
    </>
  );
};

export default LoadingPlaces;

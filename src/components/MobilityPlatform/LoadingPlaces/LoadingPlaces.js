/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import loadingPlaceIcon from 'servicemap-ui-turku/assets/icons/icons-icon_loading_place.svg';
import loadingPlaceIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_loading_place-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import useMobilityDataFetch from '../utils/useMobilityDataFetch';
import { isDataValid, fitPolygonsToBounds, createIcon } from '../utils/utils';
import LoadingPlacesContent from './components/LoadingPlacesContent';

const LoadingPlaces = () => {
  const options = {
    type_name: 'LoadingUnloadingPlace',
    page_size: 300,
    latlon: true,
  };

  const { showLoadingPlaces } = useMobilityPlatformContext();

  const map = useMap();

  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon(createIcon(useContrast ? loadingPlaceIconBw : loadingPlaceIcon));

  const { data } = useMobilityDataFetch(options, showLoadingPlaces);
  const renderData = isDataValid(showLoadingPlaces, data);

  useEffect(() => {
    fitPolygonsToBounds(renderData, data, map);
  }, [showLoadingPlaces, data]);

  const getSingleCoordinates = data => data[0][0];

  return (
    renderData
      ? data.map(item => (
        <Marker
          key={item.id}
          icon={customIcon}
          position={getSingleCoordinates(item.geometry_coords)}
        >
          <Popup>
            <LoadingPlacesContent item={item} />
          </Popup>
        </Marker>
      ))
      : null
  );
};

export default LoadingPlaces;

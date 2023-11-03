/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import barbecuePlaceIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_barbecue_place-bw.svg';
import barbecuePlaceIcon from 'servicemap-ui-turku/assets/icons/icons-icon_barbecue_place.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid, fitToMapBounds } from '../utils/utils';
import MarkerComponent from '../MarkerComponent';
import BarbecuePlacesContent from './components/BarbecuePlacesContent';

const BarbecuePlaces = () => {
  const [barbecuePlaces, setBarbecuePlaces] = useState([]);

  const { showBarbecuePlaces } = useMobilityPlatformContext();

  const map = useMap();

  const useContrast = useSelector(useAccessibleMap);

  const { icon } = global.L;

  const customIcon = icon(createIcon(useContrast ? barbecuePlaceIconBw : barbecuePlaceIcon));

  useEffect(() => {
    const options = {
      type_name: 'BarbecuePlace',
    };
    if (showBarbecuePlaces) {
      fetchMobilityMapData(options, setBarbecuePlaces);
    }
  }, [showBarbecuePlaces]);

  const renderData = isDataValid(showBarbecuePlaces, barbecuePlaces);

  useEffect(() => {
    fitToMapBounds(renderData, barbecuePlaces, map);
  }, [showBarbecuePlaces, barbecuePlaces]);

  return (renderData
    ? barbecuePlaces.map((item) => (
      <MarkerComponent key={item.id} item={item} icon={customIcon}>
        <BarbecuePlacesContent item={item} />
      </MarkerComponent>
    ))
    : null
  );
};

export default BarbecuePlaces;

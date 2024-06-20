import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import barbecuePlaceIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_barbecue_place-bw.svg';
import barbecuePlaceIcon from 'servicemap-ui-turku/assets/icons/icons-icon_barbecue_place.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { selectMapRef } from '../../../redux/selectors/general';
import useMobilityDataFetch from '../utils/useMobilityDataFetch';
import { createIcon, isDataValid, fitToMapBounds } from '../utils/utils';
import MarkerComponent from '../MarkerComponent';
import BarbecuePlacesContent from './components/BarbecuePlacesContent';

const BarbecuePlaces = () => {
  const options = {
    type_name: 'BarbecuePlace',
  };

  const { showBarbecuePlaces } = useMobilityPlatformContext();

  const map = useSelector(selectMapRef);
  const useContrast = useSelector(useAccessibleMap);

  const { icon } = global.L;

  const customIcon = icon(createIcon(useContrast ? barbecuePlaceIconBw : barbecuePlaceIcon));

  const { data } = useMobilityDataFetch(options, showBarbecuePlaces);
  const renderData = isDataValid(showBarbecuePlaces, data);

  useEffect(() => {
    fitToMapBounds(renderData, data, map);
  }, [renderData, data, map]);

  return (renderData
    ? data.map(item => (
      <MarkerComponent key={item.id} item={item} icon={customIcon}>
        <BarbecuePlacesContent item={item} />
      </MarkerComponent>
    ))
    : null
  );
};

export default BarbecuePlaces;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import parkAndRideIcon from 'servicemap-ui-turku/assets/icons/icons-icon_park_and_ride_bicycle.svg';
import parkAndRideIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_park_and_ride_bicycle-bw.svg';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import { selectMapRef } from '../../../../redux/selectors/general';
import useMobilityDataFetch from '../../utils/useMobilityDataFetch';
import { createIcon, isDataValid, fitToMapBounds } from '../../utils/utils';
import MarkerComponent from '../../MarkerComponent';
import ParkAndRideBikesContent from './components/ParkAndRideBikesContent';

/**
 * Displays park and ride stops for bikes on the map in marker format.
 */
const ParkAndRideBikes = () => {
  const options = {
    type_name: 'FoliParkAndRideBikesStop',
    page_size: 100,
  };

  const { showParkAndRideBikes } = useMobilityPlatformContext();

  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);
  const map = useSelector(selectMapRef);

  const customIcon = icon(createIcon(useContrast ? parkAndRideIconBw : parkAndRideIcon));

  const { data } = useMobilityDataFetch(options, showParkAndRideBikes);
  const renderData = isDataValid(showParkAndRideBikes, data);

  useEffect(() => {
    fitToMapBounds(renderData, data, map);
  }, [showParkAndRideBikes, data]);

  return (
    renderData
      ? data.map(item => (
        <MarkerComponent key={item.id} item={item} icon={customIcon}>
          <ParkAndRideBikesContent item={item} />
        </MarkerComponent>
      ))
      : null
  );
};

export default ParkAndRideBikes;

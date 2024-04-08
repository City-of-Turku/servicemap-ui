/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import parkAndRideIcon from 'servicemap-ui-turku/assets/icons/icons-icon_park_and_ride_bicycle.svg';
import parkAndRideIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_park_and_ride_bicycle-bw.svg';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid, fitToMapBounds } from '../../utils/utils';
import MarkerComponent from '../../MarkerComponent';
import ParkAndRideBikesContent from './components/ParkAndRideBikesContent';

/**
 * Displays park and ride stops for bikes on the map in marker format.
 */
const ParkAndRideBikes = () => {
  const [parkAndRideBikesData, setParkAndRideBikesData] = useState([]);

  const { showParkAndRideBikes } = useMobilityPlatformContext();

  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const customIcon = icon(createIcon(useContrast ? parkAndRideIconBw : parkAndRideIcon));

  useEffect(() => {
    const options = {
      type_name: 'FoliParkAndRideBikesStop',
      page_size: 100,
    };
    if (showParkAndRideBikes) {
      fetchMobilityMapData(options, setParkAndRideBikesData);
    }
  }, [showParkAndRideBikes]);

  const map = useMap();

  const renderData = isDataValid(showParkAndRideBikes, parkAndRideBikesData);

  useEffect(() => {
    fitToMapBounds(renderData, parkAndRideBikesData, map);
  }, [showParkAndRideBikes, parkAndRideBikesData]);

  return (
    renderData
      ? parkAndRideBikesData.map(item => (
        <MarkerComponent key={item.id} item={item} icon={customIcon}>
          <ParkAndRideBikesContent item={item} />
        </MarkerComponent>
      ))
      : null
  );
};

export default ParkAndRideBikes;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import bikeServiceIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_bike_service_station-bw.svg';
import bikeServiceIcon from 'servicemap-ui-turku/assets/icons/icons-icon_bike_service_station.svg';
import { selectMapRef } from '../../../redux/selectors/general';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import useMobilityDataFetch from '../utils/useMobilityDataFetch';
import { createIcon, isDataValid, fitToMapBounds } from '../utils/utils';
import MarkerComponent from '../MarkerComponent';
import BikeServiceStationContent from './components/BikeServiceStationContent';

const BikeServiceStations = () => {
  const options = {
    type_name: 'BikeServiceStation',
  };

  const { showBikeServiceStations } = useMobilityPlatformContext();

  const map = useSelector(selectMapRef);
  const useContrast = useSelector(useAccessibleMap);

  const { icon } = global.L;
  const customIcon = icon(createIcon(useContrast ? bikeServiceIconBw : bikeServiceIcon));

  const { data } = useMobilityDataFetch(options, showBikeServiceStations);
  const renderData = isDataValid(showBikeServiceStations, data);

  useEffect(() => {
    fitToMapBounds(renderData, data, map);
  }, [showBikeServiceStations, data]);

  return (
    renderData
      ? data.map(item => (
        <MarkerComponent key={item.id} item={item} icon={customIcon}>
          <BikeServiceStationContent station={item} />
        </MarkerComponent>
      ))
      : null
  );
};

export default BikeServiceStations;

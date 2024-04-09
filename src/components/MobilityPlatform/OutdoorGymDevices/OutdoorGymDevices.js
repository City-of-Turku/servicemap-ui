/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import sportIconContrast from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_outdoor_gym-bw.svg';
import sportIcon from 'servicemap-ui-turku/assets/icons/icons-icon_outdoor_gym.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { isDataValid, fitToMapBounds, createIcon } from '../utils/utils';
import useMobilityDataFetch from '../utils/useMobilityDataFetch';
import MarkerComponent from '../MarkerComponent';
import OutdoorGymDevicesContent from './components/OutdoorGymDevicesContent';

const OutdoorGymDevices = () => {
  const options = {
    type_name: 'OutdoorGymDevice',
  };

  const { showOutdoorGymDevices } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  const map = useMap();

  const { icon } = global.L;

  const customIcon = icon(createIcon(useContrast ? sportIconContrast : sportIcon));

  const { data } = useMobilityDataFetch(options, showOutdoorGymDevices);
  const renderData = isDataValid(showOutdoorGymDevices, data);

  useEffect(() => {
    fitToMapBounds(renderData, data, map);
  }, [showOutdoorGymDevices, data]);

  return (
    renderData ? (
      data.map(item => (
        <MarkerComponent
          key={item.id}
          item={item}
          icon={customIcon}
        >
          <OutdoorGymDevicesContent item={item} />
        </MarkerComponent>
      ))
    ) : null
  );
};

export default OutdoorGymDevices;

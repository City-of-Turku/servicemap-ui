/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import parkingMachineIcon from 'servicemap-ui-turku/assets/icons/icons-icon_parking_machine.svg';
import parkingMachineIconContrast from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_parking_machine-bw.svg';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import useMobilityDataFetch from '../../utils/useMobilityDataFetch';
import { createIcon, isDataValid, fitToMapBounds } from '../../utils/utils';
import MarkerComponent from '../../MarkerComponent';
import ParkingGarageContent from './components/ParkingGarageContent';

// TODO Change icon

const ParkingGarages = () => {
  const options = {
    type_name: 'ParkingGarage',
    page_size: 50,
  };

  const { showParkingGarages } = useMobilityPlatformContext();

  const map = useMap();
  const useContrast = useSelector(useAccessibleMap);

  const { icon } = global.L;
  const customIcon = icon(createIcon(useContrast ? parkingMachineIconContrast : parkingMachineIcon));

  const { data } = useMobilityDataFetch(options, showParkingGarages);
  const renderData = isDataValid(showParkingGarages, data);

  useEffect(() => {
    fitToMapBounds(renderData, data, map);
  }, [showParkingGarages, data]);

  return (
    renderData ? (
      data.map(item => (
        <MarkerComponent
          key={item.id}
          item={item}
          icon={customIcon}
        >
          <ParkingGarageContent item={item} />
        </MarkerComponent>
      ))
    ) : null
  );
};

export default ParkingGarages;

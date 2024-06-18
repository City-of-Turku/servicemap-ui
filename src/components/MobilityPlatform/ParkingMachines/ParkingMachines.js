/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import parkingMachineIcon from 'servicemap-ui-turku/assets/icons/icons-icon_parking_machine.svg';
import parkingMachineIconContrast from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_parking_machine-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { selectMapRef } from '../../../redux/selectors/general';
import useMobilityDataFetch from '../utils/useMobilityDataFetch';
import { createIcon, isDataValid, fitToMapBounds } from '../utils/utils';
import MarkerComponent from '../MarkerComponent';
import ParkingMachinesContent from './components/ParkingMachinesContent';

const ParkingMachines = () => {
  const options = {
    type_name: 'ParkingMachine',
    page_size: 200,
  };

  const { showParkingMachines } = useMobilityPlatformContext();

  const map = useSelector(selectMapRef);
  const useContrast = useSelector(useAccessibleMap);

  const { icon } = global.L;
  const customIcon = icon(createIcon(useContrast ? parkingMachineIconContrast : parkingMachineIcon));

  const { data } = useMobilityDataFetch(options, showParkingMachines);
  const renderData = isDataValid(showParkingMachines, data);

  useEffect(() => {
    fitToMapBounds(renderData, data, map);
  }, [showParkingMachines, data]);

  return (
    renderData ? (
      data.map(item => (
        <MarkerComponent
          key={item.id}
          item={item}
          icon={customIcon}
        >
          <ParkingMachinesContent item={item} />
        </MarkerComponent>
      ))
    ) : null
  );
};

export default ParkingMachines;

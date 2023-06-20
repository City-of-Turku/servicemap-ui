/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import parkingMachineIcon from 'servicemap-ui-turku/assets/icons/icons-icon_parking_machine.svg';
import parkingMachineIconContrast from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_parking_machine-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid, fitToMapBounds } from '../utils/utils';
import MarkerComponent from '../MarkerComponent';
import ParkingMachinesContent from './components/ParkingMachinesContent';

const ParkingMachines = () => {
  const [parkingMachinesData, setParkingMachinesData] = useState([]);

  const { showParkingMachines } = useMobilityPlatformContext();

  const map = useMap();

  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const customIcon = icon(createIcon(useContrast ? parkingMachineIconContrast : parkingMachineIcon));

  useEffect(() => {
    const options = {
      type_name: 'ParkingMachine',
      page_size: 500,
    };
    if (showParkingMachines) {
      fetchMobilityMapData(options, setParkingMachinesData);
    }
  }, [showParkingMachines, setParkingMachinesData]);

  const renderData = isDataValid(showParkingMachines, parkingMachinesData);

  useEffect(() => {
    fitToMapBounds(renderData, parkingMachinesData, map);
  }, [showParkingMachines, parkingMachinesData]);

  return (
    <>
      {renderData ? (
        parkingMachinesData.map(item => (
          <MarkerComponent
            key={item.id}
            item={item}
            icon={customIcon}
          >
            <ParkingMachinesContent item={item} />
          </MarkerComponent>
        ))
      ) : null}
    </>
  );
};

export default ParkingMachines;

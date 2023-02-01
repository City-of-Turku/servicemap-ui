import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import chargerIcon from 'servicemap-ui-turku/assets/icons/icons-icon_charging_station.svg';
import chargerIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_charging_station-bw.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid, fitToMapBounds } from '../utils/utils';
import MarkerComponent from '../MarkerComponent';
import ParkingMachinesContent from './components/ParkingMachinesContent';

const ParkingMachines = () => {
  const [parkingMachinesData, setParkingMachinesData] = useState([]);

  const { openMobilityPlatform, showParkingMachines } = useContext(MobilityPlatformContext);

  const map = useMap();

  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  // TODO change icon
  const chargerStationIcon = icon(createIcon(useContrast ? chargerIconBw : chargerIcon));

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('ParkingMachine', 500, setParkingMachinesData);
    }
  }, [openMobilityPlatform, setParkingMachinesData]);

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
            icon={chargerStationIcon}
          >
            <ParkingMachinesContent item={item} />
          </MarkerComponent>
        ))
      ) : null}
    </>
  );
};

export default ParkingMachines;

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
import ChargerStationContent from './components/ChargerStationContent';

const ChargerStationMarkers = () => {
  const [chargerStations, setChargerStations] = useState([]);

  const { openMobilityPlatform, showChargingStations } = useContext(MobilityPlatformContext);

  const map = useMap();

  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const chargerStationIcon = icon(createIcon(useContrast ? chargerIconBw : chargerIcon));

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('ChargingStation', 500, setChargerStations);
    }
  }, [openMobilityPlatform, setChargerStations]);

  const renderData = isDataValid(showChargingStations, chargerStations);

  useEffect(() => {
    fitToMapBounds(renderData, chargerStations, map);
  }, [showChargingStations, chargerStations]);

  return (
    <>
      {renderData ? (
        chargerStations.map(item => (
          <MarkerComponent
            key={item.id}
            item={item}
            icon={chargerStationIcon}
          >
            <ChargerStationContent
              station={item}
            />
          </MarkerComponent>
        ))
      ) : null}
    </>
  );
};

export default ChargerStationMarkers;

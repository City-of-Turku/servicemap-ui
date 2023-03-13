/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import chargerIcon from 'servicemap-ui-turku/assets/icons/icons-icon_charging_station.svg';
import chargerIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_charging_station-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid, fitToMapBounds } from '../utils/utils';
import MarkerComponent from '../MarkerComponent';
import ChargerStationContent from './components/ChargerStationContent';

const ChargerStationMarkers = () => {
  const [chargerStations, setChargerStations] = useState([]);

  const { openMobilityPlatform, showChargingStations } = useMobilityPlatformContext();

  const map = useMap();

  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const chargerStationIcon = icon(createIcon(useContrast ? chargerIconBw : chargerIcon));

  useEffect(() => {
    const options = {
      type_name: 'ChargingStation',
      page_size: 200,
      srid: 4326,
    };
    if (openMobilityPlatform) {
      fetchMobilityMapData(options, setChargerStations);
    }
  }, [openMobilityPlatform, setChargerStations]);

  const renderData = isDataValid(showChargingStations, chargerStations);

  useEffect(() => {
    fitToMapBounds(renderData, chargerStations, map);
  }, [showChargingStations, chargerStations]);

  return (
    <>
      {renderData
        ? chargerStations.map(item => (
          <MarkerComponent key={item.id} item={item} icon={chargerStationIcon}>
            <ChargerStationContent station={item} />
          </MarkerComponent>
        ))
        : null}
    </>
  );
};

export default ChargerStationMarkers;

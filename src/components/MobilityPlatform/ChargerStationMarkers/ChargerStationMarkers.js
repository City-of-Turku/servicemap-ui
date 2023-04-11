/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import chargerIcon from 'servicemap-ui-turku/assets/icons/icons-icon_charging_station.svg';
import chargerIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_charging_station-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import {
  createIcon, isDataValid, fitToMapBounds, setRender, checkMapType,
} from '../utils/utils';
import { isEmbed } from '../../../utils/path';
import MarkerComponent from '../MarkerComponent';
import ChargerStationContent from './components/ChargerStationContent';

const ChargerStationMarkers = () => {
  const [chargerStations, setChargerStations] = useState([]);

  const { openMobilityPlatform, showChargingStations } = useMobilityPlatformContext();

  const map = useMap();

  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const url = new URL(window.location);
  const embeded = isEmbed({ url: url.toString() });

  const chargerStationIcon = icon(createIcon(checkMapType(embeded, useContrast, url) ? chargerIconBw : chargerIcon));

  useEffect(() => {
    const options = {
      type_name: 'ChargingStation',
      page_size: 200,
    };
    if (openMobilityPlatform || embeded) {
      fetchMobilityMapData(options, setChargerStations);
    }
  }, [openMobilityPlatform, setChargerStations]);

  const paramValue = url.searchParams.get('charging_station') === '1';
  const renderData = setRender(paramValue, embeded, showChargingStations, chargerStations, isDataValid);

  useEffect(() => {
    if (!embeded) {
      fitToMapBounds(renderData, chargerStations, map);
    }
  }, [showChargingStations, chargerStations, embeded]);

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

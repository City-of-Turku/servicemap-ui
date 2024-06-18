/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import chargerIcon from 'servicemap-ui-turku/assets/icons/icons-icon_charging_station.svg';
import chargerIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_charging_station-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { selectMapRef } from '../../../redux/selectors/general';
import {
  createIcon, isDataValid, fitToMapBounds, setRender, checkMapType,
} from '../utils/utils';
import { isEmbed } from '../../../utils/path';
import useMobilityDataFetch from '../utils/useMobilityDataFetch';
import MarkerComponent from '../MarkerComponent';
import ChargerStationContent from './components/ChargerStationContent';

const ChargerStationMarkers = () => {
  const options = {
    type_name: 'ChargingStation',
    page_size: 600,
  };

  const { showChargingStations } = useMobilityPlatformContext();

  const map = useSelector(selectMapRef);
  const useContrast = useSelector(useAccessibleMap);

  const { icon } = global.L;

  const url = new URL(window.location);
  const embedded = isEmbed({ url: url.toString() });

  const { data } = useMobilityDataFetch(options, showChargingStations, embedded);

  const chargerStationIcon = icon(createIcon(checkMapType(embedded, useContrast, url) ? chargerIconBw : chargerIcon));

  const paramValue = url.searchParams.get('charging_station') === '1';
  const renderData = setRender(paramValue, embedded, showChargingStations, data, isDataValid);

  useEffect(() => {
    if (!embedded) {
      fitToMapBounds(renderData, data, map);
    }
  }, [showChargingStations, data, embedded]);

  return (
    renderData
      ? data.map(item => (
        <MarkerComponent key={item.id} item={item} icon={chargerStationIcon}>
          <ChargerStationContent station={item} />
        </MarkerComponent>
      ))
      : null
  );
};

export default ChargerStationMarkers;

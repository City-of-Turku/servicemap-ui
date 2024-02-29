/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import chargerIcon from 'servicemap-ui-turku/assets/icons/icons-icon_charging_station.svg';
import chargerIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_charging_station-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap, getCitySettings } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import {
  createIcon, isDataValid, fitToMapBounds, setRender, checkMapType,
} from '../utils/utils';
import config from '../../../../config';
import { isEmbed } from '../../../utils/path';
import MarkerComponent from '../MarkerComponent';
import ChargerStationContent from './components/ChargerStationContent';

const ChargerStationMarkers = () => {
  const [chargerStations, setChargerStations] = useState([]);

  const { showChargingStations } = useMobilityPlatformContext();

  const map = useMap();

  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);
  const citySettings = useSelector(getCitySettings);

  const url = new URL(window.location);
  const embedded = isEmbed({ url: url.toString() });

  const chargerStationIcon = icon(createIcon(checkMapType(embedded, useContrast, url) ? chargerIconBw : chargerIcon));

  useEffect(() => {
    const options = {
      type_name: 'ChargingStation',
      page_size: 600,
    };
    if (showChargingStations || embedded) {
      fetchMobilityMapData(options, setChargerStations);
    }
  }, [showChargingStations, embedded]);

  const checkCitySettings = citiesArray => {
    if (citiesArray?.length > 0) {
      return citiesArray;
    }
    return config.cities;
  };

  /** Separate roadworks of Turku from the rest */
  const chargerStationsFiltered = chargerStations.reduce((acc, curr) => {
    const selectedCities = config.cities.filter(c => citySettings[c]);
    const cities = checkCitySettings(selectedCities);
    if (
      cities.includes(curr.municipality.toLowerCase())
    ) {
      acc.push(curr);
    }
    return acc;
  }, []);

  const paramValue = url.searchParams.get('charging_station') === '1';
  const renderData = setRender(paramValue, embedded, showChargingStations, chargerStationsFiltered, isDataValid);

  useEffect(() => {
    if (!embedded) {
      fitToMapBounds(renderData, chargerStationsFiltered, map);
    }
  }, [showChargingStations, chargerStationsFiltered, embedded]);

  return (
    renderData
      ? chargerStationsFiltered.map(item => (
        <MarkerComponent key={item.id} item={item} icon={chargerStationIcon}>
          <ChargerStationContent station={item} />
        </MarkerComponent>
      ))
      : null
  );
};

export default ChargerStationMarkers;

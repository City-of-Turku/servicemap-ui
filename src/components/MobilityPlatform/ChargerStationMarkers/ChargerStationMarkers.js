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
import { isEmbed } from '../../../utils/path';
import MarkerComponent from '../MarkerComponent';
import ChargerStationContent from './components/ChargerStationContent';

const ChargerStationMarkers = () => {
  const [chargerStations, setChargerStations] = useState([]);

  const { openMobilityPlatform, showChargingStations } = useMobilityPlatformContext();

  const map = useMap();

  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const chargerStationIcon = icon(createIcon(useContrast ? chargerIconBw : chargerIcon));

  const url = new URL(window.location);
  const embeded = isEmbed({ url: url.toString() });

  useEffect(() => {
    const options = {
      type_name: 'ChargingStation',
      page_size: 200,
    };
    if (openMobilityPlatform || embeded) {
      fetchMobilityMapData(options, setChargerStations);
    }
  }, [openMobilityPlatform, setChargerStations]);

  /** Set render boolean value based on embed status.
   * Embedder tool needs specific value to be in url to create embedded view with selected content.
   * Utilize default values when not in embedder tool and if in it, then check if url contains required value.
   * @returns {boolean}
   */
  const setRender = () => {
    const paramValue = url.searchParams.get('charging_station') === '1';
    if (embeded) {
      return isDataValid(paramValue, chargerStations);
    }
    return isDataValid(showChargingStations, chargerStations);
  };

  const renderData = setRender();

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

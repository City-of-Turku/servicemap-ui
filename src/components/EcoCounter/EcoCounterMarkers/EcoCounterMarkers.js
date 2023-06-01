/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { isDataValid } from '../../MobilityPlatform/utils/utils';
import { fetchTrafficCounterStations } from '../EcoCounterRequests/ecoCounterRequests';
import CounterMarkers from '../CounterMarkers';
import EcoCounterContent from '../EcoCounterContent';

const EcoCounterMarkers = () => {
  const [ecoCounterStations, setEcoCounterStations] = useState([]);
  const [telraamCounterStations, setTelraamCounterStations] = useState([]);

  const { openMobilityPlatform, showTrafficCounter } = useMobilityPlatformContext();

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchTrafficCounterStations('EC', setEcoCounterStations);
    }
  }, [openMobilityPlatform, setEcoCounterStations]);

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchTrafficCounterStations('TR', setTelraamCounterStations);
    }
  }, [openMobilityPlatform, setTelraamCounterStations]);

  const map = useMap();

  /** These stations contains data about pedestrians as well
   * @param {string} name -name value is used to check if it matches or not
   * @returns {boolean} -true or false value
   */
  const stationNames = (name) => {
    switch (name) {
      case 'Teatterisilta':
        return true;
      case 'Auransilta':
        return true;
      case 'Kirjastosilta':
        return true;
      case 'Teatteri ranta':
        return true;
      default:
        return false;
    }
  };

  /**
   * Filter out stations that only show data about cycling
   * @param {array} data -EcoCounter stations
   * @returns {array} -Filtered data with only items that matched criteria
   */
  const filterStations = data => data.reduce((acc, curr) => {
    if (stationNames(curr.name)) {
      acc.push(curr);
    }
    return acc;
  }, []);

  const showTelraam = Object.values(showTrafficCounter).some(val => val === true);

  const stationsWithPedestrians = filterStations(ecoCounterStations);
  /** All stations contain data about cyclists */
  const renderAllStations = isDataValid(showTrafficCounter.cycling, ecoCounterStations);
  /** 4 stations contain data about pedestrians as well */
  const renderFilteredStations = isDataValid(showTrafficCounter.walking, stationsWithPedestrians);
  /** 2 Terlaam stations */
  const renderTelraamStations = isDataValid(showTelraam, telraamCounterStations);

  /**
   * Fit markers to map bounds
   * @param {boolean} isValid -true if data is valid, otherwise false
   * @param {array} data -EcoCounter stations
   */
  const fitToMapBounds = (isValid, data) => {
    if (isValid) {
      const bounds = [];
      data.forEach((item) => {
        bounds.push([item.lat, item.lon]);
      });
      map.fitBounds(bounds);
    }
  };

  useEffect(() => {
    fitToMapBounds(isDataValid(showTrafficCounter.walking, stationsWithPedestrians), stationsWithPedestrians);
  }, [showTrafficCounter.walking, ecoCounterStations]);

  useEffect(() => {
    fitToMapBounds(isDataValid(showTrafficCounter.cycling, ecoCounterStations), ecoCounterStations);
  }, [showTrafficCounter.cycling, ecoCounterStations]);

  /**
   * Render markers on the map
   * @param {boolean} isValid -true if data is valid, otherwise false
   * @param {array} data -EcoCounter stations
   * @returns {JSX element}
   */
  const renderStations = (isValid, data) => (isValid
    ? data.map(item => (
      <CounterMarkers key={item.id} counterStation={item}>
        {item.csv_data_source === 'EC' ? (
          <EcoCounterContent stationId={item.id} stationName={item.name} />
        ) : (
          <EcoCounterContent stationId={item.id} isTelraam />
        )}
      </CounterMarkers>
    ))
    : null);

  return (
    <>
      {renderStations(renderAllStations, ecoCounterStations)}
      {renderStations(renderFilteredStations, stationsWithPedestrians)}
      {renderStations(renderTelraamStations, telraamCounterStations)}
    </>
  );
};

export default EcoCounterMarkers;

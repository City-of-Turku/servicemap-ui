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

  const { showTrafficCounter } = useMobilityPlatformContext();

  useEffect(() => {
    if (showTrafficCounter) {
      fetchTrafficCounterStations('EC', setEcoCounterStations);
      fetchTrafficCounterStations('TR', setTelraamCounterStations);
    }
  }, [showTrafficCounter]);

  const map = useMap();

  /**
   * Filter out stations that only show data about cycling
   * @param {array} data -EcoCounter stations
   * @returns {array} -Filtered data with only items that matched criteria
   */
  const filterStations = data => data.reduce((acc, curr) => {
    if (curr.sensor_types.includes('jt')) {
      acc.push(curr);
    }
    return acc;
  }, []);


  const allCounterStations = [].concat(ecoCounterStations, telraamCounterStations);
  const stationsWithPedestrians = filterStations(allCounterStations);

  /** Check validity of all stations including Telraam and stations with data about cycling */
  const renderAllStations = isDataValid(showTrafficCounter.cycling, allCounterStations);
  /** Stations contain data about pedestrians as well */
  const renderFilteredStations = isDataValid(showTrafficCounter.walking, stationsWithPedestrians);

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
  }, [showTrafficCounter.walking, allCounterStations]);

  useEffect(() => {
    fitToMapBounds(isDataValid(showTrafficCounter.cycling, allCounterStations), allCounterStations);
  }, [showTrafficCounter.cycling, allCounterStations]);

  /**
   * Render markers on the map
   * @param {boolean} isValid -true if data is valid, otherwise false
   * @param {array} data -EcoCounter stations
   * @returns {JSX element}
   */
  const renderStations = (isValid, data) => (isValid
    ? data.map(item => (
      <CounterMarkers key={item.id} counterStation={item}>
        <EcoCounterContent station={item} />
      </CounterMarkers>
    ))
    : null);

  return (
    <>
      {renderStations(renderAllStations, allCounterStations)}
      {renderStations(renderFilteredStations, stationsWithPedestrians)}
    </>
  );
};

export default EcoCounterMarkers;

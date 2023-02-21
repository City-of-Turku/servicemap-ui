/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { isDataValid } from '../../MobilityPlatform/utils/utils';
import { fetchTrafficCounterStations } from '../EcoCounterRequests/ecoCounterRequests';
import CounterMarkers from '../CounterMarkers';
import EcoCounterContent from '../EcoCounterContent';

const EcoCounterMarkers = () => {
  const [ecoCounterStations, setEcoCounterStations] = useState([]);

  const { openMobilityPlatform, showEcoCounter } = useContext(MobilityPlatformContext);

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchTrafficCounterStations('EC', setEcoCounterStations);
    }
  }, [openMobilityPlatform, setEcoCounterStations]);

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

  const stationsWithPedestrians = filterStations(ecoCounterStations);
  /** All stations contain data about cyclists */
  const renderAllStations = isDataValid(showEcoCounter.cycling, ecoCounterStations);
  /** 4 stations contain data about pedestrians as well */
  const renderFilteredStations = isDataValid(showEcoCounter.walking, stationsWithPedestrians);

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
    fitToMapBounds(isDataValid(showEcoCounter.walking, stationsWithPedestrians), stationsWithPedestrians);
  }, [showEcoCounter.walking, ecoCounterStations]);

  useEffect(() => {
    fitToMapBounds(isDataValid(showEcoCounter.cycling, ecoCounterStations), ecoCounterStations);
  }, [showEcoCounter.cycling, ecoCounterStations]);

  /**
   * Render markers on the map
   * @param {boolean} isValid -true if data is valid, otherwise false
   * @param {array} data -EcoCounter stations
   * @returns {JSX element}
   */
  const renderStations = (isValid, data) => (isValid ? (
    data.map(item => (
      <CounterMarkers key={item.id} counterStation={item}>
        <EcoCounterContent
          stationId={item.id}
          stationName={item.name}
        />
      </CounterMarkers>
    ))
  ) : null
  );

  return (
    <>
      {renderStations(renderAllStations, ecoCounterStations)}
      {renderStations(renderFilteredStations, stationsWithPedestrians)}
    </>
  );
};

export default EcoCounterMarkers;

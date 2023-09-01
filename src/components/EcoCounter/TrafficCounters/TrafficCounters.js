/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { isDataValid } from '../../MobilityPlatform/utils/utils';
import { fetchTrafficCounterStationsByType } from '../EcoCounterRequests/ecoCounterRequests';
import CounterMarkers from '../CounterMarkers';
import EcoCounterContent from './EcoCounterContent';
import LamCounterContent from './LamCounterContent';

/** Show Traffic counters based on what user types' data they contain */

const TrafficCounters = () => {
  const [pedestrianCounterStations, setPedestrianCounterStations] = useState([]);
  const [bicycleCounterStations, setBicycleCounterStations] = useState([]);
  const [carCounterStations, setCarCounterStations] = useState([]);

  const { showTrafficCounter } = useMobilityPlatformContext();

  useEffect(() => {
    if (showTrafficCounter.walking) {
      fetchTrafficCounterStationsByType('j', setPedestrianCounterStations);
    }
  }, [showTrafficCounter.walking]);

  useEffect(() => {
    if (showTrafficCounter.cycling) {
      fetchTrafficCounterStationsByType('p', setBicycleCounterStations);
    }
  }, [showTrafficCounter.cycling]);

  useEffect(() => {
    if (showTrafficCounter.driving) {
      fetchTrafficCounterStationsByType('a', setCarCounterStations);
    }
  }, [showTrafficCounter.driving]);

  const map = useMap();

  const renderPedestrianCounters = isDataValid(showTrafficCounter.walking, pedestrianCounterStations);
  const renderBicycleCounters = isDataValid(showTrafficCounter.cycling, bicycleCounterStations);
  const renderCarCounters = isDataValid(showTrafficCounter.driving, carCounterStations);

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
    fitToMapBounds(renderPedestrianCounters, pedestrianCounterStations);
  }, [renderPedestrianCounters, pedestrianCounterStations]);

  useEffect(() => {
    fitToMapBounds(renderBicycleCounters, bicycleCounterStations);
  }, [renderBicycleCounters, bicycleCounterStations]);

  useEffect(() => {
    fitToMapBounds(renderCarCounters, carCounterStations);
  }, [renderCarCounters, carCounterStations]);

  const renderContent = (item) => {
    const csvSource = item.csv_data_source;
    if (csvSource === 'EC' || csvSource === 'TR') {
      return <EcoCounterContent station={item} />;
    }
    if (csvSource === 'LC' || csvSource === 'TC') {
      return <LamCounterContent station={item} />;
    }
    return null;
  };

  const renderStationsOnMap = (renderData, data) => (
    renderData ? (
      data.map((item) => (
        <CounterMarkers key={item.id} counterStation={item}>
          {renderContent(item)}
        </CounterMarkers>
      ))
    ) : null
  );

  return (
    <>
      {renderStationsOnMap(renderPedestrianCounters, pedestrianCounterStations)}
      {renderStationsOnMap(renderBicycleCounters, bicycleCounterStations)}
      {renderStationsOnMap(renderCarCounters, carCounterStations)}
    </>
  );
};

export default TrafficCounters;

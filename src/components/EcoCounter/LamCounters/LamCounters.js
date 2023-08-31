/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { isDataValid } from '../../MobilityPlatform/utils/utils';
import { fetchTrafficCounterStations } from '../EcoCounterRequests/ecoCounterRequests';
import CounterMarkers from '../CounterMarkers';
import LamCountersContent from './components/LamCountersContent';

/** Show LAM Counters operated by Digitraffic and other traffic counters which are operated by Turku */

const LamCounters = () => {
  const [lamCounterStations, setLamCounterStations] = useState([]);
  const [trafficCounterStations, setTrafficCounterStations] = useState([]);

  const { showLamCounter } = useMobilityPlatformContext();

  useEffect(() => {
    if (showLamCounter) {
      fetchTrafficCounterStations('LC', setLamCounterStations);
      fetchTrafficCounterStations('TC', setTrafficCounterStations);
    }
  }, [showLamCounter]);

  /** Filter out stations that have empty sensor_types array.
   * Those stations do not have data and sensor type(s) were never assigned.
   * It only occurs in some counters operated by Turku.
   * This will also prevent rendering bugs. */
  const filteredTrafficCounters = trafficCounterStations.reduce((acc, curr) => {
    if (curr.sensor_types.length) {
      acc.push(curr);
    }
    return acc;
  }, []);

  const allStationsData = [].concat(lamCounterStations, filteredTrafficCounters);

  const map = useMap();

  const renderData = isDataValid(showLamCounter, allStationsData);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      allStationsData.forEach((item) => {
        bounds.push([item.lat, item.lon]);
      });
      map.fitBounds(bounds);
    }
  }, [showLamCounter, allStationsData]);

  return (
    renderData ? (
      allStationsData.map((item) => (
        <CounterMarkers key={item.id} counterStation={item}>
          <LamCountersContent
            station={item}
          />
        </CounterMarkers>
      ))
    ) : null
  );
};

export default LamCounters;

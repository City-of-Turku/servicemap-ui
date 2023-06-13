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

  const { openMobilityPlatform, showLamCounter } = useMobilityPlatformContext();

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchTrafficCounterStations('LC', setLamCounterStations);
    }
  }, [openMobilityPlatform, setLamCounterStations]);

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchTrafficCounterStations('TC', setTrafficCounterStations);
    }
  }, [openMobilityPlatform, setTrafficCounterStations]);

  const allStationsData = [].concat(lamCounterStations, trafficCounterStations);

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
    <>
      {renderData ? (
        allStationsData.map(item => (
          <CounterMarkers key={item.id} counterStation={item}>
            <LamCountersContent
              station={item}
            />
          </CounterMarkers>
        ))
      ) : null}
    </>
  );
};

export default LamCounters;

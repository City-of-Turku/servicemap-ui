import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { isDataValid } from '../../MobilityPlatform/utils/utils';
import { fetchTrafficCounterStations } from '../EcoCounterRequests/ecoCounterRequests';
import CounterMarkers from '../CounterMarkers';
import TrafficCountersContent from './components/TrafficCountersContent';

const TrafficCounters = () => {
  const [trafficCounterStations, setTrafficCounterStations] = useState([]);

  const { openMobilityPlatform, showLamCounter } = useMobilityPlatformContext();

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchTrafficCounterStations('TC', setTrafficCounterStations);
    }
  }, [openMobilityPlatform, setTrafficCounterStations]);

  const map = useMap();

  const renderData = isDataValid(showLamCounter, trafficCounterStations);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      trafficCounterStations.forEach((item) => {
        bounds.push([item.lat, item.lon]);
      });
      map.fitBounds(bounds);
    }
  }, [showLamCounter, trafficCounterStations]);

  return (
    <>
      {renderData ? (
        trafficCounterStations.map(item => (
          <CounterMarkers key={item.id} counterStation={item}>
            <TrafficCountersContent
              stationId={item.id}
              stationName={item.name}
            />
          </CounterMarkers>
        ))
      ) : null}
    </>
  );
};

export default TrafficCounters;

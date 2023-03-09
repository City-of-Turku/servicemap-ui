/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { MobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { isDataValid } from '../../MobilityPlatform/utils/utils';
import { fetchTrafficCounterStations } from '../EcoCounterRequests/ecoCounterRequests';
import CounterMarkers from '../CounterMarkers';
import LamCountersContent from './components/LamCountersContent';

const LamCounters = () => {
  const [lamCounterStations, setLamCounterStations] = useState([]);

  const { openMobilityPlatform, showLamCounter } = useContext(MobilityPlatformContext);

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchTrafficCounterStations('LC', setLamCounterStations);
    }
  }, [openMobilityPlatform, setLamCounterStations]);

  const map = useMap();

  const renderData = isDataValid(showLamCounter, lamCounterStations);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      lamCounterStations.forEach((item) => {
        bounds.push([item.lat, item.lon]);
      });
      map.fitBounds(bounds);
    }
  }, [showLamCounter, lamCounterStations]);

  return (
    <>
      {renderData ? (
        lamCounterStations.map(item => (
          <CounterMarkers key={item.id} counterStation={item}>
            <LamCountersContent
              stationId={item.id}
              stationName={item.name}
            />
          </CounterMarkers>
        ))
      ) : null}
    </>
  );
};

export default LamCounters;

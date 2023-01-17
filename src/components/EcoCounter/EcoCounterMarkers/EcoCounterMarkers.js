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

  const renderData = isDataValid(showEcoCounter, ecoCounterStations);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      ecoCounterStations.forEach((item) => {
        bounds.push([item.lat, item.lon]);
      });
      map.fitBounds(bounds);
    }
  }, [showEcoCounter, ecoCounterStations]);

  return (
    <>
      {renderData ? (
        ecoCounterStations.map(item => (
          <CounterMarkers key={item.id} counterStation={item}>
            <EcoCounterContent
              stationId={item.id}
              stationName={item.name}
            />
          </CounterMarkers>
        ))
      ) : null}
    </>
  );
};

export default EcoCounterMarkers;

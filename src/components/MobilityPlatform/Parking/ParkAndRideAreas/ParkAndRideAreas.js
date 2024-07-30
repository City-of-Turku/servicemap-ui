/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import { fetchAreaGeometries, fetchParkingAreaStats } from '../../mobilityPlatformRequests/mobilityPlatformRequests';
import { isObjValid } from '../../utils/utils';
import config from '../../../../../config';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';

// TODO Add content component, adjust styles & possibly render markers because some polygons are small.

const ParkAndRideAreas = () => {
  const [parkAndRideAreas, setParkAndRideAreas] = useState({});
  const [parkAndRideStatistics, setParkAndRideStatistics] = useState([]);
  const [fetchError, setFetchError] = useState(false);

  const { showParkAndRideAreas } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  const { Polygon, Popup } = global.rL;

  const blueColor = {
    color: 'rgba(7, 44, 115, 255)',
    fillOpacity: 0.3,
  };
  const redColor = {
    color: 'rgba(240, 22, 22, 255)',
    fillOpacity: useContrast ? 0.6 : 0.3,
    dashArray: useContrast ? '2 8 8 8' : null,
  };
  const whiteColor = {
    color: 'rgba(255, 255, 255, 255)',
    fillOpacity: 0.6,
    dashArray: '10 2 10',
  };

  const pathOptions = useContrast ? whiteColor : blueColor;

  const parkingSpacesUrlBase = config.parkingSpacesURL;
  const isParkingSpacesUrl = !parkingSpacesUrlBase || parkingSpacesUrlBase === 'undefined' ? null : parkingSpacesUrlBase;

  const parkAndRideAreaUrl = `${isParkingSpacesUrl}/event_area/`;
  const parkAndRideStatisticsUrl = `${isParkingSpacesUrl}/event_area_statistics/`;

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (showParkAndRideAreas && parkAndRideAreaUrl && parkAndRideStatisticsUrl) {
      fetchAreaGeometries(parkAndRideAreaUrl, setParkAndRideAreas, setFetchError, signal);
      fetchParkingAreaStats(parkAndRideStatisticsUrl, setParkAndRideStatistics, setFetchError, signal);
    }
    return () => controller.abort();
  }, [showParkAndRideAreas]);

  const swapCoords = inputData => {
    if (inputData.length > 0) {
      return inputData.map(item => item.map(v => v.map(j => [j[1], j[0]])));
    }
    return inputData;
  };

  const map = useMap();

  const renderData = isObjValid(showParkAndRideAreas, parkAndRideAreas);

  useEffect(() => {
    if (!fetchError && renderData) {
      const bounds = [];
      parkAndRideAreas.forEach(item => {
        bounds.push(swapCoords(item.geometry.coordinates));
      });
      map.fitBounds(bounds);
    }
  }, [showParkAndRideAreas, parkAndRideAreas, fetchError]);

  const renderColor = (itemId, capacity) => {
    const stats = parkAndRideStatistics?.find(item => item.id === itemId);
    const almostFull = capacity * 0.85;
    const parkingCount = stats?.current_parking_count;
    if (parkingCount >= almostFull) {
      return redColor;
    }
    return pathOptions;
  };

  return (
    !fetchError && renderData
      ? parkAndRideAreas.map(item => (
        <Polygon
          key={item.id}
          pathOptions={renderColor(item.id, item.properties.capacity_estimate)}
          positions={swapCoords(item.geometry.coordinates)}
          eventHandlers={{
            mouseover: e => {
              e.target.setStyle({ fillOpacity: useContrast ? '0.9' : '0.3' });
            },
            mouseout: e => {
              e.target.setStyle({ fillOpacity: useContrast ? '0.6' : '0.3' });
            },
          }}
        >
          <Popup>
            <p>{item?.properties?.capacity_estimate}</p>
          </Popup>
        </Polygon>
      ))
      : null
  );
};

export default ParkAndRideAreas;

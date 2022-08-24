import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import MobilityPlatformContext from '../../../../../context/MobilityPlatformContext';
import { fetchMobilityMapPolygonData } from '../../../mobilityPlatformRequests/mobilityPlatformRequests';

/**
 * Displays no parking zones of scooters on the map in polygon format.
 */

const NoParking = () => {
  const [noParkingData, setNoParkingData] = useState([]);

  const { openMobilityPlatform, showScooterNoParking } = useContext(MobilityPlatformContext);

  const mapType = useSelector(state => state.settings.mapType);

  const { Polygon } = global.rL;

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapPolygonData('SNP', 100, setNoParkingData);
    }
  }, [openMobilityPlatform, setNoParkingData]);

  const redOptions = { color: 'rgba(251, 5, 21, 255)', weight: 5 };

  const greenOptions = { color: 'rgba(145, 232, 58, 255)', fillOpacity: 0.3, weight: 5 };
  const pathOptions = mapType === 'accessible_map' ? greenOptions : redOptions;

  const map = useMap();

  useEffect(() => {
    if (showScooterNoParking && noParkingData && noParkingData.length > 0) {
      const bounds = [];
      noParkingData.forEach((item) => {
        bounds.push(item.geometry_coords);
      });
      map.fitBounds(bounds);
    }
  }, [showScooterNoParking, noParkingData, map]);

  return (
    <>
      {showScooterNoParking
        && noParkingData
        && noParkingData.length > 0
        && noParkingData.map(item => <Polygon key={item.id} pathOptions={pathOptions} positions={item.geometry_coords} />)}
    </>
  );
};

export default NoParking;

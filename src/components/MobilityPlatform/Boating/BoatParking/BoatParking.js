import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import MobilityPlatformContext from '../../../../context/MobilityPlatformContext';
import { fetchMobilityMapPolygonData } from '../../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid } from '../../utils/utils';

/**
 * Displays boat parking areas on the map in polygon format.
 */

const BoatParking = () => {
  const [boatParkingData, setBoatParkingData] = useState([]);

  const { openMobilityPlatform, mobilityMap } = useContext(MobilityPlatformContext);

  const mapType = useSelector(state => state.settings.mapType);

  const { Polygon } = global.rL;

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapPolygonData('BOK', 50, setBoatParkingData);
    }
  }, [openMobilityPlatform, setBoatParkingData]);

  const blueOptions = { color: 'rgba(7, 44, 115, 255)', weight: 5 };

  const greenOptions = { color: 'rgba(145, 232, 58, 255)', fillOpacity: 0.3, weight: 5 };
  const pathOptions = mapType === 'accessible_map' ? greenOptions : blueOptions;

  const map = useMap();

  const renderData = isDataValid(mobilityMap.boatParking, boatParkingData);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      boatParkingData.forEach((item) => {
        bounds.push(item.geometry_coords);
      });
      map.fitBounds(bounds);
    }
  }, [mobilityMap.boatParking, boatParkingData, map]);

  return (
    <>
      {renderData
        && boatParkingData.map(item => (
          <Polygon key={item.id} pathOptions={pathOptions} positions={item.geometry_coords} />
        ))}
    </>
  );
};

export default BoatParking;

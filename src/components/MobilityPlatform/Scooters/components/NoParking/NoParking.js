import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import MobilityPlatformContext from '../../../../../context/MobilityPlatformContext';
import { fetchMobilityMapData } from '../../../mobilityPlatformRequests/mobilityPlatformRequests';
import TextContent from '../../../TextContent';

/**
 * Displays no parking zones of scooters on the map in polygon format.
 */

const NoParking = () => {
  const [noParkingData, setNoParkingData] = useState([]);

  const { openMobilityPlatform, mobilityMap } = useContext(MobilityPlatformContext);

  const mapType = useSelector(state => state.settings.mapType);

  const { Polygon, Popup } = global.rL;

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('SNP', 100, setNoParkingData);
    }
  }, [openMobilityPlatform, setNoParkingData]);

  const redOptions = { color: 'rgba(251, 5, 21, 255)', weight: 5 };

  const greenOptions = { color: 'rgba(145, 232, 58, 255)', fillOpacity: 0.3, weight: 5 };
  const pathOptions = mapType === 'accessible_map' ? greenOptions : redOptions;

  const swapCoords = (inputData) => {
    if (inputData.length > 0) {
      return inputData.map(item => item.map(v => [v[1], v[0]]));
    }
    return inputData;
  };

  const map = useMap();

  useEffect(() => {
    if (mobilityMap.scooterNoParking && noParkingData && noParkingData.length > 0) {
      const bounds = [];
      noParkingData.forEach((item) => {
        bounds.push(swapCoords(item.geometry_coords));
      });
      map.fitBounds(bounds);
    }
  }, [mobilityMap.scooterNoParking, noParkingData, map]);

  return (
    <>
      {mobilityMap.scooterNoParking
        && noParkingData
        && noParkingData.length > 0
        && noParkingData.map(item => (
          <Polygon key={item.id} pathOptions={pathOptions} positions={swapCoords(item.geometry_coords)}>
            <Popup>
              <TextContent
                titleId="mobilityPlatform.content.scooters.noParkingAreas.title"
                translationId="mobilityPlatform.info.scooters.noParking"
              />
            </Popup>
          </Polygon>
        ))}
    </>
  );
};

export default NoParking;

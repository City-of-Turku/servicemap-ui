import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import MobilityPlatformContext from '../../../../../context/MobilityPlatformContext';
import { fetchMobilityMapData } from '../../../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid } from '../../../utils/utils';
import { useAccessibleMap } from '../../../../../redux/selectors/settings';
import TextContent from '../../../TextContent';

/**
 * Displays no parking zones of scooters on the map in polygon format.
 */

const NoParking = () => {
  const [noParkingData, setNoParkingData] = useState([]);

  const { openMobilityPlatform, showScooterNoParking } = useContext(MobilityPlatformContext);

  const { Polygon, Popup } = global.rL;

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('ScooterNoParkingArea', 100, setNoParkingData);
    }
  }, [openMobilityPlatform, setNoParkingData]);

  const useContrast = useSelector(useAccessibleMap);

  const redOptions = { color: 'rgba(251, 5, 21, 255)', weight: 5 };
  const whiteOptions = {
    color: 'rgba(255, 255, 255, 255)',
    fillOpacity: 0.3,
    weight: 5,
    dashArray: '11 2 11',
  };
  const pathOptions = useContrast ? whiteOptions : redOptions;

  const swapCoords = (inputData) => {
    if (inputData.length > 0) {
      return inputData.map(item => item.map(v => [v[1], v[0]]));
    }
    return inputData;
  };

  const renderData = isDataValid(showScooterNoParking, noParkingData);

  const map = useMap();

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      noParkingData.forEach((item) => {
        bounds.push(swapCoords(item.geometry_coords));
      });
      map.fitBounds(bounds);
    }
  }, [showScooterNoParking, noParkingData, map]);

  return (
    <>
      {renderData
        ? noParkingData.map(item => (
          <Polygon
            key={item.id}
            pathOptions={pathOptions}
            positions={swapCoords(item.geometry_coords)}
            eventHandlers={{
              mouseover: (e) => {
                e.target.setStyle({ fillOpacity: useContrast ? '0.6' : '0.2' });
              },
              mouseout: (e) => {
                e.target.setStyle({ fillOpacity: useContrast ? '0.3' : '0.2' });
              },
            }}
          >
            <Popup>
              <TextContent
                titleId="mobilityPlatform.content.scooters.noParkingAreas.title"
                translationId="mobilityPlatform.info.scooters.noParking"
              />
            </Popup>
          </Polygon>
        ))
        : null}
    </>
  );
};

export default NoParking;

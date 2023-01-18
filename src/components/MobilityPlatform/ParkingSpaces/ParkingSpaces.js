import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import { fetchParkingAreaGeometries, fetchParkingAreaStats } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isObjValid } from '../utils/utils';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import ParkingSpacesContent from './components/ParkingSpacesContent';

const ParkingSpaces = () => {
  const [parkingSpaces, setParkingSpaces] = useState({});
  const [parkingStatistics, setParkingStatistics] = useState([]);
  const [fetchError, setFetchError] = useState(false);

  const { openMobilityPlatform, showParkingSpaces } = useContext(MobilityPlatformContext);

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

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchParkingAreaGeometries(setParkingSpaces, setFetchError);
      fetchParkingAreaStats(setParkingStatistics, setFetchError);
    }
  }, [openMobilityPlatform, setParkingSpaces, setParkingStatistics]);

  const swapCoords = (inputData) => {
    if (inputData.length > 0) {
      return inputData.map(item => item.map(v => v.map(j => [j[1], j[0]])));
    }
    return inputData;
  };

  const map = useMap();

  const renderData = isObjValid(showParkingSpaces, parkingSpaces);

  useEffect(() => {
    if (!fetchError && renderData) {
      const bounds = [];
      parkingSpaces.forEach((item) => {
        bounds.push(swapCoords(item.geometry.coordinates));
      });
      map.fitBounds(bounds);
    }
  }, [showParkingSpaces, parkingSpaces, fetchError]);

  const renderColor = (itemId, capacity) => {
    const stats = parkingStatistics.find(item => item.id === itemId);
    const almostFull = capacity * 0.85;
    const parkingCount = stats.current_parking_count;
    if (parkingCount >= almostFull) {
      return redColor;
    }
    return pathOptions;
  };

  return (
    <>
      {!fetchError && renderData
        ? parkingSpaces.map(item => (
          <Polygon
            key={item.id}
            pathOptions={renderColor(item.id, item.properties.capacity_estimate)}
            positions={swapCoords(item.geometry.coordinates)}
            eventHandlers={{
              mouseover: (e) => {
                e.target.setStyle({ fillOpacity: useContrast ? '0.9' : '0.3' });
              },
              mouseout: (e) => {
                e.target.setStyle({ fillOpacity: useContrast ? '0.6' : '0.3' });
              },
            }}
          >
            <Popup>
              <ParkingSpacesContent parkingSpace={item} parkingStatistics={parkingStatistics} />
            </Popup>
          </Polygon>
        ))
        : null}
    </>
  );
};

export default ParkingSpaces;

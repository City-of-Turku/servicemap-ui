import React, { useEffect, useState, useContext } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import { fetchIotData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isObjValid } from '../utils/utils';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import ParkingSpacesContent from './components/ParkingSpacesContent';

const ParkingSpaces = () => {
  const [parkingSpaces, setParkingSpaces] = useState({});
  const [parkingStatistics, setParkingStatistics] = useState([]);

  const { openMobilityPlatform, showParkingSpaces } = useContext(MobilityPlatformContext);

  const mapType = useSelector(state => state.settings.mapType);

  const { Polygon, Popup } = global.rL;

  const blueColor = {
    fillColor: 'rgba(7, 44, 115, 255)', color: 'rgba(7, 44, 115, 255)', fillOpacity: 0.4, weigth: 5,
  };
  const redColor = {
    fillColor: 'rgba(240, 22, 22, 255)', color: 'rgba(240, 22, 22, 255)', fillOpacity: 0.4, weigth: 5,
  };
  const greenColor = {
    fillColor: 'rgba(4, 212, 91, 255)', color: 'rgba(4, 212, 91, 255)', fillOpacity: 0.6, weigth: 5,
  };

  const pathOptions = mapType === 'accessible_map' ? greenColor : blueColor;

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchIotData('TPH', setParkingSpaces);
      fetchIotData('PAS', setParkingStatistics);
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
    if (renderData) {
      const bounds = [];
      parkingSpaces.features.forEach((item) => {
        bounds.push(swapCoords(item.geometry.coordinates));
      });
      map.fitBounds(bounds);
    }
  }, [showParkingSpaces, parkingSpaces]);

  const renderColor = (itemId, capacity) => {
    const stats = parkingStatistics.results.find(item => item.id === itemId);
    const almostFull = capacity * 0.85;
    const parkingCount = stats.current_parking_count;
    if (parkingCount >= almostFull) {
      return redColor;
    } return pathOptions;
  };

  return (
    <>
      {renderData ? (
        parkingSpaces.features.map(item => (
          <Polygon
            key={item.id}
            pathOptions={renderColor(item.id, item.properties.capacity_estimate)}
            positions={swapCoords(item.geometry.coordinates)}
          >
            <Popup>
              <ParkingSpacesContent parkingSpace={item} parkingStatistics={parkingStatistics.results} />
            </Popup>
          </Polygon>
        ))
      ) : null}
    </>
  );
};

export default ParkingSpaces;

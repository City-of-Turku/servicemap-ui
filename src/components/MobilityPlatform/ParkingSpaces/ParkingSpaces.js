/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import { isObjValid } from '../utils/utils';
import config from '../../../../config';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import useParkingDataFetch from '../utils/useParkingDataFetch';
import { StyledPopupWrapper, StyledPopupInner } from '../styled/styled';
import ParkingSpacesContent from './components/ParkingSpacesContent';

const ParkingSpaces = () => {
  const { showParkingSpaces } = useMobilityPlatformContext();

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

  const parkingAreaUrl = `${isParkingSpacesUrl}/parking_area/`;
  const parkingStatisticsUrl = `${isParkingSpacesUrl}/parking_area_statistics/`;

  const { areasData, statisticsData, fetchError } = useParkingDataFetch(
    parkingAreaUrl,
    parkingStatisticsUrl,
    showParkingSpaces,
  );

  const swapCoords = inputData => {
    if (inputData.length > 0) {
      return inputData.map(item => item.map(v => v.map(j => [j[1], j[0]])));
    }
    return inputData;
  };

  const map = useMap();

  const renderData = isObjValid(showParkingSpaces, areasData);

  useEffect(() => {
    if (!fetchError && renderData) {
      const bounds = [];
      areasData.forEach(item => {
        bounds.push(swapCoords(item.geometry.coordinates));
      });
      map.fitBounds(bounds);
    }
  }, [showParkingSpaces, areasData, fetchError]);

  const renderColor = (itemId, capacity) => {
    const stats = statisticsData?.find(item => item.id === itemId);
    const almostFull = capacity * 0.85;
    const parkingCount = stats?.current_parking_count;
    if (parkingCount >= almostFull) {
      return redColor;
    }
    return pathOptions;
  };

  return (
    !fetchError && renderData
      ? areasData.map(item => (
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
          <StyledPopupWrapper>
            <Popup>
              <StyledPopupInner>
                <ParkingSpacesContent parkingSpace={item} parkingStatistics={statisticsData} />
              </StyledPopupInner>
            </Popup>
          </StyledPopupWrapper>
        </Polygon>
      ))
      : null
  );
};

export default ParkingSpaces;

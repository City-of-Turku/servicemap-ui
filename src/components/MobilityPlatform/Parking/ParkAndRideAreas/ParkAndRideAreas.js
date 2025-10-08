/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import parkAndRideIcon from 'servicemap-ui-turku/assets/icons/icons-icon_park_and_ride_bicycle.svg';
import parkAndRideIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_park_and_ride_bicycle-bw.svg';
import { isObjValid, createIcon, isDataValid } from '../../utils/utils';
import config from '../../../../../config';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import useParkingDataFetch from '../../utils/useParkingDataFetch';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { StyledPopupWrapper, StyledPopupInner } from '../../styled/styled';
import ParkAndRideAreasContent from './components/ParkAndRideAreasContent';
import useMobilityDataFetch from '../../utils/useMobilityDataFetch';
import MarkerComponent from '../../MarkerComponent';
import ParkAndRideCarsContent from './components/ParkAndRideCarsContent';

const ParkAndRideAreas = () => {
  const { showParkAndRideAreas } = useMobilityPlatformContext();
  const useContrast = useSelector(useAccessibleMap);

  const { Marker, Polygon, Popup } = global.rL;
  const { icon, polygon } = global.L;

  const customIcon = icon(createIcon(useContrast ? parkAndRideIconBw : parkAndRideIcon));

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

  const { areasData, statisticsData, fetchError } = useParkingDataFetch(
    parkAndRideAreaUrl,
    parkAndRideStatisticsUrl,
    showParkAndRideAreas,
  );

  const options = {
    type_name: 'FoliParkAndRideCarsStop',
    page_size: 100,
  };

  const liipiData = useMobilityDataFetch(options, showParkAndRideAreas).data;
  const renderLiipiData = isDataValid(showParkAndRideAreas, liipiData);

  /**
   * Swap coordinates to be in correct order for Leaflet
   * @param {array} inputData
   * @returns array of coordinates
   */
  const swapCoords = inputData => {
    if (inputData.length > 0) {
      return inputData.map(item => item.map(v => v.map(j => [j[1], j[0]])));
    }
    return inputData;
  };

  /**
   * Get center point of polygon geometry
   * @param {array} coordinates
   * @returns object
   */
  const getCenter = coordinates => {
    const leafletPolygon = polygon(coordinates);
    return leafletPolygon.getBounds().getCenter();
  };

  /**
   * Swap coordinates and then get center value of the polygon.
   * @param {array} coordinatesData
   * @returns array of lat and lng values
   */
  const swapAndGetCoordinates = coordinatesData => {
    const swapped = swapCoords(coordinatesData);
    const center = getCenter(swapped);
    return [center.lat, center.lng];
  };

  const map = useMap();
  const renderData = isObjValid(showParkAndRideAreas, areasData);

  useEffect(() => {
    if (!fetchError && renderData) {
      const bounds = [];
      areasData.forEach(item => {
        bounds.push(swapCoords(item.geometry.coordinates));
      });
      map.fitBounds(bounds);
    }
  }, [showParkAndRideAreas, areasData, fetchError]);

  const renderColor = (itemId, capacity) => {
    const stats = statisticsData?.find(item => item.id === itemId);
    const almostFull = capacity * 0.85;
    const parkingCount = stats?.current_parking_count;
    if (parkingCount >= almostFull) {
      return redColor;
    }
    return pathOptions;
  };

  const showAreasData = !fetchError && renderData;

  const renderMarkersData = (showData, data) => (showData
    ? data.map(item => (
      <Marker
        key={item.id}
        icon={customIcon}
        position={swapAndGetCoordinates(item.geometry.coordinates)}
      >
        <StyledPopupWrapper>
          <Popup>
            <StyledPopupInner>
              <ParkAndRideAreasContent parkAndRideArea={item} parkingStatistics={statisticsData} />
            </StyledPopupInner>
          </Popup>
        </StyledPopupWrapper>
      </Marker>
    ))
    : null);

  const renderPolygonData = (showData, data) => (
    showData
      ? data.map(item => (
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
                <ParkAndRideAreasContent parkAndRideArea={item} parkingStatistics={statisticsData} />
              </StyledPopupInner>
            </Popup>
          </StyledPopupWrapper>
        </Polygon>
      ))
      : null);

  const renderLiipiMarkersData = (showData, data) => (
    renderLiipiData
      ? data.map(item => (
        <MarkerComponent key={item.id} item={item} icon={customIcon}>
          <ParkAndRideCarsContent item={item} />
        </MarkerComponent>
      )) : null);

  return (
    <>
      {renderMarkersData(showAreasData, areasData)}
      {renderLiipiMarkersData(showAreasData, liipiData)}
      {renderPolygonData(showAreasData, areasData)}
    </>
  );
};

export default ParkAndRideAreas;

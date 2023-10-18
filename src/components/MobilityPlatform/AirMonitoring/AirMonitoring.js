/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import ecoCounterIcon from 'servicemap-ui-turku/assets/icons/icons-icon_ecocounter.svg';
import ecoCounterIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_ecocounter-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchAirMonitoringStations } from '../AirMonitoringAPI/AirMonitoringAPI';
import { isDataValid, createIcon } from '../utils/utils';
import AirMonitoringContent from './components/AirMonitoringContent';

const AirMonitoring = () => {
  const [airMonitoringStations, setAirMonitoringStations] = useState([]);

  const { showAirMonitoringStations } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  const map = useMap();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  // TODO use correct icon
  const customIcon = icon(createIcon(useContrast ? ecoCounterIconBw : ecoCounterIcon));

  useEffect(() => {
    if (showAirMonitoringStations) {
      fetchAirMonitoringStations('AQ', setAirMonitoringStations);
    }
  }, [showAirMonitoringStations]);

  const renderData = isDataValid(showAirMonitoringStations, airMonitoringStations);

  /**
   * Gets coordinate values from string, for example 'SRID=4326;POINT (22.37835 60.40831)'.
   * Use regex to get numerical values and place those inside an array
   * @param {string} inputString
   * @returns {*array} coordinates
   */
  const getCoordinates = (inputString) => {
    const regex = /POINT \((\d+\.\d+) (\d+\.\d+)\)/;
    const match = inputString.match(regex);
    if (match) {
      const coordinates = [parseFloat(match[2]), parseFloat(match[1])];
      return coordinates;
    }
    return [];
  };

  const fitBounds = (isValid, data) => {
    if (isValid) {
      const bounds = [];
      data.forEach((item) => {
        bounds.push([getCoordinates(item.location)]);
      });
      map.fitBounds(bounds);
    }
  };

  useEffect(() => {
    fitBounds(renderData, airMonitoringStations);
  }, [renderData]);

  return renderData
    ? airMonitoringStations.map((item) => (
      <Marker key={item.id} icon={customIcon} position={getCoordinates(item.location)}>
        <Popup className="ecocounter-popup">
          <AirMonitoringContent station={item} />
        </Popup>
      </Marker>
    ))
    : null;
};

export default AirMonitoring;

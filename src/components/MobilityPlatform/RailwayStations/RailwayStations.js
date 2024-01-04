/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import railwayIcon from 'servicemap-ui-turku/assets/icons/icons-icon_railway_station.svg';
import railwayIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_railway_station-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchRailwaysData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid } from '../utils/utils';
import RailwayStationsContent from './components/RailwayStationsContent';

const RailwayStations = () => {
  const [railwayStations, setRailwayStations] = useState([]);

  const { showRailwayStations } = useMobilityPlatformContext();

  const map = useMap();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const customIcon = icon(createIcon(useContrast ? railwayIconBw : railwayIcon));

  useEffect(() => {
    if (showRailwayStations) {
      fetchRailwaysData('metadata/stations', setRailwayStations);
    }
  }, [showRailwayStations]);

  /** Separate railway stations of Turku, eg. main station and Kupittaa */
  const turkuStationCodes = ['TKU', 'KUT'];
  const railwayStationsTku = railwayStations.filter(curr => turkuStationCodes.includes(curr.stationShortCode));

  const renderData = isDataValid(showRailwayStations, railwayStationsTku);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      railwayStationsTku.forEach(item => {
        bounds.push([item.latitude, item.longitude]);
      });
      map.fitBounds(bounds);
    }
  }, [showRailwayStations, railwayStationsTku]);

  return renderData
    ? railwayStationsTku.map(item => (
      <Marker key={item.stationName} icon={customIcon} position={[item.latitude, item.longitude]}>
        <Popup>
          <RailwayStationsContent item={item} />
        </Popup>
      </Marker>
    ))
    : null;
};

export default RailwayStations;

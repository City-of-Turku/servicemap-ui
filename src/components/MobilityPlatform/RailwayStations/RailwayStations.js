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
import { StyledPopupWrapper, StyledPopupInner } from '../styled/styled';

const RailwayStations = () => {
  const [railwayStations, setRailwayStations] = useState([]);

  const { showRailwayStations } = useMobilityPlatformContext();

  const map = useMap();

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const customIcon = icon(createIcon(useContrast ? railwayIconBw : railwayIcon));

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    if (showRailwayStations && !railwayStations.length) {
      fetchRailwaysData('metadata/stations', setRailwayStations, signal);
    }
    return () => controller.abort();
  }, [showRailwayStations]);

  /** Separate railway stations of Turku, eg. Turku station and Kupittaa */
  /* TKUAOK-22: filterArrivals and filterDeparting on RailwayStationsContent has faulty logic as in that
   * only routes that are the first in departing or last in arriving are shown, which means that KUT will
   * be empty always since all the routes go at least to and from TKU. Will hide KUT until this is fixed.
   */
  // const turkuStationCodes = ['TKU', 'KUT', 'TUS'];
  const turkuStationCodes = ['TKU', 'TUS'];
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
        <StyledPopupWrapper>
          <Popup className="popup-w350">
            <StyledPopupInner>
              <RailwayStationsContent item={item} stationsData={railwayStations} />
            </StyledPopupInner>
          </Popup>
        </StyledPopupWrapper>
      </Marker>
    ))
    : null;
};

export default RailwayStations;

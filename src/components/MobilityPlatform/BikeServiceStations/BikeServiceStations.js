/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import bikeServiceIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_bike_service_station-bw.svg';
import bikeServiceIcon from 'servicemap-ui-turku/assets/icons/icons-icon_bike_service_station.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid, fitToMapBounds } from '../utils/utils';
import MarkerComponent from '../MarkerComponent';
import BikeServiceStationContent from './components/BikeServiceStationContent';

const BikeServiceStations = () => {
  const [bikeServiceStations, setBikeServiceStations] = useState([]);

  const { openMobilityPlatform, showBikeServiceStations } = useMobilityPlatformContext();

  const map = useMap();

  const useContrast = useSelector(useAccessibleMap);

  const { icon } = global.L;

  const customIcon = icon(createIcon(useContrast ? bikeServiceIconBw : bikeServiceIcon));

  useEffect(() => {
    const options = {
      type_name: 'BikeServiceStation',
    };
    if (openMobilityPlatform) {
      fetchMobilityMapData(options, setBikeServiceStations);
    }
  }, [openMobilityPlatform, setBikeServiceStations]);

  const renderData = isDataValid(showBikeServiceStations, bikeServiceStations);

  useEffect(() => {
    fitToMapBounds(renderData, bikeServiceStations, map);
  }, [showBikeServiceStations, bikeServiceStations]);

  return (
    <>
      {renderData
        ? bikeServiceStations.map(item => (
          <MarkerComponent key={item.id} item={item} icon={customIcon}>
            <BikeServiceStationContent station={item} />
          </MarkerComponent>
        ))
        : null}
    </>
  );
};

export default BikeServiceStations;

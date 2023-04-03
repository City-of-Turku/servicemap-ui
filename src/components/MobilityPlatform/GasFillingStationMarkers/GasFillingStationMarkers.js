/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import gasFillingIcon from 'servicemap-ui-turku/assets/icons/icons-icon_gas_station.svg';
import gasFillingIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_gas_station-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid, fitToMapBounds } from '../utils/utils';
import MarkerComponent from '../MarkerComponent';
import GasFillingStationContent from './components/GasFillingStationContent';

const GasFillingStationMarkers = () => {
  const [gasFillingStations, setGasFillingStations] = useState([]);

  const { openMobilityPlatform, showGasFillingStations } = useMobilityPlatformContext();

  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const gasStationIcon = icon(createIcon(useContrast ? gasFillingIconBw : gasFillingIcon));

  useEffect(() => {
    const options = {
      type_name: 'GasFillingStation',
    };
    if (openMobilityPlatform) {
      fetchMobilityMapData(options, setGasFillingStations);
    }
  }, [openMobilityPlatform, setGasFillingStations]);

  const renderData = isDataValid(showGasFillingStations, gasFillingStations);

  const map = useMap();

  useEffect(() => {
    fitToMapBounds(renderData, gasFillingStations, map);
  }, [showGasFillingStations, gasFillingStations]);

  return (
    <>
      {renderData
        ? gasFillingStations.map(item => (
          <MarkerComponent key={item.id} item={item} icon={gasStationIcon}>
            <GasFillingStationContent station={item} />
          </MarkerComponent>
        ))
        : null}
    </>
  );
};

export default GasFillingStationMarkers;

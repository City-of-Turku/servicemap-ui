/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import gasFillingIcon from 'servicemap-ui-turku/assets/icons/icons-icon_gas_station.svg';
import gasFillingIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_gas_station-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { selectMapRef } from '../../../redux/selectors/general';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { createIcon, isDataValid, fitToMapBounds } from '../utils/utils';
import useMobilityDataFetch from '../utils/useMobilityDataFetch';
import MarkerComponent from '../MarkerComponent';
import GasFillingStationContent from './components/GasFillingStationContent';

const GasFillingStationMarkers = () => {
  const options = {
    type_name: 'GasFillingStation',
  };

  const { showGasFillingStations } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);
  const map = useSelector(selectMapRef);

  const { icon } = global.L;
  const gasStationIcon = icon(createIcon(useContrast ? gasFillingIconBw : gasFillingIcon));

  const { data } = useMobilityDataFetch(options, showGasFillingStations);
  const renderData = isDataValid(showGasFillingStations, data);

  useEffect(() => {
    fitToMapBounds(renderData, data, map);
  }, [showGasFillingStations, data]);

  return (
    renderData
      ? data.map(item => (
        <MarkerComponent key={item.id} item={item} icon={gasStationIcon}>
          <GasFillingStationContent station={item} />
        </MarkerComponent>
      ))
      : null
  );
};

export default GasFillingStationMarkers;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import sportIconContrast from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_outdoor_gym-bw.svg';
import sportIcon from 'servicemap-ui-turku/assets/icons/icons-icon_outdoor_gym.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import {
  isDataValid, fitToMapBounds, createIcon, setRender, checkMapType,
} from '../utils/utils';
import { isEmbed } from '../../../utils/path';
import MarkerComponent from '../MarkerComponent';
import OutdoorGymDevicesContent from './components/OutdoorGymDevicesContent';

const OutdoorGymDevices = () => {
  const [outdoorGymDevices, setOutdoorGymDevices] = useState([]);

  const { openMobilityPlatform, showOutdoorGymDevices } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  const map = useMap();

  const { icon } = global.L;

  const url = new URL(window.location);
  const embeded = isEmbed({ url: url.toString() });

  const customIcon = icon(createIcon(checkMapType(embeded, useContrast, url) ? sportIconContrast : sportIcon));

  useEffect(() => {
    const options = {
      type_name: 'OutdoorGymDevice',
    };
    if (openMobilityPlatform || embeded) {
      fetchMobilityMapData(options, setOutdoorGymDevices);
    }
  }, [openMobilityPlatform, setOutdoorGymDevices]);

  const paramValue = url.searchParams.get('outdoor_gym') === '1';
  const renderData = setRender(paramValue, embeded, showOutdoorGymDevices, outdoorGymDevices, isDataValid);

  useEffect(() => {
    if (!embeded) {
      fitToMapBounds(renderData, outdoorGymDevices, map);
    }
  }, [showOutdoorGymDevices, outdoorGymDevices]);

  return (
    <>
      {renderData ? (
        outdoorGymDevices.map(item => (
          <MarkerComponent
            key={item.id}
            item={item}
            icon={customIcon}
          >
            <OutdoorGymDevicesContent item={item} />
          </MarkerComponent>
        ))
      ) : null}
    </>
  );
};

export default OutdoorGymDevices;

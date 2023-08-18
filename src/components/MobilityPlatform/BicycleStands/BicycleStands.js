/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { useSelector } from 'react-redux';
import bicycleStandIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_bicycle_stand-bw.svg';
import circleIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_circle_border-bw.svg';
import bicycleStandIcon from 'servicemap-ui-turku/assets/icons/icons-icon_bicycle-stand.svg';
import circleIcon from 'servicemap-ui-turku/assets/icons/icons-icon_circle_border.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import {
  isDataValid, fitToMapBounds, setRender, checkMapType,
} from '../utils/utils';
import { isEmbed } from '../../../utils/path';
import MarkerComponent from '../MarkerComponent';
import BicycleStandContent from './components/BicycleStandContent';

const BicycleStands = () => {
  const [bicycleStands, setBicycleStands] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(13);

  const { showBicycleStands, showHullLockableStands } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  const map = useMap();

  const url = new URL(window.location);
  const embedded = isEmbed({ url: url.toString() });

  const { icon } = global.L;

  const setBaseIcon = checkMapType(embedded, useContrast, url) ? bicycleStandIconBw : bicycleStandIcon;
  const setCircleIcon = checkMapType(embedded, useContrast, url) ? circleIconBw : circleIcon;

  const customIcon = icon({
    iconUrl: zoomLevel < 14 ? setCircleIcon : setBaseIcon,
    iconSize: zoomLevel < 14 ? [20, 20] : [45, 45],
  });

  useEffect(() => {
    const options = {
      type_name: 'BicycleStand',
      page_size: 500,
    };
    if (showBicycleStands || showHullLockableStands || embedded) {
      fetchMobilityMapData(options, setBicycleStands);
    }
  }, [showBicycleStands, showHullLockableStands, embedded]);

  const mapEvent = useMapEvents({
    zoomend() {
      setZoomLevel(mapEvent.getZoom());
    },
  });

  const otherBicycleStands = [];

  /** Separate bicycle stands that are frame/hull lockable from those that are not */
  const hullLockableBicycleStands = bicycleStands.reduce((acc, curr) => {
    if (curr.extra.hull_lockable) {
      acc.push(curr);
    } else {
      otherBicycleStands.push(curr);
    }
    return acc;
  }, []);

  const paramValue1 = url.searchParams.get('bicycle_stands') === '1';
  const paramValue2 = url.searchParams.get('frame_lockable') === '1';

  const validBicycleStands = setRender(paramValue1, embedded, showBicycleStands, otherBicycleStands, isDataValid);
  const validHulllockableStands = setRender(paramValue2, embedded, showHullLockableStands, hullLockableBicycleStands, isDataValid);

  useEffect(() => {
    if (!embedded) {
      fitToMapBounds(validBicycleStands, otherBicycleStands, map);
    }
  }, [showBicycleStands]);

  useEffect(() => {
    if (!embedded) {
      fitToMapBounds(validHulllockableStands, hullLockableBicycleStands, map);
    }
  }, [showHullLockableStands]);

  const renderBicycleStands = (isValid, data) => (isValid ? (
    data.map(item => (
      <MarkerComponent
        key={item.id}
        item={item}
        icon={customIcon}
      >
        <BicycleStandContent bicycleStand={item} />
      </MarkerComponent>
    ))
  ) : null);

  return (
    <>
      {renderBicycleStands(validBicycleStands, otherBicycleStands)}
      {renderBicycleStands(validHulllockableStands, hullLockableBicycleStands)}
    </>
  );
};

export default BicycleStands;

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { useSelector } from 'react-redux';
import bicycleStandIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_bicycle_stand-bw.svg';
import circleIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_circle_border-bw.svg';
import bicycleStandIcon from 'servicemap-ui-turku/assets/icons/icons-icon_bicycle-stand.svg';
import circleIcon from 'servicemap-ui-turku/assets/icons/icons-icon_circle_border.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid, fitToMapBounds } from '../utils/utils';
import MarkerComponent from '../MarkerComponent';
import BicycleStandContent from './components/BicycleStandContent';

const BicycleStands = () => {
  const [bicycleStands, setBicycleStands] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(13);

  const { openMobilityPlatform, showBicycleStands, showHullLockableStands } = useContext(MobilityPlatformContext);

  const useContrast = useSelector(useAccessibleMap);

  const map = useMap();

  const { icon } = global.L;

  const setBaseIcon = useContrast ? bicycleStandIconBw : bicycleStandIcon;
  const setCircleIcon = useContrast ? circleIconBw : circleIcon;

  const customIcon = icon({
    iconUrl: zoomLevel < 14 ? setCircleIcon : setBaseIcon,
    iconSize: zoomLevel < 14 ? [20, 20] : [45, 45],
  });

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('BicycleStand', 500, setBicycleStands);
    }
  }, [openMobilityPlatform, setBicycleStands]);

  const mapEvent = useMapEvents({
    zoomend() {
      setZoomLevel(mapEvent.getZoom());
    },
  });

  /** Return only those bicycle stands that are frame/hull lockable */
  const hullLockableBicycleStands = bicycleStands.reduce((acc, curr) => {
    if (curr.extra.hull_lockable) {
      acc.push(curr);
    }
    return acc;
  }, []);

  /** Return remaining bicycle stands, that are not frame/hull lockable */
  const otherBicycleStands = bicycleStands.reduce((acc, curr) => {
    if (!curr.extra.hull_lockable) {
      acc.push(curr);
    }
    return acc;
  }, []);

  const validBicycleStands = isDataValid(showBicycleStands, otherBicycleStands);
  const validHulllockableStands = isDataValid(showHullLockableStands, hullLockableBicycleStands);

  useEffect(() => {
    fitToMapBounds(validBicycleStands, otherBicycleStands, map);
  }, [showBicycleStands]);

  useEffect(() => {
    fitToMapBounds(validHulllockableStands, hullLockableBicycleStands, map);
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

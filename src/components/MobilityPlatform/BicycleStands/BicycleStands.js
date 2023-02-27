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
import { fetchMobilityMapDataExtra } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid, fitToMapBounds } from '../utils/utils';
import MarkerComponent from '../MarkerComponent';
import BicycleStandContent from './components/BicycleStandContent';

const BicycleStands = () => {
  const [bicycleStands, setBicycleStands] = useState([]);
  const [hullLockableStands, setHullLockableStands] = useState([]);
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
      fetchMobilityMapDataExtra('BicycleStand', 500, 'hull_lockable=false', setBicycleStands);
    }
  }, [openMobilityPlatform, setBicycleStands]);

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapDataExtra('BicycleStand', 500, 'hull_lockable=true', setHullLockableStands);
    }
  }, [openMobilityPlatform, setHullLockableStands]);

  const mapEvent = useMapEvents({
    zoomend() {
      setZoomLevel(mapEvent.getZoom());
    },
  });

  const validBicycleStands = isDataValid(showBicycleStands, bicycleStands);
  const validHulllockableStands = isDataValid(showHullLockableStands, hullLockableStands);

  useEffect(() => {
    fitToMapBounds(validBicycleStands, bicycleStands, map);
  }, [showBicycleStands, bicycleStands]);

  useEffect(() => {
    fitToMapBounds(validHulllockableStands, hullLockableStands, map);
  }, [showHullLockableStands, hullLockableStands]);

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
      {renderBicycleStands(validBicycleStands, bicycleStands)}
      {renderBicycleStands(validHulllockableStands, hullLockableStands)}
    </>
  );
};

export default BicycleStands;

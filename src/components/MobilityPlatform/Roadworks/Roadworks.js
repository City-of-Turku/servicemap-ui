/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import roadworksIcon from 'servicemap-ui-turku/assets/icons/icons-icon_roadworks.svg';
import roadworksIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_roadworks-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { fetchParkingAreaGeometries } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import {
  createIcon, isDataValid, blueOptionsBase, whiteOptionsBase,
} from '../utils/utils';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import config from '../../../../config';

const Roadworks = () => {
  const [roadworksData, setRoadworksData] = useState([]);
  const [fetchError, setFetchError] = useState(false);

  const { showRoadworks } = useMobilityPlatformContext();

  const { icon } = global.L;
  const { Marker, Polyline } = global.rL;

  const useContrast = useSelector(useAccessibleMap);

  const roadworksUrl = config.roadworksAPI;
  const isRoadworksUrl = !roadworksUrl || roadworksUrl === 'undefined' ? null : roadworksUrl;

  const customIcon = icon(createIcon(useContrast ? roadworksIconBw : roadworksIcon));

  const blueOptions = blueOptionsBase();
  const whiteOptions = whiteOptionsBase({ dashArray: !useContrast ? '1, 8' : null });

  useEffect(() => {
    if (showRoadworks && isRoadworksUrl) {
      fetchParkingAreaGeometries(isRoadworksUrl, setRoadworksData);
    }
  }, [showRoadworks]);

  /** Separate roadworks of Turku from the rest */
  const roadworksFiltered = roadworksData.reduce((acc, curr) => {
    if (
      curr.properties?.announcements[0]?.locationDetails?.roadAddressLocation?.primaryPoint?.municipality === 'Turku'
    ) {
      acc.push(curr);
    }
    return acc;
  }, []);

  /** Separate roadworks that contain Point type geometry from the rest */
  const roadworksPoints = roadworksFiltered.reduce((acc, curr) => {
    if (curr.geometry.type === 'Point') {
      acc.push(curr);
    }
    return acc;
  }, []);

  /** Separate roadworks that contain LineString type geometry from the rest */
  const roadworksLines = roadworksFiltered.reduce((acc, curr) => {
    if (curr.geometry.type === 'LineString') {
      acc.push(curr);
    }
    return acc;
  }, []);

  /** Separate roadworks that contain MultiLineString type geometry from the rest */
  const roadworksMultiLines = roadworksFiltered.reduce((acc, curr) => {
    if (curr.geometry.type === 'MultiLineString') {
      acc.push(curr);
    }
    return acc;
  }, []);

  // TODO render line elements
  console.log(roadworksMultiLines);

  const swapCoords = (inputData) => {
    if (inputData?.length > 0) {
      return inputData.map((item) => [item[1], item[0]]);
    }
    return inputData;
  };

  const areMarkersValid = isDataValid(showRoadworks, roadworksPoints);
  const areLinesValid = isDataValid(showRoadworks, roadworksLines);

  const renderMarkers = () => (areMarkersValid
    ? roadworksPoints.map((item) => (
      <Marker
        key={item.properties.situationId}
        icon={customIcon}
        position={[item?.geometry?.coordinates[1], item?.geometry?.coordinates[0]]}
      />
    ))
    : null);

  const renderLines = () => (areLinesValid ? roadworksLines.map((item) => (
    <Polyline
      key={item.properties.situationId}
      weight={useContrast ? 10 : 8}
      pathOptions={useContrast ? whiteOptions : blueOptions}
      positions={swapCoords(item.geometry.coordinates)}
    />
  )) : null);

  return (
    <>
      {renderMarkers()}
      {renderLines()}
    </>
  );
};

export default Roadworks;

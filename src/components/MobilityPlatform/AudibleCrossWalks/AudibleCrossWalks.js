/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import useMobilityDataFetch from '../utils/useMobilityDataFetch';
import {
  isDataValid, fitPolygonsToBounds, blueOptionsBase, whiteOptionsBase,
} from '../utils/utils';

/**
 * Displays audible crosswalks on the map in polygon format.
 */

const AudibleCrossWalks = () => {
  const optionsCrossWalks = {
    type_name: 'VoiceActivatedCrosswalk',
    page_size: 1000,
    latlon: true,
  };

  const { showAudibleCrossWalks } = useMobilityPlatformContext();
  const { Polyline } = global.rL;
  const useContrast = useSelector(useAccessibleMap);
  const blueOptions = blueOptionsBase({ weight: 9 });
  const whiteOptions = whiteOptionsBase({ weight: 9 });
  const crossWalkPathOptions = useContrast ? whiteOptions : blueOptions;
  const map = useMap();
  const { data: crossWalkData } = useMobilityDataFetch(optionsCrossWalks, showAudibleCrossWalks);
  const renderData = isDataValid(showAudibleCrossWalks, crossWalkData);

  useEffect(() => {
    fitPolygonsToBounds(renderData, crossWalkData, map);
  }, [showAudibleCrossWalks, crossWalkData]);

  return (
    renderData
      ? crossWalkData.map(item => (
        <Polyline
          key={item.id}
          crossWalkPathOptions
          pathOptions={crossWalkPathOptions}
          positions={item.geometry_coords}
        />
      ))
      : null
  );
};

export default AudibleCrossWalks;

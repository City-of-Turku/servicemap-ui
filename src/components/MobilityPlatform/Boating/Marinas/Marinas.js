/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import useMobilityDataFetch from '../../utils/useMobilityDataFetch';
import {
  isDataValid, fitPolygonsToBounds, blueOptionsBase, whiteOptionsBase,
} from '../../utils/utils';
import PolygonComponent from '../../PolygonComponent';
import MarinasContent from './components/MarinasContent';

/**
 * Displays marinas on the map in polygon format.
 */

const Marinas = () => {
  const options = {
    type_name: 'Marina',
    latlon: true,
  };
  const { showMarinas } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  const blueOptions = blueOptionsBase({ weight: 5 });
  const whiteOptions = whiteOptionsBase({
    fillOpacity: 0.3,
    weight: 5,
    dashArray: '12',
  });
  const pathOptions = useContrast ? whiteOptions : blueOptions;

  const map = useMap();

  const { data } = useMobilityDataFetch(options, showMarinas);
  const renderData = isDataValid(showMarinas, data);

  useEffect(() => {
    fitPolygonsToBounds(renderData, data, map);
  }, [showMarinas, data]);

  return (
    renderData
      ? data.map(item => (
        <PolygonComponent
          key={item.id}
          item={item}
          useContrast={useContrast}
          pathOptions={pathOptions}
        >
          <MarinasContent name={item.name} berthItem={item} />
        </PolygonComponent>
      ))
      : null
  );
};

export default Marinas;

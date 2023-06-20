/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../../mobilityPlatformRequests/mobilityPlatformRequests';
import {
  isDataValid, fitPolygonsToBounds, blueOptionsBase, whiteOptionsBase,
} from '../../utils/utils';
import PolygonComponent from '../../PolygonComponent';
import MarinasContent from './components/MarinasContent';

/**
 * Displays marinas on the map in polygon format.
 */

const Marinas = () => {
  const [marinasData, setMarinasData] = useState([]);

  const { showMarinas } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  useEffect(() => {
    const options = {
      type_name: 'Marina',
      latlon: true,
    };
    if (showMarinas) {
      fetchMobilityMapData(options, setMarinasData);
    }
  }, [showMarinas, setMarinasData]);

  const blueOptions = blueOptionsBase({ weight: 5 });
  const whiteOptions = whiteOptionsBase({
    fillOpacity: 0.3,
    weight: 5,
    dashArray: '12',
  });
  const pathOptions = useContrast ? whiteOptions : blueOptions;

  const map = useMap();

  const renderData = isDataValid(showMarinas, marinasData);

  useEffect(() => {
    fitPolygonsToBounds(renderData, marinasData, map);
  }, [showMarinas, marinasData]);

  return (
    <>
      {renderData
        ? marinasData.map(item => (
          <PolygonComponent
            key={item.id}
            item={item}
            useContrast={useContrast}
            pathOptions={pathOptions}
          >
            <MarinasContent name={item.name} berthItem={item} />
          </PolygonComponent>
        ))
        : null}
    </>
  );
};

export default Marinas;

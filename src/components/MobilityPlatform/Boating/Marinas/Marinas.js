/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { MobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import { fetchMobilityMapPolygonData } from '../../mobilityPlatformRequests/mobilityPlatformRequests';
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

  const { openMobilityPlatform, showMarinas } = useContext(MobilityPlatformContext);

  const useContrast = useSelector(useAccessibleMap);

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapPolygonData('Marina', 50, setMarinasData);
    }
  }, [openMobilityPlatform, setMarinasData]);

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

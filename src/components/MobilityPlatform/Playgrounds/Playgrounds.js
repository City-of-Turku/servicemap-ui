/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import {
  isDataValid, fitPolygonsToBounds, blueOptionsBase, whiteOptionsBase,
} from '../utils/utils';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import PolygonComponent from '../PolygonComponent';
import PlaygroundsContent from './components/PlaygroundsContent';

/**
 * Displays playgrounds on the map in polygon format.
 */

const Playgrounds = () => {
  const [playgroundData, setPlaygroundData] = useState([]);

  const { showPlaygrounds } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  useEffect(() => {
    const options = {
      type_name: 'PlayGround',
      latlon: true,
      page_size: 400,
    };
    if (showPlaygrounds) {
      fetchMobilityMapData(options, setPlaygroundData);
    }
  }, [showPlaygrounds]);

  const blueOptions = blueOptionsBase({ weight: 5 });
  const whiteOptions = whiteOptionsBase({
    fillOpacity: 0.3,
    weight: 5,
    dashArray: '10 5',
  });
  const pathOptions = useContrast ? whiteOptions : blueOptions;

  const map = useMap();

  const renderData = isDataValid(showPlaygrounds, playgroundData);

  useEffect(() => {
    fitPolygonsToBounds(renderData, playgroundData, map);
  }, [showPlaygrounds, playgroundData]);

  return (
    renderData
      ? playgroundData.map((item) => (
        <PolygonComponent
          key={item.id}
          item={item}
          useContrast={useContrast}
          pathOptions={pathOptions}
        >
          <PlaygroundsContent item={item} />
        </PolygonComponent>
      ))
      : null
  );
};

export default Playgrounds;

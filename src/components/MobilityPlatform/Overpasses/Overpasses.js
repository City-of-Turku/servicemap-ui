/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import {
  isDataValid, fitPolygonsToBounds, blueOptionsBase, whiteOptionsBase,
} from '../utils/utils';
import PolygonComponent from '../PolygonComponent';

/**
 * Displays under and overpasses on the map in polygon format.
 */

const Overpasses = () => {
  const [overpassData, setOverpassData] = useState([]);
  const [underpassData, setUnderpassData] = useState([]);

  const { openMobilityPlatform, showOverpasses, showUnderpasses } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  useEffect(() => {
    const options = {
      type_name: 'Overpass',
      latlon: true,
    };
    if (openMobilityPlatform) {
      fetchMobilityMapData(options, setOverpassData);
    }
  }, [openMobilityPlatform, setOverpassData]);

  useEffect(() => {
    const options = {
      type_name: 'Underpass',
      latlon: true,
    };
    if (openMobilityPlatform) {
      fetchMobilityMapData(options, setUnderpassData);
    }
  }, [openMobilityPlatform, setUnderpassData]);

  const blueOptions = blueOptionsBase({ weight: 5 });
  const whiteOptions = whiteOptionsBase({
    fillOpacity: 0.3,
    weight: 5,
    dashArray: '12',
  });
  const pathOptions = useContrast ? whiteOptions : blueOptions;

  const map = useMap();

  const renderOverpassData = isDataValid(showOverpasses, overpassData);
  const renderUnderpassData = isDataValid(showUnderpasses, underpassData);

  useEffect(() => {
    fitPolygonsToBounds(renderOverpassData, overpassData, map);
  }, [showOverpasses, overpassData]);

  useEffect(() => {
    fitPolygonsToBounds(renderUnderpassData, underpassData, map);
  }, [showUnderpasses, underpassData]);

  return (
    <>
      {renderOverpassData
        ? overpassData.map(item => (
          <PolygonComponent
            key={item.id}
            item={item}
            useContrast={useContrast}
            pathOptions={pathOptions}
          />
        ))
        : null}
      {renderUnderpassData
        ? underpassData.map(item => (
          <PolygonComponent
            key={item.id}
            item={item}
            useContrast={useContrast}
            pathOptions={pathOptions}
          />
        ))
        : null}
    </>
  );
};

export default Overpasses;

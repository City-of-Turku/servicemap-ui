/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import {
  isDataValid, fitPolygonsToBounds, blueOptionsBase, whiteOptionsBase, setRender,
} from '../utils/utils';
import { isEmbed } from '../../../utils/path';

/**
 * Displays underpasses and overpasses on the map in polygon format.
 */

const Overpasses = () => {
  const [overpassData, setOverpassData] = useState([]);
  const [underpassData, setUnderpassData] = useState([]);

  const { openMobilityPlatform, showOverpasses, showUnderpasses } = useMobilityPlatformContext();

  const { Polyline } = global.rL;

  const useContrast = useSelector(useAccessibleMap);

  const url = new URL(window.location);
  const embedded = isEmbed({ url: url.toString() });

  useEffect(() => {
    const options = {
      type_name: 'Overpass',
      page_size: 200,
      latlon: true,
    };
    if (openMobilityPlatform || embedded) {
      fetchMobilityMapData(options, setOverpassData);
    }
  }, [openMobilityPlatform, setOverpassData]);

  useEffect(() => {
    const options = {
      type_name: 'Underpass',
      page_size: 200,
      latlon: true,
    };
    if (openMobilityPlatform || embedded) {
      fetchMobilityMapData(options, setUnderpassData);
    }
  }, [openMobilityPlatform, setUnderpassData]);

  const blueOptions = blueOptionsBase({ weight: 9 });
  const greenOptions = { color: 'rgba(13, 145, 31, 255)', weight: 9 };
  const whiteOptions = whiteOptionsBase({
    weight: 9,
  });
  const underPassPathOptions = useContrast ? whiteOptions : blueOptions;
  const overPassPathOptions = useContrast ? whiteOptions : greenOptions;

  const map = useMap();

  const paramOverpass = url.searchParams.get('overpass') === '1';
  const paramUnderpass = url.searchParams.get('underpass') === '1';
  const renderOverpassData = setRender(paramOverpass, embedded, showOverpasses, overpassData, isDataValid);
  const renderUnderpassData = setRender(paramUnderpass, embedded, showUnderpasses, underpassData, isDataValid);

  useEffect(() => {
    if (!embedded) {
      fitPolygonsToBounds(renderOverpassData, overpassData, map);
    }
  }, [showOverpasses, overpassData]);

  useEffect(() => {
    if (!embedded) {
      fitPolygonsToBounds(renderUnderpassData, underpassData, map);
    }
  }, [showUnderpasses, underpassData]);

  return (
    <>
      {renderOverpassData
        ? overpassData.map(item => (
          <Polyline
            key={item.id}
            pathOptions={overPassPathOptions}
            positions={item.geometry_coords}
          />
        ))
        : null}
      {renderUnderpassData
        ? underpassData.map(item => (
          <Polyline
            key={item.id}
            pathOptions={underPassPathOptions}
            positions={item.geometry_coords}
          />
        ))
        : null}
    </>
  );
};

export default Overpasses;

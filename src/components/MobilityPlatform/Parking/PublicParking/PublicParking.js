/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import { fetchMobilityMapData } from '../../mobilityPlatformRequests/mobilityPlatformRequests';
import {
  isDataValid, blueOptionsBase, whiteOptionsBase, fitPolygonsToBounds,
} from '../../utils/utils';
import PolygonComponent from '../../PolygonComponent';
import PublicParkingContent from './components/PublicParkingContent';

/**
 * Displays public parking places on the map in polygon format.
 */

const PublicParking = () => {
  const [publicParkingData, setPublicParkingData] = useState([]);

  const { openMobilityPlatform, showPublicParking } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  useEffect(() => {
    const options = {
      type_name: 'NoStaffParking',
      page_size: 1000,
      srid: 4326,
      latlon: true,
    };
    if (openMobilityPlatform) {
      fetchMobilityMapData(options, setPublicParkingData);
    }
  }, [openMobilityPlatform, setPublicParkingData]);

  const blueOptions = blueOptionsBase({ weight: 5 });
  const whiteOptions = whiteOptionsBase({ fillOpacity: 0.3, weight: 5, dashArray: '2 4 6' });
  const pathOptions = useContrast ? whiteOptions : blueOptions;

  const map = useMap();

  const renderData = isDataValid(showPublicParking, publicParkingData);

  useEffect(() => {
    fitPolygonsToBounds(renderData, publicParkingData, map);
  }, [showPublicParking, publicParkingData, map]);

  return (
    <>
      {renderData
        && publicParkingData.map(item => (
          <PolygonComponent
            key={item.id}
            item={item}
            useContrast={useContrast}
            pathOptions={pathOptions}
          >
            <PublicParkingContent item={item} />
          </PolygonComponent>
        ))}
    </>
  );
};

export default PublicParking;

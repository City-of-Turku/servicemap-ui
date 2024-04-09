/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import { useMobilityPlatformContext } from '../../../../context/MobilityPlatformContext';
import useMobilityDataFetch from '../../utils/useMobilityDataFetch';
import {
  isDataValid, blueOptionsBase, whiteOptionsBase, fitPolygonsToBounds,
} from '../../utils/utils';
import PolygonComponent from '../../PolygonComponent';
import PublicParkingContent from './components/PublicParkingContent';

/**
 * Displays public parking places on the map in polygon format.
 */

const PublicParking = () => {
  const options = {
    type_name: 'NoStaffParking',
    page_size: 1000,
    latlon: true,
  };
  const { showPublicParking } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);

  const blueOptions = blueOptionsBase({ weight: 5 });
  const whiteOptions = whiteOptionsBase({ fillOpacity: 0.3, weight: 5, dashArray: '2 4 6' });
  const pathOptions = useContrast ? whiteOptions : blueOptions;

  const map = useMap();

  const { data } = useMobilityDataFetch(options, showPublicParking);
  const renderData = isDataValid(showPublicParking, data);

  useEffect(() => {
    fitPolygonsToBounds(renderData, data, map);
  }, [showPublicParking, data, map]);

  return (
    renderData
    && data.map(item => (
      <PolygonComponent key={item.id} item={item} useContrast={useContrast} pathOptions={pathOptions}>
        <PublicParkingContent item={item} />
      </PolygonComponent>
    ))
  );
};

export default PublicParking;

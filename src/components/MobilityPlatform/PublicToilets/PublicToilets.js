import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import publicToiletIcon from 'servicemap-ui-turku/assets/icons/icons-icon_toilet.svg';
import publicToiletIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_toilet-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import useMobilityDataFetch from '../utils/useMobilityDataFetch';
import { createIcon, isDataValid, fitToMapBounds } from '../utils/utils';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { selectMapRef } from '../../../redux/selectors/general';
import MarkerComponent from '../MarkerComponent';
import PublicToiletsContent from './components/PublicToiletsContent';

const PublicToilets = () => {
  const options = {
    type_name: 'PublicToilet',
    page_size: 50,
  };

  const { showPublicToilets } = useMobilityPlatformContext();

  const useContrast = useSelector(useAccessibleMap);
  const map = useSelector(selectMapRef);

  const { icon } = global.L;
  const customIcon = icon(createIcon(useContrast ? publicToiletIconBw : publicToiletIcon));

  const { data } = useMobilityDataFetch(options, showPublicToilets);
  const renderData = isDataValid(showPublicToilets, data);

  useEffect(() => {
    fitToMapBounds(renderData, data, map);
  }, [renderData, data, map]);

  return (
    renderData
      ? data.map(item => (
        <MarkerComponent key={item.id} item={item} icon={customIcon}>
          <PublicToiletsContent />
        </MarkerComponent>
      ))
      : null
  );
};

export default PublicToilets;

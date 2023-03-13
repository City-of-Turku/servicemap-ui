/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import publicToiletIcon from 'servicemap-ui-turku/assets/icons/icons-icon_toilet.svg';
import publicToiletIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_toilet-bw.svg';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid, fitToMapBounds } from '../utils/utils';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import MarkerComponent from '../MarkerComponent';
import PublicToiletsContent from './components/PublicToiletsContent';

const PublicToilets = () => {
  const [publicToiletsData, setPublicToiletsData] = useState([]);

  const { openMobilityPlatform, showPublicToilets } = useMobilityPlatformContext();

  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const customIcon = icon(createIcon(useContrast ? publicToiletIconBw : publicToiletIcon));

  useEffect(() => {
    const options = {
      type_name: 'PublicToilet',
      page_size: 50,
      srid: 4326,
    };
    if (openMobilityPlatform) {
      fetchMobilityMapData(options, setPublicToiletsData);
    }
  }, [openMobilityPlatform, setPublicToiletsData]);

  const renderData = isDataValid(showPublicToilets, publicToiletsData);

  const map = useMap();

  useEffect(() => {
    fitToMapBounds(renderData, publicToiletsData, map);
  }, [showPublicToilets, publicToiletsData]);

  return (
    <>
      {renderData
        ? publicToiletsData.map(item => (
          <MarkerComponent key={item.id} item={item} icon={customIcon}>
            <PublicToiletsContent />
          </MarkerComponent>
        ))
        : null}
    </>
  );
};

export default PublicToilets;

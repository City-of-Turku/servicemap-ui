import React, { useEffect, useState, useContext } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import publicToiletIcon from 'servicemap-ui-turku/assets/icons/icons-icon_toilet.svg';
import publicToiletIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_toilet-bw.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid, fitToMapBounds } from '../utils/utils';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import MarkerComponent from '../MarkerComponent';
import PublicToiletsContent from './components/PublicToiletsContent';

const PublicToilets = () => {
  const [publicToiletsData, setPublicToiletsData] = useState([]);

  const { openMobilityPlatform, showPublicToilets } = useContext(MobilityPlatformContext);

  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const customIcon = icon(createIcon(useContrast ? publicToiletIconBw : publicToiletIcon));

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('PublicToilet', 100, setPublicToiletsData);
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

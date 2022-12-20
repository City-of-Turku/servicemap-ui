import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import publicToiletIcon from 'servicemap-ui-turku/assets/icons/icons-icon_toilet.svg';
import publicToiletIconBw from 'servicemap-ui-turku/assets/icons/contrast/icons-icon_toilet-bw.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { createIcon, isDataValid, fitToMapBounds } from '../utils/utils';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import PublicToiletsContent from './components/PublicToiletsContent';

const PublicToilets = () => {
  const [publicToiletsData, setPublicToiletsData] = useState([]);

  const { openMobilityPlatform, mobilityMap } = useContext(MobilityPlatformContext);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const useContrast = useSelector(useAccessibleMap);

  const customIcon = icon(createIcon(useContrast ? publicToiletIconBw : publicToiletIcon));

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('PublicToilet', 100, setPublicToiletsData);
    }
  }, [openMobilityPlatform, setPublicToiletsData]);

  const map = useMap();

  const showRestrooms = mobilityMap.restRooms;
  const renderData = isDataValid(showRestrooms, publicToiletsData);

  useEffect(() => {
    fitToMapBounds(renderData, publicToiletsData, map);
  }, [showRestrooms, publicToiletsData]);

  return (
    <>
      {renderData ? (
        publicToiletsData.map(item => (
          <Marker
            key={item.id}
            icon={customIcon}
            position={[item.geometry_coords.lat, item.geometry_coords.lon]}
          >
            <Popup>
              <PublicToiletsContent />
            </Popup>
          </Marker>
        ))
      ) : null}
    </>
  );
};

export default PublicToilets;

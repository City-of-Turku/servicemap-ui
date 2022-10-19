import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import publicToiletIcon from 'servicemap-ui-turku/assets/icons/icons-icon_toilet.svg';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import { fetchMobilityMapData } from '../mobilityPlatformRequests/mobilityPlatformRequests';
import { isDataValid, createIcon } from '../utils/utils';
import PublicToiletsContent from './components/PublicToiletsContent';

const PublicToilets = () => {
  const [publicToiletsData, setPublicToiletsData] = useState([]);

  const { openMobilityPlatform, mobilityMap } = useContext(MobilityPlatformContext);

  const { Marker, Popup } = global.rL;
  const { icon } = global.L;

  const customIcon = icon(createIcon(publicToiletIcon));

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapData('APT', 100, setPublicToiletsData);
    }
  }, [openMobilityPlatform, setPublicToiletsData]);

  const map = useMap();

  const renderData = isDataValid(mobilityMap.restRooms, publicToiletsData);

  useEffect(() => {
    if (renderData) {
      const bounds = [];
      publicToiletsData.forEach((item) => {
        bounds.push([item.geometry_coords.lat, item.geometry_coords.lon]);
      });
      map.fitBounds(bounds);
    }
  }, [mobilityMap.restRooms, publicToiletsData, map]);

  return (
    <>
      {renderData
        && publicToiletsData.map(item => (
          <Marker key={item.id} icon={customIcon} position={[item.geometry_coords.lat, item.geometry_coords.lon]}>
            <Popup>
              <PublicToiletsContent />
            </Popup>
          </Marker>
        ))}
    </>
  );
};

export default PublicToilets;

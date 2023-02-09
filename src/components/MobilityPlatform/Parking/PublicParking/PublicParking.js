import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import MobilityPlatformContext from '../../../../context/MobilityPlatformContext';
import { fetchMobilityMapPolygonData } from '../../mobilityPlatformRequests/mobilityPlatformRequests';
import {
  isDataValid, blueOptionsBase, whiteOptionsBase, fitPolygonsToBounds,
} from '../../utils/utils';

/**
 * Displays public parking places on the map in polygon format.
 */

const PublicParking = () => {
  const [publicParkingData, setPublicParkingData] = useState([]);

  const { openMobilityPlatform, showPublicParking } = useContext(MobilityPlatformContext);

  const useContrast = useSelector(useAccessibleMap);

  const { Polygon, Popup } = global.rL;

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapPolygonData('NoStaffParking', 1000, setPublicParkingData);
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
          <Polygon key={item.id} pathOptions={pathOptions} positions={item.geometry_coords}>
            <Popup>
              <p>lorem ipsum</p>
            </Popup>
          </Polygon>
        ))}
    </>
  );
};

export default PublicParking;

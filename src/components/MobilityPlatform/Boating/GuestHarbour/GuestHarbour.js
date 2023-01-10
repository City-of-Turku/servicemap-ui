import React, { useContext, useEffect, useState } from 'react';
import { useMap } from 'react-leaflet';
import { useSelector } from 'react-redux';
import MobilityPlatformContext from '../../../../context/MobilityPlatformContext';
import { useAccessibleMap } from '../../../../redux/selectors/settings';
import { fetchMobilityMapPolygonData } from '../../mobilityPlatformRequests/mobilityPlatformRequests';
import { fitPolygonsToBounds, isDataValid } from '../../utils/utils';

/**
 * Displays quest harbour on the map in polygon format.
 */

const GuestHarbour = () => {
  const [guestHarbourData, setGuestHarbourData] = useState([]);

  const { openMobilityPlatform, showGuestHarbour } = useContext(MobilityPlatformContext);

  const useContrast = useSelector(useAccessibleMap);

  const { Polygon } = global.rL;

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapPolygonData('GuestMarina', 50, setGuestHarbourData);
    }
  }, [openMobilityPlatform, setGuestHarbourData]);

  const blueOptions = { color: 'rgba(7, 44, 115, 255)', weight: 5 };
  const whiteOptions = {
    color: 'rgba(255, 255, 255, 255)',
    fillOpacity: 0.3,
    weight: 5,
    dashArray: '8 2 8',
  };
  const pathOptions = useContrast ? whiteOptions : blueOptions;

  const map = useMap();

  const renderData = isDataValid(showGuestHarbour, guestHarbourData);

  useEffect(() => {
    fitPolygonsToBounds(renderData, guestHarbourData, map);
  }, [showGuestHarbour, guestHarbourData]);

  return (
    <>
      {renderData
        ? guestHarbourData.map(item => (
          <Polygon
            key={item.id}
            pathOptions={pathOptions}
            positions={item.geometry_coords}
            eventHandlers={{
              mouseover: (e) => {
                e.target.setStyle({ fillOpacity: useContrast ? '0.6' : '0.2' });
              },
              mouseout: (e) => {
                e.target.setStyle({ fillOpacity: useContrast ? '0.3' : '0.2' });
              },
            }}
          />
        ))
        : null}
    </>
  );
};

export default GuestHarbour;

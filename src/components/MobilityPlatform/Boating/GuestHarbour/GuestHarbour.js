import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import MobilityPlatformContext from '../../../../context/MobilityPlatformContext';
import { fetchMobilityMapPolygonData } from '../../mobilityPlatformRequests/mobilityPlatformRequests';

/**
 * Displays quest harbour on the map in polygon format.
 */

const GuestHarbour = () => {
  const [guestHarbourData, setGuestHarbourData] = useState([]);

  const { openMobilityPlatform, showGuestHarbour } = useContext(MobilityPlatformContext);

  const mapType = useSelector(state => state.settings.mapType);

  const { Polygon } = global.rL;

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapPolygonData('GMA', 50, setGuestHarbourData);
    }
  }, [openMobilityPlatform, setGuestHarbourData]);

  const blueOptions = { color: 'rgba(7, 44, 115, 255)', weight: 5 };

  const greenOptions = { color: 'rgba(145, 232, 58, 255)', fillOpacity: 0.3, weight: 5 };
  const pathOptions = mapType === 'accessible_map' ? greenOptions : blueOptions;

  const map = useMap();

  useEffect(() => {
    if (showGuestHarbour && guestHarbourData && guestHarbourData.length > 0) {
      const bounds = [];
      guestHarbourData.forEach((item) => {
        bounds.push(item.geometry_coords);
      });
      map.fitBounds(bounds);
    }
  }, [showGuestHarbour, guestHarbourData, map]);

  return (
    <>
      {showGuestHarbour
        && guestHarbourData
        && guestHarbourData.length > 0
        && guestHarbourData.map(item => <Polygon key={item.id} pathOptions={pathOptions} positions={item.geometry_coords} />)}
    </>
  );
};

export default GuestHarbour;

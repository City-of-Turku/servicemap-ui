import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import MobilityPlatformContext from '../../../../context/MobilityPlatformContext';
import MarinasContent from './components/MarinasContent';
import { fetchMobilityMapPolygonData } from '../../mobilityPlatformRequests/mobilityPlatformRequests';

/**
 * Displays marinas on the map in polygon format.
 */

const Marinas = () => {
  const [marinasData, setMarinasData] = useState([]);

  const { openMobilityPlatform, mobilityMap } = useContext(MobilityPlatformContext);

  const mapType = useSelector(state => state.settings.mapType);

  const { Polygon, Popup } = global.rL;

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapPolygonData('MAR', 50, setMarinasData);
    }
  }, [openMobilityPlatform, setMarinasData]);

  const blueOptions = { color: 'rgba(7, 44, 115, 255)', weight: 5 };

  const greenOptions = { color: 'rgba(145, 232, 58, 255)', fillOpacity: 0.3, weight: 5 };
  const pathOptions = mapType === 'accessible_map' ? greenOptions : blueOptions;

  const map = useMap();

  useEffect(() => {
    if (mobilityMap.marinas && marinasData && marinasData.length > 0) {
      const bounds = [];
      marinasData.forEach((item) => {
        bounds.push(item.geometry_coords);
      });
      map.fitBounds(bounds);
    }
  }, [mobilityMap.marinas, marinasData, map]);

  return (
    <>
      {mobilityMap.marinas
        && marinasData
        && marinasData.length > 0
        && marinasData.map(item => (
          <Polygon key={item.id} pathOptions={pathOptions} positions={item.geometry_coords}>
            <Popup>
              <MarinasContent name={item.name} berths={item.extra.berths} />
            </Popup>
          </Polygon>
        ))}
    </>
  );
};

export default Marinas;

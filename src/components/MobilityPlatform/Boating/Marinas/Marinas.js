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

  const { openMobilityPlatform, showMarinas } = useContext(MobilityPlatformContext);

  const mapType = useSelector(state => state.settings.mapType);

  const { Polygon, Popup } = global.rL;

  useEffect(() => {
    if (openMobilityPlatform) {
      fetchMobilityMapPolygonData('MAR', 50, setMarinasData);
    }
  }, [openMobilityPlatform, setMarinasData]);

  const useContrast = mapType === 'accessible_map';

  const blueOptions = { color: 'rgba(7, 44, 115, 255)', weight: 5 };
  const whiteOptions = {
    color: 'rgba(255, 255, 255, 255)', fillOpacity: 0.3, weight: 5, dashArray: '12',
  };
  const pathOptions = useContrast ? whiteOptions : blueOptions;

  const map = useMap();

  useEffect(() => {
    if (showMarinas && marinasData && marinasData.length > 0) {
      const bounds = [];
      marinasData.forEach((item) => {
        bounds.push(item.geometry_coords);
      });
      map.fitBounds(bounds);
    }
  }, [showMarinas, marinasData, map]);

  return (
    <>
      {showMarinas
        && marinasData
        && marinasData.length > 0
        && marinasData.map(item => (
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
          >
            <Popup>
              <MarinasContent name={item.name} berths={item.extra.berths} />
            </Popup>
          </Polygon>
        ))}
    </>
  );
};

export default Marinas;

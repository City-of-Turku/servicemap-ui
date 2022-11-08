import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import ParkingChargeZoneContent from './components/ParkingChargeZoneContent';

const ParkingChargeZones = () => {
  const {
    showParkingChargeZones, parkingChargeZones, parkingChargeZoneId,
  } = useContext(MobilityPlatformContext);

  const mapType = useSelector(state => state.settings.mapType);

  const parkingChargeZone = parkingChargeZones.find(item => item.id === parkingChargeZoneId);

  const renderOneParkingChargeZone = !!(showParkingChargeZones && parkingChargeZone && Object.entries(parkingChargeZone).length > 0);

  const { Polygon, Popup } = global.rL;

  const useContrast = mapType === 'accessible_map';

  const blackOptions = {
    color: 'rgba(0, 0, 0, 255)',
    fillOpacity: 0.2,
    weight: 5,
  };

  const whiteOptions = {
    color: 'rgba(255, 255, 255, 255)', fillOpacity: 0.3, weight: 5, dashArray: '2 10 10 10',
  };
  const pathOptions = useContrast ? whiteOptions : blackOptions;

  const map = useMap();

  useEffect(() => {
    if (showParkingChargeZones && parkingChargeZone) {
      const bounds = parkingChargeZone.geometry_coords;
      map.fitBounds(bounds);
    }
  }, [showParkingChargeZones, parkingChargeZone]);

  return (
    <>
      {renderOneParkingChargeZone ? (
        <div>
          <Polygon
            pathOptions={pathOptions}
            positions={parkingChargeZone.geometry_coords}
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
              <ParkingChargeZoneContent parkingChargeZone={parkingChargeZone} />
            </Popup>
          </Polygon>
        </div>
      ) : null}
    </>
  );
};

export default ParkingChargeZones;

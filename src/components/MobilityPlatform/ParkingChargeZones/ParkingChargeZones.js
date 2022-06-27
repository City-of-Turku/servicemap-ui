import React, { useContext, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import ParkingChargeZoneContent from './components/ParkingChargeZoneContent';

const ParkingChargeZones = () => {
  const { showParkingChargeZones, parkingChargeZones, parkingChargeZoneId } = useContext(MobilityPlatformContext);

  const mapType = useSelector(state => state.settings.mapType);

  const parkingChargeZone = useMemo(
    () => parkingChargeZones.find(item => item.id === parkingChargeZoneId),
    [parkingChargeZones, parkingChargeZoneId],
  );

  const renderOneParkingChargeZone = !!(
    showParkingChargeZones
    && parkingChargeZone
    && Object.entries(parkingChargeZone).length > 0
  );

  const { Polygon, Popup } = global.rL;

  const blackOptions = {
    fillColor: 'rgba(0, 0, 0, 255)',
    color: 'rgba(0, 0, 0, 255)',
    fillOpacity: 0.3,
    weight: 5,
  };

  const greenOptions = { color: 'rgba(145, 232, 58, 255)', fillOpacity: 0.3, weight: 6 };
  const pathOptions = mapType === 'accessible_map' ? greenOptions : blackOptions;

  const map = useMap();

  useEffect(() => {
    if (showParkingChargeZones && parkingChargeZone) {
      const bounds = parkingChargeZone.geometry_coords;
      map.fitBounds(bounds);
    }
  }, [showParkingChargeZones, parkingChargeZone, map]);

  return (
    <>
      {renderOneParkingChargeZone ? (
        <div>
          <Polygon pathOptions={pathOptions} positions={parkingChargeZone.geometry_coords}>
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

import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import ParkingChargeZoneContent from './components/ParkingChargeZoneContent';

const ParkingChargeZones = () => {
  const {
    mobilityMap, parkingChargeZones, parkingChargeZoneId,
  } = useContext(MobilityPlatformContext);

  const mapType = useSelector(state => state.settings.mapType);

  const parkingChargeZone = parkingChargeZones.find(item => item.id === parkingChargeZoneId);

  const renderOneParkingChargeZone = !!(mobilityMap.parkingChargeZones && parkingChargeZone && Object.entries(parkingChargeZone).length > 0);

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
    if (mobilityMap.parkingChargeZones && parkingChargeZone) {
      const bounds = parkingChargeZone.geometry_coords;
      map.fitBounds(bounds);
    }
  }, [mobilityMap.parkingChargeZones, parkingChargeZone]);

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

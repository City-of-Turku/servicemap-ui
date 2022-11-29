import React, { useContext, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useMap } from 'react-leaflet';
import { isObjValid } from '../utils/utils';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import MobilityPlatformContext from '../../../context/MobilityPlatformContext';
import ParkingChargeZoneContent from './components/ParkingChargeZoneContent';

const ParkingChargeZones = () => {
  const {
    showParkingChargeZones, parkingChargeZones, parkingChargeZoneId,
  } = useContext(MobilityPlatformContext);

  const parkingChargeZone = parkingChargeZones.find(item => item.id === parkingChargeZoneId);

  const renderOneParkingChargeZone = isObjValid(showParkingChargeZones, parkingChargeZone);

  const { Polygon, Popup } = global.rL;

  const useContrast = useSelector(useAccessibleMap);

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
      ) : null}
    </>
  );
};

export default ParkingChargeZones;

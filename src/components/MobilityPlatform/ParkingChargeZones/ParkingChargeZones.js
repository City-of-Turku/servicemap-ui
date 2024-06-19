/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { isObjValid, blackOptionsBase, whiteOptionsBase } from '../utils/utils';
import { useAccessibleMap } from '../../../redux/selectors/settings';
import { selectMapRef } from '../../../redux/selectors/general';
import { useMobilityPlatformContext } from '../../../context/MobilityPlatformContext';
import ParkingChargeZoneContent from './components/ParkingChargeZoneContent';
import PolygonComponent from '../PolygonComponent';

const ParkingChargeZones = () => {
  const { showParkingChargeZones, parkingChargeZones, parkingChargeZoneId } = useMobilityPlatformContext();

  const parkingChargeZone = parkingChargeZones.find(item => item.id === parkingChargeZoneId);

  const renderOneParkingChargeZone = isObjValid(showParkingChargeZones, parkingChargeZone);

  const useContrast = useSelector(useAccessibleMap);
  const map = useSelector(selectMapRef);

  const blackOptions = blackOptionsBase({ fillOpacity: 0.2, weight: 5 });
  const whiteOptions = whiteOptionsBase({ fillOpacity: 0.3, weight: 5, dashArray: '2 10 10 10' });
  const pathOptions = useContrast ? whiteOptions : blackOptions;

  useEffect(() => {
    if (showParkingChargeZones && parkingChargeZone) {
      const bounds = parkingChargeZone.geometry_coords;
      map.fitBounds(bounds);
    }
  }, [showParkingChargeZones, parkingChargeZone]);

  return (renderOneParkingChargeZone ? (
    <PolygonComponent
      item={parkingChargeZone}
      useContrast={useContrast}
      pathOptions={pathOptions}
    >
      <ParkingChargeZoneContent parkingChargeZone={parkingChargeZone} />
    </PolygonComponent>
  ) : null
  );
};

export default ParkingChargeZones;
